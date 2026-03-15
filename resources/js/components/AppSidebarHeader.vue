<script setup lang="ts">
import Breadcrumbs from '@/components/Breadcrumbs.vue';
import NotificationDropdown from '@/components/NotificationDropdown.vue';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { usePage } from '@inertiajs/vue3';
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
        class="flex h-16 shrink-0 items-center gap-2 border-b border-white/40 bg-sidebar px-6 text-white shadow-[inset_1px_0_0_rgba(255,255,255,0.22)] md:border-l md:border-l-white/50 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4 [&_button:hover]:!bg-dorado-400/20 [&_a:hover]:!text-dorado-300"
    >
        <div class="flex items-center gap-2 [&_*]:!text-white [&_svg]:!text-white">
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
