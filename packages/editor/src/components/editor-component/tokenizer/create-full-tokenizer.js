import { mergeLines } from './tokenizer-tools';

/* add custom tokens to fill unmapped parts of row */

/* */
const fillUnmappedToken = (tokensOriginal, ligne) => {
	const result = tokensOriginal.reduce(
		({ index, tokens }, token) =>
			index < token.start
				? {
						index: token.stop + 1,
						tokens: [
							...tokens,
							{
								start: index,
								stop: token.start - 1,
								className: 'unmapped',
								value: ligne.substr(index, token.start - index),
							},
							token,
						],
				  }
				: { index: token.stop + 1, tokens: [...tokens, token] },
		{ index: 0, tokens: [] }
	);

	if (result.index < ligne.length) {
		return [
			...result.tokens,
			{
				start: result.index,
				stop: ligne.length - 1,
				className: 'unmapped',
				typeName: 'unknow',
				value: ligne.substr(result.index, ligne.length - result.index),
			},
		];
	}

	return result.tokens;
};

/* */
export default getTokens => (lines, hash) => {
	const content = mergeLines(lines);
	return getTokens(content).then(tokens => ({
		tokens: fillUnmappedToken(tokens, content),
		hash,
	}));
};
