<script lang="ts">
    import { Badge } from '$lib/components/ui/badge';
    import * as Card from '$lib/components/ui/card';
    import { formatInTimeZone } from 'date-fns-tz';

    import type { PageData } from './$types';
    import { AlertCircle } from 'lucide-svelte';

    let { data }: { data: PageData } = $props();
</script>

<div class="grid gap-4 p-4">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {#if data.error}
            <div class="w-full h-full col-span-4 grid place-items-center">
                <Card.Root class="w-fit border-red-500">
                    <Card.Header class="p-4">
                        <Card.Title class="text-lg flex items-center gap-2 text-red-500">
                            <AlertCircle/>
                            Terdapat Kesalahan
                        </Card.Title>
                        <Card.Description>Terdapat kesalahan yang tidak terduga. Gagal mengambil data kelas, silakan coba lagi nanti</Card.Description>
                    </Card.Header>
                </Card.Root>
            </div>
        {:else if data.classroomData}
            {#each data.classroomData as item}
                <a href="/elearning/{item.judul_classroom}?id={item.classroom_id}">
                    <Card.Root class="border-2 hover:border-blue-400 transition-all duration-150">
                        <Card.Header>
                            <Card.Title>
                                <h1 class="text-xl">{ item.judul_classroom }</h1>
                                <small class="text-gray-500 font-normal text-sm">{ item.nama_pengajar }</small>
                            </Card.Title>
                        </Card.Header>
                        <Card.Content class="grid gap-6">
                            <div class="grid gap-2">
                                <small>Mata Pelajaran : <Badge class="bg-green-500 hover:bg-green-500">{ item.mata_pelajaran }</Badge></small>
                                <small>Kelas : <span class="text-gray-500">{ item.kelas }</span></small>
                                <small>Dibuat pada : <span class="text-gray-500">{ formatInTimeZone(new Date(item.dibuat_pada!), 'Asia/Jakarta', "yyyy-MM-dd, 'Pukul' HH:mm 'WIB'") }</span></small>
                            </div>
                            <div class="flex items-center justify-between">
                                <p><span>{ item.jumlah_siswa }</span> Siswa</p>
                                <p>{ item.kode }</p>
                            </div>
                        </Card.Content>
                    </Card.Root>
                </a>
            {:else}
                {#if data.userRole === "Guru"}
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
                                    Tidak ada kelas
                                </Card.Title>
                                <Card.Description>Anda belum memiliki kelas, silakan buat kelas terlebih dahulu</Card.Description>
                            </Card.Header>
                        </Card.Root>
                    </div>
                {:else if data.userRole === "Siswa"}
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
                                    Tidak ada kelas
                                </Card.Title>
                                <Card.Description>Anda belum join kelas, silakan gabung ke kelas terlebih dahulu</Card.Description>
                            </Card.Header>
                        </Card.Root>
                    </div>
                {/if}
            {/each}
        {/if}
    </div>
</div>