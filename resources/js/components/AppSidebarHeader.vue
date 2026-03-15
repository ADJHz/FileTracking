<script setup lang="ts">
import { usePage } from '@inertiajs/vue3';
import Breadcrumbs from '@/components/Breadcrumbs.vue';
import NotificationDropdown from '@/components/NotificationDropdown.vue';
import { SidebarTrigger } from '@/components/ui/sidebar';
import type { BreadcrumbItem } from '@/types';

withDefaults(
    defineProps<{
        breadcrumbs?: BreadcrumbItem[];
    }>(),
    {
        breadcrumbs: () => [],
    },
);

const page = usePage();
const user = page.props.auth?.user;
</script>

<template>
    <header
        class="flex h-16 shrink-0 items-center gap-2 border-b border-white/40 bg-sidebar px-6 shadow-[inset_1px_0_0_rgba(255,255,255,0.22)] md:border-l md:border-l-white/50 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4"
    >
        <div class="flex items-center gap-2">
            <SidebarTrigger class="-ml-1" />
            <template v-if="breadcrumbs && breadcrumbs.length > 0">
                <Breadcrumbs :breadcrumbs="breadcrumbs" />
            </template>
        </div>

        <!-- Notification dropdown -->
        <div class="ml-auto">
            <NotificationDropdown v-if="user" :user-id="user.id" />
        </div>
    </header>
</template>
