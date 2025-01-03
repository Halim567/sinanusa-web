<script lang="ts">
    import * as Card from "$lib/components/ui/card";
    import { AlertCircle } from "lucide-svelte";
    import { page } from "$app/state";

    const {
        internalErrorTitle = "Terjadi Kesalahan",
        notFoundErrorTitle = "Data Tidak Ditemukan",
        internalErrorMsg = "Terdapat kesalahan yang tidak terduga. Gagal mengambil data, silakan coba lagi nanti", 
        notFoundErrorMsg = "Data yang anda cari tidak ditemukan, Data tersebut mungkin telah dihapus atau tidak tersedia."
    }: {
        internalErrorTitle?: string,
        notFoundErrorTitle?: string,
        internalErrorMsg?: string,
        notFoundErrorMsg?: string
    } = $props();
</script>

<div class="w-full h-full col-span-4 grid place-items-center">
    <Card.Root class="w-fit border-red-500">
        <Card.Header class="p-4">
            <Card.Title class="text-lg flex items-center gap-2 text-red-500">
                <AlertCircle/>
                {#if page.data.errorNotFound}
                    {notFoundErrorTitle}
                {:else if page.data.error}
                    {internalErrorTitle}
                {/if}
            </Card.Title>
            <Card.Description>
                {#if page.data.errorNotFound}
                    {notFoundErrorMsg}
                {:else if page.data.error}
                    {internalErrorMsg}
                {/if}
            </Card.Description>
        </Card.Header>
    </Card.Root>
</div>