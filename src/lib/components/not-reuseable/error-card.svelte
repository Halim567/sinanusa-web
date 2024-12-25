<script lang="ts">
    import * as Card from "$lib/components/ui/card";
    import { AlertCircle } from "lucide-svelte";
    import { page } from "$app/state";
</script>

<div class="w-full h-full col-span-4 grid place-items-center">
    <Card.Root class="w-fit border-red-500">
        <Card.Header class="p-4">
            <Card.Title class="text-lg flex items-center gap-2 text-red-500">
                <AlertCircle/>
                {#if page.data.errorNotFound}
                    Kelas Tidak Ditemukan
                {:else if page.data.error}
                    Terdapat Kesalahan
                {/if}
            </Card.Title>
            <Card.Description>
                {#if page.data.errorNotFound}
                    Kelas yang anda cari tidak ditemukan, kelas tersebut mungkin telah dihapus atau tidak tersedia.
                {:else if page.data.error}
                    Terdapat kesalahan yang tidak terduga. Gagal mengambil data kelas, silakan coba lagi nanti
                {/if}
            </Card.Description>
        </Card.Header>
    </Card.Root>
</div>