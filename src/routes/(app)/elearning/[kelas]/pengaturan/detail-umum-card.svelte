<script lang="ts">
    import { Button } from '$lib/components/ui/button';
    import * as Card from '$lib/components/ui/card';
    import * as Dialog from '$lib/components/ui/dialog';
    import { Copy, Fullscreen } from 'lucide-svelte';
    import { toast } from 'svelte-sonner';

    import { page } from '$app/state';
    import { formatInTimeZone } from 'date-fns-tz';

    let open = $state(false);
</script>

<Card.Root>
    <Card.Header>
        <Card.Title class="text-lg">Detail Umum</Card.Title>
    </Card.Header>
    <Card.Content>
        <div class="w-full font-semibold grid gap-4">
            <div class="grid gap-4 pr-4">
                <small class="flex items-center justify-between">Dibuat pada<span class="text-gray-500 font-normal">{formatInTimeZone(new Date(page.data.classroomData.dibuat_pada!), 'Asia/Jakarta', "yyyy-MM-dd, 'Pukul' HH:mm 'WIB'")}</span></small>
                <small class="flex items-center justify-between">Kode kelas<span class="text-gray-500 font-normal">{page.data.classroomData.kode}</span></small>
                <small class="flex items-center justify-between">Jumlah Siswa<span class="text-gray-500 font-normal">{page.data.classroomData.jumlah_siswa}</span></small>
                <small class="flex items-center justify-between">Nama Pengajar<span class="text-gray-500 font-normal">{page.data.classroomData.nama}</span></small>
            </div>
            <small class="flex items-center justify-between">
                Tampilkan Kode kelas
                <Dialog.Root {open} onOpenChange={e => open = e}>
                    <Dialog.Trigger>
                        <Button variant="ghost" class="text-blue-500">Tampilkan <Fullscreen/></Button>
                    </Dialog.Trigger>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title class="font-normal">Kode Kelas</Dialog.Title>
                        </Dialog.Header>
                        <h1 class="font-bold text-5xl text-center my-12">{page.data.classroomData.kode}</h1>
                        <div class="flex items-center justify-between">
                            <small>{page.data.classroomData.nama_kelas}</small>
                            <Button onclick={() => { 
                                navigator.clipboard.writeText(page.data.classroomData.kode!);
                                toast.success('Kode kelas berhasil disalin');
                                open = false;
                            }} variant="ghost" class="text-blue-500"><Copy/> Salin Kode</Button>
                        </div>
                    </Dialog.Content>
                </Dialog.Root>
            </small>
        </div>
    </Card.Content>
</Card.Root>
