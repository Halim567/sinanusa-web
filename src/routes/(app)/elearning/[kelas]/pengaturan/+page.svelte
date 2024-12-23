<script lang="ts">
    import * as Card from '$lib/components/ui/card';
    import * as Dialog from '$lib/components/ui/dialog';
    import ClassroomForm from '$lib/components/not-reuseable/classroom-form.svelte';
    import { Button } from '$lib/components/ui/button';
    import { toast } from 'svelte-sonner';
    import * as AlertDialog from '$lib/components/ui/alert-dialog';

    import { formatInTimeZone } from 'date-fns-tz';
    import type { PageData } from './$types';
    import { Copy, Fullscreen, Trash2, TriangleAlert, AlertCircle } from 'lucide-svelte';
    import { enhance } from '$app/forms';
    import type { SubmitFunction } from '@sveltejs/kit';
    import Loading from '$lib/components/ui/loading/loading.svelte';

    const { data }: { data: PageData } = $props();

    let open = $state(false);
    let loading = $state(false);

    const onSubmit: SubmitFunction = () => {
        loading = true;

        return async ({ update, result }) => {
            if (result.type === "redirect") {
                toast.success('Kelas berhasil dihapus');
            } else if (result.type === "failure" || result.type === "error") {
                toast.error('Gagal menghapus kelas');
            }

            loading = false;
            await update();
        };
    };
</script>

<div class="p-4 grid place-items-center">
    {#if data.error || !data.classroomData || Object.values(data.classroomData).some(v => v === null)}
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
    {:else if data.form}
        <div class="w-1/3 grid gap-4">
            <Card.Root>
                <Card.Header>
                    <Card.Title class="text-lg">Detail Ruang Kelas</Card.Title>
                </Card.Header>
                <Card.Content>
                    <ClassroomForm 
                        data={data.form} 
                        action="/elearning?/update-classroom&id={data.classroomData.classroom_id}"
                        onSubmit={({ form }) => {
                            if (form.message && form.message.success) {
                                toast.success('Kelas berhasil diperbarui');
                            }
                        }}
                    />
                </Card.Content>
            </Card.Root>
            <Card.Root>
                <Card.Header>
                    <Card.Title class="text-lg">Detail Umum</Card.Title>
                </Card.Header>
                <Card.Content>
                    <div class="w-full font-semibold grid gap-4">
                        <div class="grid gap-4 pr-4">
                            <small class="flex items-center justify-between">Dibuat pada<span class="text-gray-500 font-normal">{formatInTimeZone(new Date(data.classroomData.dibuat_pada!), 'Asia/Jakarta', "yyyy-MM-dd, 'Pukul' HH:mm 'WIB'")}</span></small>
                            <small class="flex items-center justify-between">Kode kelas<span class="text-gray-500 font-normal">{data.classroomData.kode}</span></small>
                            <small class="flex items-center justify-between">Jumlah Siswa<span class="text-gray-500 font-normal">{data.classroomData.jumlah_siswa}</span></small>
                            <small class="flex items-center justify-between">Nama Pengajar<span class="text-gray-500 font-normal">{data.classroomData.nama_pengajar}</span></small>
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
                                    <h1 class="font-bold text-5xl text-center my-12">{data.classroomData.kode}</h1>
                                    <div class="flex items-center justify-between">
                                        <small>{data.classroomData.judul_classroom}</small>
                                        <Button onclick={() => { 
                                            navigator.clipboard.writeText(data.classroomData.kode!);
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
            <Card.Root>
                <Card.Header>
                    <Card.Title class="text-lg">Aksi</Card.Title>
                </Card.Header>
                <Card.Content class="grid gap-4">
                    <div class="w-full p-4 border-red-500 border rounded-lg flex items-center justify-between">
                        <small class="flex items-center gap-2">
                            <TriangleAlert color="red"/>
                            <span class="text-red-500">
                                Hapus ruang kelas ini.<br/>
                                Semua data akan dihapus secara permanen.
                            </span>
                        </small>
                        <AlertDialog.Root open={loading ? false : undefined}>
                            <AlertDialog.Trigger>
                                <Button class="bg-red-500 hover:bg-red-700"><Trash2/> Hapus Kelas</Button>
                            </AlertDialog.Trigger>
                            <AlertDialog.Content class="w-80 rounded-md p-4 lg:w-fit">
                                <AlertDialog.Header>
                                    <AlertDialog.Title class="flex items-center gap-2">
                                        <TriangleAlert color="red"/>
                                        <span class="text-red-500">Hapus Kelas</span>
                                    </AlertDialog.Title>
                                    <AlertDialog.Description class="text-start">
                                        Apakah anda yakin ingin menghapus kelas ini? Semua data yang terkait dengan kelas ini akan dihapus secara permanen.
                                    </AlertDialog.Description>
                                </AlertDialog.Header>
                                <AlertDialog.Footer>
                                    <AlertDialog.Cancel>Batal</AlertDialog.Cancel>
                                    <form action="/elearning?/delete-classroom&id={data.classroomData.classroom_id}" method="POST" use:enhance={onSubmit}>
                                        <Button disabled={loading} type="submit" class="bg-red-500 hover:bg-red-700"><Trash2/> Hapus Kelas</Button>
                                    </form>
                                </AlertDialog.Footer>
                            </AlertDialog.Content>
                        </AlertDialog.Root>
                        <AlertDialog.Root open={loading}>
                            <AlertDialog.Content class="w-80 rounded-md p-4 lg:w-fit">
                                <AlertDialog.Header class="grid place-items-center gap-2">
                                    <AlertDialog.Title >
                                        <Loading/>
                                    </AlertDialog.Title>
                                    <AlertDialog.Description class="text-start">
                                        Sedang menghapus kelas...
                                    </AlertDialog.Description>
                                </AlertDialog.Header>
                            </AlertDialog.Content>
                        </AlertDialog.Root>
                    </div>
                </Card.Content>
            </Card.Root>
        </div>
    {/if}
</div>