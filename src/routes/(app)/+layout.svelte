<script lang="ts">
    import SideMenu from '$lib/components/not-reuseable/sidemenu.svelte';
    import NavBreadcrumb from '$lib/components/not-reuseable/nav-breadcrumb.svelte';
    import { Button } from '$lib/components/ui/button';
    import { BookMarked, ClipboardList, List, LogOut, Plus, Settings, Users2 } from 'lucide-svelte';
    import { Separator } from '$lib/components/ui/separator';
    import * as Dialog from '$lib/components/ui/dialog';
    import * as Popover from '$lib/components/ui/popover';
    import ClassroomForm from '$lib/components/not-reuseable/classroom-form.svelte';
    
    import { toast } from 'svelte-sonner';
    import type { Snippet } from 'svelte';
    import type { LayoutData } from './$types';

    const { data, children }: { data: LayoutData, children: Snippet } = $props();

    let isscroll = $state(false);
    let openDialog = $state(false);
    let elearningpath = $state("");

    $effect(() => {
        const handle = () => isscroll = window.scrollY > 0;
        window.addEventListener('scroll', handle);

        const pathSegments = data.path.split("/");
        if (pathSegments.length > 2 && pathSegments[1] === 'elearning') {
            const param = decodeURIComponent(pathSegments[2]);
            elearningpath = `/elearning/${param}`;
        }

        return () => window.removeEventListener('scroll', handle);
    });
</script>

<header class="border-b-2 bg-white {isscroll ? "sticky top-0 z-50 shadow" : ""}">
    <nav class="flex items-center justify-between p-1">
        <div class="flex items-center gap-4">
            <SideMenu/>
            <NavBreadcrumb/>
        </div>
        <div class="flex items-center gap-4">
            {#if data.path === '/elearning'}
                <div class="flex items-center gap-1">
                    <Dialog.Root open={openDialog} onOpenChange={e => openDialog = e}>
                        <Dialog.Trigger aria-label="Create Classroom" class="fixed lg:relative rounded-full h-14 w-14 lg:w-10 grid place-content-center lg:h-10 lg:hover:bg-gray-200 lg:rounded-md right-4 bottom-4 lg:inset-0 [&_svg]:size-6 shadow-lg lg:shadow-none lg:bg-transparent lg:text-black">
                            <Plus/>
                        </Dialog.Trigger>
                        <Dialog.Content>
                            <Dialog.Header class="items-start text-start">
                                <Dialog.Title>Tambah Classroom</Dialog.Title>
                                <Dialog.Description>
                                    Masukan nama ruang kelas, pilih kelas, dan mata pelajaran yang akan diajarkan.
                                </Dialog.Description>
                            </Dialog.Header>
                            <ClassroomForm data={data.form} action="/elearning?/create-classroom" onSuccess={() => { 
                                openDialog = false;
                                toast.success("Kelas berhasil dibuat", {
                                    description: "Anda dapat menshare kode kelas kepada siswa anda untuk bergabung.",
                                });
                            }}/>
                        </Dialog.Content>
                    </Dialog.Root>
                    <Separator orientation="vertical" class="h-8 bg-gray-300 hidden lg:block"/>
                </div>
            {/if}
            <div class="flex items-center gap-2">
                <div class="flex items-end flex-col">
                    <h1 class="text-sm font-semibold">{data.user?.nama}</h1>
                    <small class="text-xs">{data.user?.role}</small>
                </div>
                <form action="/" method="POST">
                    <Button variant="ghost" aria-label="logout" class="[&_svg]:size-5" type="submit"><LogOut/></Button>
                </form>
            </div>
        </div>
    </nav>
    {#if (/^\/elearning\/[^/]+/).test(data.path)}
        <div class="items-center gap-4 hidden lg:flex">
            <Button variant="ghost" class="flex flex-col lg:flex-row gap-3 [&_svg]:size-5 w-32">
                <List /> <small>Forum</small>
            </Button>
            {#if data.user?.role === "Guru"}
                <Button variant="ghost" href="{elearningpath}/pengaturan?id={data.params}" class="flex flex-col lg:flex-row gap-3 [&_svg]:size-5 w-32">
                    <Settings /> <small>Pengaturan</small>
                </Button>
                <Popover.Root>
                    <Popover.Trigger>
                        <Button variant="ghost" class="flex flex-col lg:flex-row gap-3 [&_svg]:size-5 w-32">
                            <Plus /> <small>Buat</small>
                        </Button>
                    </Popover.Trigger>
                    <Popover.Content class="w-fit p-1 grid gap-2">
                        <Button variant="ghost" href="{elearningpath}/buat?id={data.params}&tipe=Tugas" class="flex flex-col lg:flex-row gap-3 justify-start [&_svg]:size-5 w-32">
                            <ClipboardList /> <small>Tugas</small>
                        </Button>
                        <Button variant="ghost" href="{elearningpath}/buat?id={data.params}&tipe=Materi" class="flex flex-col lg:flex-row gap-3 justify-start [&_svg]:size-5 w-32">
                            <BookMarked /> <small>Materi</small>
                        </Button>
                    </Popover.Content>
                </Popover.Root>
            {/if}
            <Button variant="ghost" class="flex flex-col lg:flex-row gap-3 [&_svg]:size-5 w-32">
                <Users2 /> <small>Siswa</small>
            </Button>
        </div>
    {/if}
</header>

{@render children()}