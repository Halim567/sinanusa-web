<script lang="ts">
    import * as Card from "$lib/components/ui/card";
    import { Badge } from "$lib/components/ui/badge";

    import type { PageData } from './$types';
    import { formatInTimeZone } from "date-fns-tz";
    import { File, Upload } from "lucide-svelte";
    import { Button } from "$lib/components/ui/button";
    import ErrorCard from "$lib/components/not-reuseable/error-card.svelte";

    let { data }: { data: PageData } = $props();
</script>

<div class="grid gap-4 place-items-center p-4">
    {#if data.penugasan !== undefined}
        {#each data.penugasan as penugasan}
            <Card.Root class="w-[64rem] max-w-[64rem]">
                <Card.Header>
                    <Card.Title class="text-lg">{penugasan.namaPenugasan}</Card.Title>
                    <Card.Description>{penugasan.deskripsi}</Card.Description>
                </Card.Header>
                <Card.Content class="pt-4 grid gap-4">
                    <div class="grid gap-2">
                        <small class="">Dibuat pada : <span class="text-gray-500">{formatInTimeZone(new Date(penugasan.dibuatPada), 'Asia/Jakarta', "yyyy-MM-dd, 'Pukul' HH:mm 'WIB'")}</span></small>
                        <small class="flex items-center gap-1">
                            Tipe :
                            {#if penugasan.tipePenugasan === "Materi"}
                                <Badge class="bg-blue-500">{penugasan.tipePenugasan}</Badge>
                            {:else if penugasan.tipePenugasan === "Tugas"}
                                <Badge class="bg-orange-500">{penugasan.tipePenugasan}</Badge>
                            {:else if penugasan.tipePenugasan === "Ujian"}
                                <Badge class="bg-red-500">{penugasan.tipePenugasan}</Badge>
                            {/if}
                        </small>
                        {#if penugasan.tipePenugasan === "Tugas" || penugasan.tipePenugasan === "Ujian"}
                            <small>
                                Batas pengumpulan : 
                                <span class="text-gray-500">
                                    {#if penugasan.batasPengumpulan !== null}
                                        {formatInTimeZone(new Date(penugasan.batasPengumpulan), 'Asia/Jakarta', "yyyy-MM-dd, 'Pukul' HH:mm 'WIB'")}
                                    {:else}
                                        Tidak ada batas pengumpulan
                                    {/if}
                                </span>
                            </small>
                            {#if penugasan.submissionSelesai && !penugasan.submissionTerlambat}
                                <small>
                                    Status : <Badge class="bg-green-500">Sudah Mengumpulkan</Badge>
                                </small>
                            {:else if penugasan.submissionSelesai && penugasan.submissionTerlambat}
                                <small>
                                    Status : <Badge class="bg-yellow-500">Terlambat Mengumpulkan</Badge>
                                </small>
                            {:else}
                                <small>
                                    Status : <Badge class="bg-red-500">Belum Mengumpulkan</Badge>
                                </small>
                            {/if}
                        {/if}
                    </div>
                    {#if penugasan.fileDatas !== null || !penugasan.submissionSelesai}
                        <div class="grid gap-3">
                            {#if penugasan.fileDatas !== null}
                                <div class="grid gap-1">
                                    Lampiran :
                                    {#each (penugasan.fileDatas as { url: string, name: string }[]) as file}
                                        <Button variant="link" href={file.url} class="flex items-center gap-2 w-fit p-0 h-fit"><File size={20}/> <span class="text-sm">{file.name}</span></Button>
                                    {/each}
                                </div>
                            {/if}
                            {#if (penugasan.tipePenugasan === "Tugas" || penugasan.tipePenugasan === "Ujian") && !penugasan.submissionSelesai && data.user.role === "Siswa"}
                                <Button
                                    variant="outline"
                                    class="border-blue-500 border-2 [&_svg]:size-5"
                                >
                                    <Upload />
                                </Button>
                            {/if}
                        </div>
                    {/if}
                </Card.Content>
            </Card.Root>
        {:else}
            <div class="w-full h-full col-span-4 grid place-items-center">
                <Card.Root class="w-fit">
                    <Card.Header class="p-4">
                        <Card.Title class="text-lg flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                <g fill="none" stroke="currentColor" stroke-width="1.5">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="m7.5 11l1 5" />
                                    <path d="M3.04 4.294a.5.5 0 0 1 .191-.479C3.927 3.32 6.314 2 12 2s8.073 1.32 8.769 1.815a.5.5 0 0 1 .192.479l-1.7 12.744a4 4 0 0 1-1.98 2.944l-.32.183a10 10 0 0 1-9.922 0l-.32-.183a4 4 0 0 1-1.98-2.944z" />
                                    <path d="M3 5c2.571 2.667 15.429 2.667 18 0" />
                                </g>
                            </svg>
                            Tidak ada Penugasan
                        </Card.Title>
                        <Card.Description>
                            {#if data.user?.role === "Guru"}
                                Anda belum memiliki Penugasan, silakan buat penugasan terlebih dahulu
                            {:else}
                                Kelas ini tidak memiliki penugasan
                            {/if}
                        </Card.Description>
                    </Card.Header>
                </Card.Root>
            </div>
        {/each}
    {:else}
        <ErrorCard/>
    {/if}
</div>