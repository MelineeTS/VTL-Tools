import { mergeLines } from './tokenizer-tools';

/* */
export const getTokensDefault = text => [
	{ start: 0, stop: text.length, value: text, className: 'unmapped' },
];

export default (lines, hash) => {
	const content = mergeLines(lines);
	return Promise.resolve({ tokens: getTokensDefault(content), hash });
};

export const getSyncDefaultTokens = lines => {
	const content = mergeLines(lines);
	return getTokensDefault(content);
};
