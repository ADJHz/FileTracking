<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import { LayoutGrid, ListChecks } from 'lucide-vue-next';
import AppLogo from '@/components/AppLogo.vue';
import NavMain from '@/components/NavMain.vue';
import NavUser from '@/components/NavUser.vue';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { index as tasksIndex } from '@/routes/tasks';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Panel de Control',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Tareas Programadas',
        href: tasksIndex(),
        icon: ListChecks,
    },
];

// Leave footer items empty or provide internal links if needed
const footerNavItems: NavItem[] = [];
</script>

<template>
    <Sidebar
        collapsible="icon"
        variant="inset"
        class="border-r border-white/40 shadow-[1px_0_0_rgba(255,255,255,0.22)]"
    >
        <SidebarHeader>
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton as-child class="h-auto min-h-0 py-2 hover:bg-transparent data-[state=open]:hover:bg-transparent group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-0!">
                        <Link :href="dashboard()">
                            <AppLogo />
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
            <NavMain :items="mainNavItems" />
        </SidebarContent>

        <SidebarFooter>
            <NavFooter :items="footerNavItems" />
            <NavUser />
        </SidebarFooter>
    </Sidebar>
    <slot />
</template>
