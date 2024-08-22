import { env } from '$env/dynamic/private';
import type { Actions } from '@sveltejs/kit';

export const actions: Actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const stockValue = data.get('stockValue');
		const dateBought = data.get('dateBought');

		if (!stockValue || !dateBought) {
			return {
				success: false
			};
		}

		// CALCULATE STOCK DATA
		const { symbol, name } = await getRandomNasdaqCompany();
		const price = await getPrice(symbol);

		return {
			price,
			symbol,
			name,
			apiKey: env.TWELVEDATA_API_KEY,
			stockValue,
			dateBought,
			success: true
		};
	}
};

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

const getRandomNasdaqCompany = async () => {
	const res = await fetch(
		getAuthedTwelvedataUrl('/stocks', {
			source: 'docs',
			exchange: 'NASDAQ'
		})
	);
	const { data, count } = await res.json();
	const index = Math.random() * count;
	return {
		symbol: data[0].symbol,
		name: data[0].name
	};
};

const getPrice = async (symbol: string): Promise<number> => {
	const res = await fetch(
		getAuthedTwelvedataUrl('/price', {
			source: 'docs',
			symbol
		})
	);
	const { price } = await res.json();
	return parseFloat(price);
};
