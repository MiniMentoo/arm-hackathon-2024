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
		const { price: ogPrice, error } = await getOldPrice(symbol, dateBought.toString());

		if (error) {
			return {
				success: false,
				error
			};
		}

		const numberOfStocksBought = Math.floor(parseFloat(String(stockValue)) / ogPrice);
		const revenue = numberOfStocksBought * price;
		const profit = revenue - parseFloat(String(stockValue));

		return {
			profit,
			numberOfStocksBought,
			ogPrice,
			price,
			symbol,
			name,
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

const marketStackUrl = 'https://api.marketstack.com/v1';

const getAuthedMarketStackUrl = (path: string, params: { [key: string]: string } = {}) => {
	const access_key = env.MARKETSTACK_API_KEY;
	const queryParams = new URLSearchParams({
		...params,
		access_key
	});
	console.log(`${marketStackUrl}${path}?${queryParams}`);
	return new URL(`${marketStackUrl}${path}?${queryParams}`);
};

const getRandomNasdaqCompany = async () => {
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

const getPrice = async (symbol: string): Promise<number> => {
	const res = await fetch(
		getAuthedMarketStackUrl('/eod/latest', {
			symbols: symbol
		})
	);
	console.log(res.status);
	const { data } = await res.json();
	console.log(data);
	return parseFloat(data[0].close);
};

// Returns -1 if no price was found.
const getOldPrice = async (
	symbol: string,
	date: string
): Promise<{ price: number; error?: string }> => {
	const res = await fetch(
		getAuthedMarketStackUrl(`/eod/${date}`, {
			symbols: symbol
		})
	);
	console.log(res.status);
	const { data } = await res.json();
	if (data.length == 0) {
		return {
			price: -1,
			error: `Stock value not found for ${symbol} on date ${date}. Womp womp, try again.`
		};
	}
	return {
		price: parseFloat(data[0].close)
	};
};
