<script lang="ts">
    import * as Card from '$lib/components/ui/card';

    import { page } from '$app/state';

    const {
		variant = "no-data",
        title, 
        roleGuruMsg, 
        roleSiswaMsg,
		defaultMsg
    }: {
		variant: "no-data" | "not-found"
        title: string;
        roleGuruMsg?: string;
        roleSiswaMsg?: string;
		defaultMsg?: string;
    } = $props();
</script>

<div class="w-full h-full col-span-4 grid place-items-center">
    <Card.Root class="w-fit {variant === "no-data" ? undefined : "border border-red-500"}">
        <Card.Header class="p-4">
            <Card.Title class="text-lg flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <g fill="none" stroke="currentColor" stroke-width="1.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m7.5 11l1 5" />
                        <path d="M3.04 4.294a.5.5 0 0 1 .191-.479C3.927 3.32 6.314 2 12 2s8.073 1.32 8.769 1.815a.5.5 0 0 1 .192.479l-1.7 12.744a4 4 0 0 1-1.98 2.944l-.32.183a10 10 0 0 1-9.922 0l-.32-.183a4 4 0 0 1-1.98-2.944z" />
                        <path d="M3 5c2.571 2.667 15.429 2.667 18 0" />
                    </g>
                </svg>
                {title}
            </Card.Title>
            <Card.Description>
                {#if roleGuruMsg && page.data.user?.role === "Guru"}
                    {roleGuruMsg}
                {:else if roleSiswaMsg && page.data.user?.role === "Siswa"}
                    {roleSiswaMsg}
				{:else}
					{defaultMsg}
                {/if}
            </Card.Description>
        </Card.Header>
    </Card.Root>
</div>
