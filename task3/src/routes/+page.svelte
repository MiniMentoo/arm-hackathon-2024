<script lang="ts">
	import type { ActionData } from "./$types";

    let stockMarketBroDetected: boolean;
    $: stockMarketBroDetected = false;
    let companySelectorPlaceholder: string;
    $: companySelectorPlaceholder = "What company did you buy from?";

    export let form: ActionData;
</script>

<svelte:head>
    <title>Stock Gain / Loss Calculator</title>
</svelte:head>

<article class="form">
    <h1>Stock Gain / Loss Calculator</h1>
    <h5>a.k.a Stock market bro detector</h5>
    <form method="POST">
        <input type="number" name="stockValue" placeholder="How much did you spend? (USD$)" />
        <input type="date" name="dateBought" />
        <input type="text" disabled={stockMarketBroDetected} placeholder={companySelectorPlaceholder} on:click={() => {
            if (!stockMarketBroDetected) {
                stockMarketBroDetected = true;
                companySelectorPlaceholder += "(Jk we don't care)"
            }
        }} />
        <button type="submit">Were your stocks a waste of time,<br>or are they worth your entire personality?</button>
    </form>
</article>

{#if form?.success}
    <article class="insights">
        <p>{form.symbol}</p>
        <p>{form.name}</p>
        <p>{form.price}</p>
    </article>
{/if}

<style>
</style>