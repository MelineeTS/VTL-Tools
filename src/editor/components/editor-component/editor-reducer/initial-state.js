import { getTokensDefault } from '../tokenizer';

/* */
const initialState = {
	rowHeight: 22,
	scrollRange: { start: 0, stop: 0, offset: 0 },
	horizontalRange: { start: 0, stop: 0, offset: 0 },
	lines: [{ value: '', tokens: [] }],
	index: 0,
	focusedRow: undefined,
	prefix: undefined,
	suggesterState: { open: false, index: -1, value: undefined, size: 0 },
	selection: undefined,
	cursorRect: undefined,
	editorEl: undefined,
	errors: [],
	getTokens: getTokensDefault,
	tokenize: false,
	tokens: [],
};

export default initialState;
