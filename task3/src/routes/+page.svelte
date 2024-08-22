<script lang="ts">
	import type { ActionData } from "./$types";

    let companySelectorBlocked: boolean;
    $: companySelectorBlocked = false;
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
    <p>Disclaimer: I do not know how stocks work.</p>
    <form method="POST">
        <input type="number" name="stockValue" placeholder="How much did you spend? (USD$)" />
        <input type="date" name="dateBought" />
        <input type="text" disabled={companySelectorBlocked} placeholder={companySelectorPlaceholder} on:click={() => {
            if (!companySelectorBlocked) {
                companySelectorBlocked = true;
                companySelectorPlaceholder += "(Jk we don't care)"
            }
        }} />
        <button type="submit">Were your stocks a waste of time,<br>or are they worth your entire personality?</button>
    </form>
</article>

{#if form?.success}
    <article class="insights">
        <p>You bought stocks from {form.symbol} ({form.name})</p>
        <p>The stock price on {form.dateBought} was {form.ogPrice}</p>
        <p>So you bought {form.numberOfStocksBought} stocks.</p>
        <p>The stock price today is {form.price}.</p>
        <p>THEREFORE YOU MADE ${form.profit?.toFixed(2)}</p>
        {#if form.profit > 0}
            <h3>You are a certified stock market bro.</h3>
        {:else}
            <h3>Its so over for you</h3>
        {/if}
    </article>
{:else if form?.error}
    <article class="insights">
        <p>Error: {form.error}</p>
    </article>
{/if}
