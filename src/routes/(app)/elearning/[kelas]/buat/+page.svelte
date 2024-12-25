<script lang="ts">
    import FormPenugasan from "$lib/components/not-reuseable/form-penugasan.svelte";
    import * as Card from "$lib/components/ui/card";
    import { toast } from "svelte-sonner";

    import type { PageData } from './$types';

    let { data }: { data: PageData } = $props();
</script>

<div class="p-4 grid place-items-center gap-4">
    {#if data.error === undefined}
        <Card.Root class="w-1/3">
            <Card.Header>
                <Card.Title class="text-lg">Buat {data.tipePenugasan}</Card.Title>
                <Card.Description>
                    {#if data.tipePenugasan === "Tugas"}
                        Buat materi baru untuk siswa. Masukan judul dan deskripsi materi yang akan dibuat, dan lampiran jika ada.
                    {:else}
                        Buat tugas baru untuk siswa. Masukan judul, deadline dan deskripsi tugas yang akan dibuat, dan lampiran jika ada.
                    {/if}
                </Card.Description>
            </Card.Header>
            <Card.Content>
                <FormPenugasan 
                    tipePenugasan={data.tipePenugasan as any} 
                    data={data.form} 
                    action="?/create-penugasan&classroomId={data.params}&tipe={data.tipePenugasan}"
                    onRedirect={() => toast.success("Penugasan berhasil dibuat!")}
                />
            </Card.Content>
        </Card.Root>
    {/if}
</div>