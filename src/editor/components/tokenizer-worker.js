const vtlWorker = new Worker('/worker-vtl-2.0-insee.js');

export const getTokens = content => {
	return new Promise(resolve => {
		const start = new Date();
		console.log('tokenize start');
		vtlWorker.postMessage({ action: 'tokenize', content });
		vtlWorker.onmessage = e => {
			const end = new Date();
			console.log('resolve', end - start);
			resolve(e.data);
		};
	});
};

export const parse = () => {};
