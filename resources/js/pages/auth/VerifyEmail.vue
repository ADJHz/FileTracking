<script setup lang="ts">
import { Form, Head } from '@inertiajs/vue3';
import TextLink from '@/components/TextLink.vue';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/AuthLayout.vue';
import { logout } from '@/routes/index';
import { send } from '@/routes/verification/index';

defineProps<{
    status?: string;
}>();
</script>

<template>
    <AuthLayout
        title="Verificar correo electrónico"
        description="Por favor verifica tu dirección de correo electrónico haciendo clic en el enlace que acabamos de enviarte."
    >
        <Head title="Verificación de correo electrónico" />

        <div
            v-if="status === 'verification-link-sent'"
            class="mb-4 text-center text-sm font-medium text-green-600"
        >
            Se ha enviado un nuevo enlace de verificación a la dirección de correo electrónico que proporcionaste durante el registro.
        </div>

        <Form
            v-bind="send.form()"
            class="space-y-6 text-center"
            v-slot="{ processing }"
        >
            <Button :disabled="processing" variant="secondary">
                <Spinner v-if="processing" />
                Reenviar correo de verificación
            </Button>

            <TextLink
                :href="logout.url()"
                method="post"
                as="button"
                class="mx-auto block text-sm"
            >
                Cerrar sesión
            </TextLink>
        </Form>
    </AuthLayout>
</template>

