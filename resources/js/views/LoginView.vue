<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { authApi } from '../services/api';

const router = useRouter();
const emit = defineEmits(['notify', 'login-success']);

// State managed with reactive() and ref() (Vue Composition API)
const credentials = reactive({
    email: '',
    password: ''
});

const loading = ref(false);
const errorMessage = ref('');
const fieldErrors = ref({});

function fillDemo(role) {
    errorMessage.value = '';
    fieldErrors.value = {};
    if (role === 'admin') {
        credentials.email = 'admin@example.com';
        credentials.password = 'admin123';
    } else {
        credentials.email = 'user@example.com';
        credentials.password = 'user123';
    }
}

async function handleLogin() {
    loading.value = true;
    errorMessage.value = '';
    fieldErrors.value = {};

    try {
        const response = await authApi.login({
            email: credentials.email,
            password: credentials.password
        });

        emit('login-success', {
            token: response.token,
            user: response.user
        });
        emit('notify', {
            message: `Welcome, ${response.user?.name || 'User'}!`,
            type: 'success'
        });

        router.push({ name: 'students.index' });
    } catch (err) {
        if (err.status === 400 || err.status === 401) {
            errorMessage.value = err.data?.message || 'Invalid email or password.';
        } else if (err.status === 422 && err.errors) {
            fieldErrors.value = err.errors;
            errorMessage.value = 'Validation failed. Please check your inputs.';
        } else {
            errorMessage.value = err.message || 'Login failed.';
        }
    } finally {
        loading.value = false;
    }
}
</script>

<template>
    <div class="w-full max-w-sm mx-auto bg-white border border-gray-300 rounded p-6 shadow-xs my-6">
        <h2 class="text-xl font-bold text-gray-800 mb-1 text-center">Sign In</h2>
        <p class="text-xs text-gray-500 text-center mb-4">
            Student Management System (Act 4 Auth)
        </p>

        <!-- Quick Demo Fill Buttons (Super helpful for video recording) -->
        <div class="mb-4 p-2.5 bg-gray-50 border border-gray-200 rounded text-xs">
            <span class="block font-semibold text-gray-600 mb-1.5">Quick Demo Accounts:</span>
            <div class="flex gap-2">
                <button
                    type="button"
                    @click="fillDemo('admin')"
                    class="flex-1 py-1 px-2 border border-gray-300 rounded bg-white hover:bg-gray-100 text-gray-700 font-medium cursor-pointer"
                >
                    Admin Account
                </button>
                <button
                    type="button"
                    @click="fillDemo('user')"
                    class="flex-1 py-1 px-2 border border-gray-300 rounded bg-white hover:bg-gray-100 text-gray-700 font-medium cursor-pointer"
                >
                    Regular User
                </button>
            </div>
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="mb-4 p-2 bg-red-50 border border-red-200 rounded text-red-600 text-xs">
            {{ errorMessage }}
        </div>

        <!-- Controlled Login Form -->
        <form @submit.prevent="handleLogin" class="space-y-3">
            <div>
                <label class="block text-xs font-semibold text-gray-700 mb-1">Email</label>
                <input
                    v-model="credentials.email"
                    type="email"
                    required
                    placeholder="email@example.com"
                    class="w-full px-3 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:border-blue-500"
                />
                <p v-if="fieldErrors.email" class="text-xs text-red-600 mt-0.5">
                    {{ fieldErrors.email[0] }}
                </p>
            </div>

            <div>
                <label class="block text-xs font-semibold text-gray-700 mb-1">Password</label>
                <input
                    v-model="credentials.password"
                    type="password"
                    required
                    placeholder="Password"
                    class="w-full px-3 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:border-blue-500"
                />
                <p v-if="fieldErrors.password" class="text-xs text-red-600 mt-0.5">
                    {{ fieldErrors.password[0] }}
                </p>
            </div>

            <button
                type="submit"
                :disabled="loading"
                class="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded disabled:opacity-50 cursor-pointer mt-2"
            >
                {{ loading ? 'Signing in...' : 'Sign In' }}
            </button>
        </form>
    </div>
</template>

