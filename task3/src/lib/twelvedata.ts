import { env } from '$env/dynamic/private';

const twelveDataUrl = 'https://api.twelvedata.com';

const getAuthedTwelvedataUrl = (path: string, params: { [key: string]: string } = {}) => {
	const apikey = env.TWELVEDATA_API_KEY;
	const queryParams = new URLSearchParams({
		...params,
		apikey
	});
	console.log(`${twelveDataUrl}${path}?${queryParams}`);
	return new URL(`${twelveDataUrl}${path}?${queryParams}`);
};

export const getRandomNasdaqCompany = async () => {
	const res = await fetch(
		getAuthedTwelvedataUrl('/stocks', {
			source: 'docs',
			exchange: 'NASDAQ'
		})
	);
	const { data, count } = await res.json();
	const index = Math.floor(Math.random() * count);
	return {
		symbol: data[index].symbol,
		name: data[index].name
	};
};
