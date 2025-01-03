<script lang="ts">
    import FormPenugasan from "$lib/components/not-reuseable/form-penugasan.svelte";
    import * as Card from "$lib/components/ui/card";
    import { toast } from "svelte-sonner";
    import ErrorCard from "$lib/components/not-reuseable/error-card.svelte";

    import type { PageData } from './$types';

    let { data }: { data: PageData } = $props();
</script>

<div class="p-4 grid place-items-center gap-4">
    {#if data.tipePenugasan !== undefined}
        <Card.Root class="w-1/3">
            <Card.Header>
                <Card.Title class="text-lg">Perbaharui {data.tipePenugasan}</Card.Title>
                <Card.Description>
                    {#if data.tipePenugasan === "Tugas"}
                        Perbaharui tugas yang sudah ada. Ubah judul, deadline dan deskripsi tugas yang akan dibuat, dan lampiran jika ada.
                    {:else}
                        Perbaharui materi yang sudah ada. Ubah judul dan deskripsi materi yang akan dibuat, dan lampiran jika ada.
                    {/if}
                </Card.Description>
            </Card.Header>
            <Card.Content>
                <FormPenugasan 
                    tipePenugasan={data.tipePenugasan as any} 
                    data={data.form}
                    action="?/update-penugasan&classroomId={data.params}&tipe={data.tipePenugasan}&id_penugasan={data.id_penugasan}"
                    onRedirect={() => toast.success("Penugasan berhasil dibuat!")}
                />
            </Card.Content>
        </Card.Root>
    {:else}
        <ErrorCard/>
    {/if}
</div>