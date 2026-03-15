<script setup lang="ts">
// No props needed for now
</script>

<template>
    <div class="flex min-w-0 flex-col items-center gap-2 px-2 py-1">
        <div class="rounded-xl bg-white/90 p-2 shadow-sm ring-1 ring-white/60 group-data-[collapsible=icon]:hidden">
            <img
                src="/EdoMex.png"
                alt="Logo Estado de México"
                class="h-10 w-auto max-w-40 object-contain"
                decoding="async"
                loading="eager"
            />
        </div>

        <img
            src="/escudo-veda-fav.png"
            alt="Escudo Estado de México"
            class="hidden h-8 w-8 object-contain group-data-[collapsible=icon]:block"
            decoding="async"
            loading="eager"
        />

        <div class="h-px w-16 bg-white/50 group-data-[collapsible=icon]:hidden"></div>

        <span class="max-w-full truncate text-center text-sm leading-tight font-semibold text-white dark:text-white group-data-[collapsible=icon]:hidden">
            FileTracking
        </span>
    </div>
</template>