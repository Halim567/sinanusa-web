<script lang="ts">
    import * as Card from "$lib/components/ui/card";
    import { Badge } from "$lib/components/ui/badge";
	import { Button } from "$lib/components/ui/button";
	import NoDataCard from "$lib/components/not-reuseable/no-data-card.svelte";
	import { Skeleton } from "$lib/components/ui/skeleton";
    import { File, Upload } from "lucide-svelte";

    import type { PageData } from './$types';
    import { formatInTimeZone } from "date-fns-tz";
    import Action from "./action.svelte";

    let { data }: { data: PageData } = $props();

    let open = $state(false);
</script>

<div class="grid gap-4 place-items-center p-4">
	{#await data.penugasan}
		{#each Array.from({ length: 3 }) as _}
			<Skeleton class="w-[64rem] max-w-[64rem] h-[16rem]"/>	
		{/each}
	{:then result}
		{#each result as penugasan}
			<Card.Root class="w-[64rem] max-w-[64rem]">
				<Card.Header>
					<Card.Title class="text-lg flex items-center justify-between">
                        {penugasan.nama_penugasan}
                        {#if data.user.role === "Guru"}
                            <Action nama_penugasan={penugasan.nama_penugasan} id={penugasan.id} tipe_penugasan={penugasan.tipe_penugasan}/>
                        {/if}
                    </Card.Title>
					<Card.Description>{penugasan.deskripsi}</Card.Description>
				</Card.Header>
				<Card.Content class="pt-4 grid gap-4">
					<div class="grid gap-2">
						<small class="">Dibuat pada : <span class="text-gray-500">{formatInTimeZone(new Date(penugasan.dibuat_pada), 'Asia/Jakarta', "yyyy-MM-dd, 'Pukul' HH:mm 'WIB'")}</span></small>
						<small class="flex items-center gap-1">
							Tipe :
							{#if penugasan.tipe_penugasan === "Materi"}
								<Badge class="bg-blue-500">{penugasan.tipe_penugasan}</Badge>
							{:else}
								<Badge class="bg-orange-500">{penugasan.tipe_penugasan}</Badge>
							{/if}
						</small>
						{#if penugasan.tipe_penugasan === "Tugas"}
							<small>
								Batas pengumpulan : 
								<span class="text-gray-500">
									{#if penugasan.batasPengumpulan !== null}
										{formatInTimeZone(new Date(penugasan.batas_pengumpulan), 'Asia/Jakarta', "yyyy-MM-dd, 'Pukul' HH:mm 'WIB'")}
									{:else}
										Tidak ada batas pengumpulan
									{/if}
								</span>
							</small>
                            {#if data.user.role === "Siswa"}                         
                                {#if penugasan.selesai && !penugasan.terlambat}
                                    <small>
                                        Status : <Badge class="bg-green-500">Sudah Mengumpulkan</Badge>
                                    </small>
                                {:else if penugasan.selesai && penugasan.terlambat}
                                    <small>
                                        Status : <Badge class="bg-yellow-500">Terlambat Mengumpulkan</Badge>
                                    </small>
                                {:else}
                                    <small>
                                        Status : <Badge class="bg-red-500">Belum Mengumpulkan</Badge>
                                    </small>
                                {/if}
                            {/if}
						{/if}
					</div>
					{#if penugasan.file_lampiran !== null || !penugasan.selesai}
						<div class="grid gap-3">
							{#if penugasan.file_lampiran !== null}
								<div class="grid gap-1">
									Lampiran :
									{#each penugasan.file_lampiran as file}
										<Button variant="link" href={file.url} class="flex items-center gap-2 w-fit p-0 h-fit"><File size={20}/> <span class="text-sm">{file.name}</span></Button>
									{/each}
								</div>
							{/if}
							{#if penugasan.tipe_penugasan === "Tugas" && !penugasan.selesai && data.user.role === "Siswa"}
								<Button variant="outline" class="border-blue-500 border-2 [&_svg]:size-5">
									<Upload />
								</Button>
							{/if}
						</div>
					{/if}
				</Card.Content>
			</Card.Root>
		{:else}
			<NoDataCard
				variant="no-data"
				title="Tidak ada Penugasan"
				roleGuruMsg="Anda belum memiliki Penugasan, silakan buat penugasan terlebih dahulu"
				roleSiswaMsg="Kelas ini tidak memiliki penugasan"
			/>
		{/each}
	{/await}
</div>
