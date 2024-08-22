import { getOldPrice, getPrice } from '$lib/marketstack';
import { getRandomNasdaqCompany } from '$lib/twelvedata';
import type { Actions } from '@sveltejs/kit';

export const actions: Actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const stockBudget = data.get('stockValue');
		const dateBought = data.get('dateBought');

		if (!stockBudget || !dateBought) {
			return {
				success: false
			};
		}

		const { symbol, name } = await getRandomNasdaqCompany();
		const price = await getPrice(symbol);
		const { price: ogPrice, error } = await getOldPrice(symbol, dateBought.toString());

		if (error) {
			return {
				success: false,
				error
			};
		}

		const numberOfStocksBought = Math.floor(parseFloat(String(stockBudget)) / ogPrice);
		const moneyActuallySpent = numberOfStocksBought * ogPrice;
		const revenue = numberOfStocksBought * price;
		const profit = revenue - moneyActuallySpent;

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
