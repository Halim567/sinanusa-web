<script lang="ts">
    import type { PageData } from './$types';
    import ErrorCard from '$lib/components/not-reuseable/error-card.svelte';
    import DetailUmumCard from './detail-umum-card.svelte';
    import ActionCard from './action-card.svelte';
    import FormCard from './form-card.svelte';

    const { data }: { data: PageData } = $props();
</script>

<div class="p-4 grid place-items-center">
    {#if data.form}
        <div class="w-1/3 grid gap-4">
            <FormCard/>
            <DetailUmumCard/>
            <ActionCard/>
        </div>
    {:else}
        <ErrorCard/>
    {/if}
</div>