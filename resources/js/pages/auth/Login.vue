<script setup lang="ts">
import { Form, Head } from '@inertiajs/vue3';
import { Eye, EyeOff } from 'lucide-vue-next';
import { ref } from 'vue';
import InputError from '@/components/InputError.vue';
import TextLink from '@/components/TextLink.vue';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { register } from '@/routes/index';
import { store } from '@/routes/login/index';
import { request } from '@/routes/password/index';

const showPassword = ref(false);

defineProps<{
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
}>();
</script>

<template>
    <Head title="Acceder al Sistema" />

    <div class="min-h-screen bg-gradient-to-br from-dorado-100 via-dorado-50 to-guinda-100 dark:from-guinda-950 dark:via-guinda-950 dark:to-guinda-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <!-- Header con información institucional -->
        <div class="sm:mx-auto sm:w-full sm:max-w-md mb-8">
            <div class="text-center">
                <!-- Logo institucional -->
                <div class="flex justify-center mb-4">
                    <div class="bg-white/80 dark:bg-white/80 rounded-xl p-2 shadow-lg shadow-guinda-200/40 border border-white/60 dark:shadow-guinda-900/50">
                        <img
                            src="/EdoMex.png"
                            alt="Logo Estado de México"
                            class="h-35 w-auto object-contain"
                        />
                    </div>
                </div>

                <!-- Título principal -->
                <h1 class="text-lg font-semibold text-guinda-700 dark:text-dorado-300 mb-1">
                    Sistema de Seguimiento de Archivos
                </h1>
                <p class="text-sm text-foreground/60 dark:text-foreground/50">
                    Acceso seguro al sistema de gestión documental
                </p>
            </div>
        </div>

        <div class="sm:mx-auto sm:w-full sm:max-w-md">
            <div class="bg-white dark:bg-guinda-950/60 py-8 px-6 rounded-xl border border-guinda-100 dark:border-guinda-800/50 shadow-[0_8px_40px_-4px_rgba(100,30,50,0.25),0_2px_12px_-2px_rgba(100,30,50,0.15)] dark:shadow-[0_8px_40px_-4px_rgba(0,0,0,0.5)]">
                <!-- Mensaje de estado -->
                <div
                    v-if="status"
                    class="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
                >
                    <div class="flex items-center">
                        <div class="flex-shrink-0">
                            <svg class="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                            </svg>
                        </div>
                        <div class="ml-3">
                            <p class="text-sm font-medium text-green-800 dark:text-green-200">
                                {{ status }}
                            </p>
                        </div>
                    </div>
                </div>

                <Form
                    v-bind="store.form()"
                    :reset-on-success="['password']"
                    v-slot="{ errors, processing }"
                    class="space-y-6"
                >
                    <!-- Campo Email -->
                    <div>
                        <Label for="email" class="block text-sm font-semibold text-foreground/80 mb-2">
                            Correo electrónico
                        </Label>
                        <div class="relative">
                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg class="h-5 w-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                </svg>
                            </div>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                autocomplete="email"
                                required
                                autofocus
                                class="!pl-10 appearance-none block w-full py-3 border border-input rounded-lg placeholder-muted-foreground bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-guinda-600 focus:border-transparent transition-all duration-200"
                                placeholder="usuario@edomex.gob.mx"
                            />
                        </div>
                        <InputError :message="errors.email" class="mt-2" />
                    </div>

                    <!-- Campo Password -->
                    <div>
                        <Label for="password" class="block text-sm font-semibold text-foreground/80 mb-2">
                            Contraseña
                        </Label>
                        <div class="relative">
                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg class="h-5 w-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <Input
                                id="password"
                                name="password"
                                :type="showPassword ? 'text' : 'password'"
                                autocomplete="current-password"
                                required
                                class="!pl-10 appearance-none block w-full py-3 pr-12 border border-input rounded-lg placeholder-muted-foreground bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-guinda-600 focus:border-transparent transition-all duration-200"
                                placeholder="Ingrese su contraseña"
                            />
                            <button
                                type="button"
                                @click="showPassword = !showPassword"
                                class="absolute inset-y-0 right-0 pr-4 md:pr-5 flex items-center hover:bg-muted rounded-r-lg transition-colors"
                            >
                                <Eye v-if="!showPassword" class="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
                                <EyeOff v-else class="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
                            </button>
                        </div>
                        <InputError :message="errors.password" class="mt-2" />
                    </div>

                    <!-- Opciones adicionales -->
                    <div class="flex items-center justify-between">
                        <div class="flex items-center">
                            <Checkbox
                                id="remember"
                                name="remember"
                                class="h-4 w-4 text-guinda-600 focus:ring-guinda-500 border-border rounded"
                            />
                            <Label for="remember" class="ml-2 block text-sm text-foreground/80">
                                Recordar sesión
                            </Label>
                        </div>

                        <div class="text-sm">
                            <TextLink
                                v-if="canResetPassword"
                                :href="request()"
                                class="font-medium text-guinda-600 hover:text-guinda-500 dark:text-dorado-400 dark:hover:text-dorado-300 transition-colors"
                            >
                                ¿Olvidó su contraseña?
                            </TextLink>
                        </div>
                    </div>

                    <!-- Botón de acceso -->
                    <div>
                        <Button
                            type="submit"
                            :disabled="processing"
                            class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-gradient-to-r from-guinda-700 to-guinda-600 hover:from-guinda-800 hover:to-guinda-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-guinda-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                            <Spinner v-if="processing" class="mr-2" />
                            <span v-if="!processing" class="flex items-center">
                                <svg class="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Acceder al Sistema
                            </span>
                            <span v-else>Verificando credenciales...</span>
                        </Button>
                    </div>

                    <!-- Información de seguridad -->
                    <div class="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                        <div class="flex items-start">
                            <div class="flex-shrink-0">
                                <svg class="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div class="ml-3">
                                <h3 class="text-sm font-medium text-green-800 dark:text-green-200">
                                    Conexión Segura
                                </h3>
                                <div class="mt-1 text-sm text-green-700 dark:text-green-300">
                                    <p>Esta sesión está protegida con encriptación SSL/TLS.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Enlace de registro -->
                    <div v-if="canRegister" class="text-center">
                        <p class="text-sm text-foreground/60 dark:text-foreground/50">
                            ¿No tiene cuenta?
                            <TextLink
                                :href="register()"
                                class="font-semibold text-guinda-600 hover:text-guinda-500 dark:text-dorado-400 dark:hover:text-dorado-300 transition-colors"
                            >
                                Solicitar acceso
                            </TextLink>
                        </p>
                    </div>
                </Form>
            </div>

            <!-- Footer institucional -->
            <div class="mt-8 text-center">
                <p class="text-xs text-muted-foreground">
                    Gobierno del Estado de México • Secretaría de Seguridad
                </p>
                <p class="text-xs text-muted-foreground/70 mt-1">
                    Sistema de Seguimiento de Archivos v2.0
                </p>
            </div>
        </div>
    </div>
</template>

