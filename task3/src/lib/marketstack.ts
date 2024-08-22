import { env } from '$env/dynamic/private';

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

export const getPrice = async (symbol: string): Promise<number> => {
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

// Returns -1 if no price wasn't found.
export const getOldPrice = async (
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
