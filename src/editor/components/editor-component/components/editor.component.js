import React, { useContext, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { hashLines } from '../common-tools';
import ScrollUpDown from './scrollbar-up.component';
import ScrollHor from './scrollbar-hor.component';
import Line from './line.component';
import Overlay from './overlay.component';
import * as actions from '../editor-actions';
import EditorContext from './editor-context';
import { getSyncDefaultTokens } from '../tokenizer/get-tokens-default';

const getKey = (value, i) => `${i}-${value}`;

const computeScrollRange = (parentEl, rowHeight) => {
	const { height } = parentEl.getBoundingClientRect();
	const offset = Math.round(height / rowHeight);
	return { start: 0, stop: offset - 1, offset };
};

const computeHorizontalRange = (parentEl, chasse) => {
	const { width } = parentEl.getBoundingClientRect();
	const offset = Math.round(width / chasse);
	return { start: 0, stop: offset - 1, offset };
};

/**
 *
 * @param {*} param0
 */
const checkTokensLines = lines => tokens => {
	const nl = lines.map(({ value, start }) => {
		const lf = start + value.length;
		return {
			value,
			start,
			tokens: tokens.reduce((a, t) => {
				const tStart = Math.max(0, start - t.start);
				const tLength = Math.min(lf, t.stop) - Math.max(start, t.start) + 1;
				return Math.max(t.stop, lf) - Math.min(t.start, start) <=
					value.length + t.stop - t.start
					? [
							...a,
							{
								...t,
								value: t.value.substr(tStart, tLength),
								start: Math.max(t.start, start) - start,
								stop: Math.min(t.stop, lf) - start,
							},
					  ]
					: a;
			}, []),
		};
	});

	return nl;
};

const Editor = React.memo(({ parse }) => {
	const editorEl = useRef();
	const state = useContext(EditorContext);
	const {
		lines,
		dispatch,
		scrollRange,
		rowHeight,
		chasse,
		tokenize,
		getTokens,
		handleChange,
		tokens: tokensState,
	} = state;

	useEffect(() => {
		const code = lines.reduce(
			(a, { value }) => (value.length > 0 ? `${a}${value}\n` : a),
			''
		);
		// const { errors } = parse(code);
		// handleChange(errors);
		// dispatch(actions.updateErrors(errors));
	}, [lines, parse, dispatch]);

	const { visiblesLines } = lines.reduce(
		(a, line, i) =>
			i >= scrollRange.start && i <= scrollRange.stop
				? {
						visiblesLines: [...a.visiblesLines, { ...line, start: a.start }],
						start: a.start + line.value.length + 1,
				  }
				: { ...a, start: a.start + line.value.length + 1 },
		{ visiblesLines: [], start: 0 }
	);

	useEffect(() => {
		if (tokenize) {
			/*
			 calcul d'une signature sur les lignes, à vérifier au moment de la tokenization.
			*/
			const hash = hashLines(lines);

			getTokens(lines, hash).then(({ tokens, hash: hashInitial }) => {
				dispatch(actions.launchTokenization(tokens, hashInitial));
				dispatch(actions.checkPrefix()); // TODO un peu trop brutal ici
			});
			// dispatch(actions.launchTokenization(getSyncDefaultTokens(lines), hash));
		}
	}, [tokenize, lines]);

	useEffect(() => {
		if (editorEl.current) {
			dispatch(
				actions.setScrollrange(computeScrollRange(editorEl.current, rowHeight))
			);
			dispatch(actions.setEditorEl(editorEl.current));
			if (chasse) {
				dispatch(
					actions.setHorizontalRange(
						computeHorizontalRange(editorEl.current, chasse)
					)
				);
			}
		}
	}, [editorEl, rowHeight, chasse, dispatch]);

	return (
		<div className="editor-container">
			<div ref={editorEl} className="editor">
				{checkTokensLines(visiblesLines)(tokensState).map(
					({ tokens, value }, i) => (
						<Line key={getKey(value, i)} tokens={tokens} row={i} />
					)
				)}
			</div>
			<ScrollUpDown parentEl={editorEl.current} />
			<ScrollHor parentEl={editorEl.current} />
			<Overlay lines={lines} el={editorEl} />
		</div>
	);
};)

Editor.propTypes = {
	parse: PropTypes.func.isRequired,
};

export default Editor;
