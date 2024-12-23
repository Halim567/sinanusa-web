<script lang="ts">
    import * as Breadcrumb from '$lib/components/ui/breadcrumb';
    import { BookText } from 'lucide-svelte';
    import { page } from '$app/state';

    let breadcrumbs = $state<{ name: string, href: string }[]>([]);
    const toSentenceCase = (str: string) => str[0].toUpperCase() + str.slice(1);

    $effect(() => {
        const pathnames = page.url.pathname.split('/').filter(Boolean);
        breadcrumbs = pathnames.map((name, index) => ({
            href: `/${pathnames.slice(0, index + 1).join("/")}${window.location.search}`,
            name: toSentenceCase(decodeURIComponent(name))
        }));
    });
</script>

<Breadcrumb.Root class="max-md:hidden">
    <Breadcrumb.List class="text-lg">
        {#each breadcrumbs as bread, index}
            <Breadcrumb.Item>
                {#if index === 0}
                    <Breadcrumb.Link href="/elearning" class="flex items-center gap-2 hover:text-gray-800"><BookText size={20}/>{bread.name}</Breadcrumb.Link>
                {:else}
                    <Breadcrumb.Link class="hover:text-gray-800" href={bread.href}>{bread.name}</Breadcrumb.Link>
                {/if}
            </Breadcrumb.Item>
            {#if index !== breadcrumbs.length - 1}
                <Breadcrumb.Separator class="[&_svg]:size-5"/>
            {/if}
        {/each}
    </Breadcrumb.List>
</Breadcrumb.Root>