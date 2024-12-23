<script lang="ts">
    import type { Snippet } from 'svelte';
    import type { LayoutData } from './$types';
    import SideMenu from '$lib/components/not-reuseable/sidemenu.svelte';
    import NavBreadcrumb from '$lib/components/not-reuseable/nav-breadcrumb.svelte';
    import { Button } from '$lib/components/ui/button';
    import { BookMarked, ClipboardList, List, LogOut, Plus, Settings, Users2 } from 'lucide-svelte';
    import { Separator } from '$lib/components/ui/separator';
    import CreateClassroomForm from '$lib/components/not-reuseable/create-classroom-form.svelte';
    import * as Popover from '$lib/components/ui/popover';

    const { data, children }: { data: LayoutData, children: Snippet } = $props();

    let isscroll = $state(false);

    $effect(() => {
        const handle = () => isscroll = window.scrollY > 0;
        window.addEventListener('scroll', handle);

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
                    <CreateClassroomForm data={data.form} action="/elearning?/create-classroom"/>
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
                <Button variant="ghost" href="{data.path}/pengaturan?id={data.params}" class="flex flex-col lg:flex-row gap-3 [&_svg]:size-5 w-32">
                    <Settings /> <small>Pengaturan</small>
                </Button>
                <Popover.Root>
                    <Popover.Trigger>
                        <Button variant="ghost" class="flex flex-col lg:flex-row gap-3 [&_svg]:size-5 w-32">
                            <Plus /> <small>Buat</small>
                        </Button>
                    </Popover.Trigger>
                    <Popover.Content class="w-fit p-1 grid gap-2">
                        <Button variant="ghost" href="{data.path}/buat?id={data.params}&tipe=Tugas" class="flex flex-col lg:flex-row gap-3 justify-start [&_svg]:size-5 w-32">
                            <ClipboardList /> <small>Tugas</small>
                        </Button>
                        <Button variant="ghost" href="{data.path}/buat?id={data.params}&tipe=Materi" class="flex flex-col lg:flex-row gap-3 justify-start [&_svg]:size-5 w-32">
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