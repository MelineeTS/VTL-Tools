import React, { useState } from 'react';
import { Editor } from './editor-component/components';
import Console from './console';
// import getTools from '../../antlr-tools';
import { getTokens } from './tokenizer-worker';
import { composeShortcuts } from './editor-component';
import '../app.scss';
import '../vtl-tokens.scss';

const shortcuts = composeShortcuts({
	'ctrl|s': () => {
		console.log('save');
		return true;
	},
	'shift|ctrl|R': () => {
		console.log('Renaud est super balaise !');
		return true;
	},
});

export default props => {
	const [errors, setErrors] = useState([]);
	return (
		<>
			<div className="workbench-display">
				<Editor
					shortcuts={shortcuts}
					handleChange={errors => {
						setErrors(errors);
					}}
					parse={() => []}
					getTokens={getTokens}
					{...props}
				/>
			</div>
			<div className="workbench-console">
				<Console errors={errors} />
			</div>
		</>
	);
};
