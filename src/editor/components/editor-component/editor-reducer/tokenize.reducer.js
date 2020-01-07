import * as actions from '../editor-actions';
import { hashLines } from '../common-tools';

const LF = '\n';

/* */
export const mergeLines = lines =>
	lines.reduce((a, { value }) => `${a}${value}${LF}`, '');

/* TOKENIZE_ALL */
const reduceLaunchTokenization = (tokens, hash) => state => {
	return { ...state, tokens };
};

/* */
const reduceTokenizeAll = state => ({ ...state, tokenize: true });

/* */
const reducer = (state, action) => {
	switch (action.type) {
		/* SET_GET_TOKENS */
		case actions.SET_GET_TOKENS:
			return { ...state, getTokens: action.payload.getTokens };
		/* TOKENIZE_ALL */
		case actions.TOKENIZE_ALL:
			return reduceTokenizeAll(state);
		/* LAUNCH_TOKENIZATION */
		case actions.LAUNCH_TOKENIZATION:
			return reduceLaunchTokenization(
				action.payload.tokens,
				action.payload.hash
			)(state);
		default:
			return state;
	}
};

export default reducer;
