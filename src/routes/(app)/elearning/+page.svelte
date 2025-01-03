<script lang="ts">
    import { Badge } from '$lib/components/ui/badge';
    import * as Card from '$lib/components/ui/card';
    import { formatInTimeZone } from 'date-fns-tz';
    import ErrorCard from '$lib/components/not-reuseable/error-card.svelte';

    import type { PageData } from './$types';
    import NoDataCard from '$lib/components/not-reuseable/no-data-card.svelte';
    import { Skeleton } from '$lib/components/ui/skeleton';

    const { data }: { data: PageData } = $props();
</script>

<div class="grid gap-4 p-4">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
		{#await data.dataKelas}
			{#each Array.from({ length: 3 }) as _}
				<Skeleton class="h-[244.4px] w-[456.25px] rounded-xl border-2"/>
			{/each}
		{:then result} 
			{#each result as item}
				<a href="/elearning/{item.namakelas}?id={item.id}">
					<Card.Root class="border-2 hover:border-blue-400 transition-all duration-150">
						<Card.Header>
							<Card.Title>
								<h1 class="text-xl">{ item.namakelas }</h1>
								<small class="text-gray-500 font-normal text-sm">{ item.namapengajar }</small>
							</Card.Title>
						</Card.Header>
						<Card.Content class="grid gap-6">
							<div class="grid gap-2">
								<small>Mata Pelajaran : <Badge class="bg-green-500 hover:bg-green-500">{ item.matapelajaran }</Badge></small>
								<small>Kelas : <span class="text-gray-500">{ item.kelas }</span></small>
								<small>Dibuat pada : <span class="text-gray-500">{ formatInTimeZone(new Date(item.dibuatpada!), 'Asia/Jakarta', "yyyy-MM-dd, 'Pukul' HH:mm 'WIB'") }</span></small>
							</div>
							<div class="flex items-center justify-between">
								<p><span>{ item.jumlahsiswa }</span> Siswa</p>
								<p>{ item.kode }</p>
							</div>
						</Card.Content>
					</Card.Root>
				</a>
			{:else}
				<NoDataCard 
					title="Tidak ada kelas" 
					variant="no-data" 
					roleGuruMsg="Anda tidak memiliki kelas, silakan buat kelas terlebih dahulu" 
					roleSiswaMsg="Anda tidak mengikuti kelas manapun, silakan join kelas terlebih dahulu"
                />
			{/each}
		{:catch}
			<ErrorCard internalErrorMsg="Terdapat kesalahan yang tidak terduga. Gagal mengambil data kelas, silakan coba lagi nanti"/>
		{/await}
    </div>
</div>
