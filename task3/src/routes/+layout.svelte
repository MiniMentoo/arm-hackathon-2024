<script lang="ts">
    let darkMode: boolean;
    $: darkMode = false;
    let darkModeData;
    $: darkModeData = () => darkMode ? "dark" : "light";

    let theme: string;
    $: theme = "";
</script>

<svelte:head>
    <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico{theme}.min.css"
    />
</svelte:head>

<div data-theme={darkModeData()} class={darkModeData()}>

    <header>
        <!-- TODO dark mode toggle and theme selector -->
         <button on:click={() => {
            darkMode = !darkMode
         }}>Toggle Dark/Light</button>
    </header>

    <main>
        <slot></slot>
    </main>

</div>

<style>
    .dark {
        background-color: #000000;
    }
    .light {
        background-color: #ffffff;
    }

    header {
        padding: 0.5rem;
    }

    main {
        height: 100vh;
        padding: 1rem;
    }
    .dark > main {
        background-color: #111111;
    }
    .light > main {
        background-color: #eeeeee;
    }

    /* Header styles */
    button.compressed {
        padding: 0.1rem;
        font-size: medium;
    }
</style>