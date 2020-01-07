import { mergeLines, fillUnmappedToken } from './tokenizer-tools';

/* add custom tokens to fill unmapped parts of row */

/* */
export default getTokens => (lines, hash) => {
	const content = mergeLines(lines);
	return getTokens(content).then(tokens => ({
		tokens: fillUnmappedToken(tokens, content),
		hash,
	}));
};
