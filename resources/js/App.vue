<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { authStorage, authApi } from "./services/api";
import ToastAlert from "./components/ToastAlert.vue";

const router = useRouter();

// Authentication State (Composition API: ref)
const authToken = ref(authStorage.getToken() || "");
const currentUser = ref(authStorage.getUser() || null);

const isAuthenticated = computed(() =>
    Boolean(authToken.value && currentUser.value),
);
const userRole = computed(() => currentUser.value?.role || "user");
const isAdmin = computed(() => userRole.value === "admin");

const toast = ref({
    show: false,
    type: "info",
    message: "",
});

function showToast(message, type = "success") {
    toast.value = { show: true, type, message };
    setTimeout(() => {
        toast.value.show = false;
    }, 4000);
}

function handleNotify(payload) {
    showToast(payload.message, payload.type || "info");
}

function handleLoginSuccess(payload) {
    authToken.value = payload.token;
    currentUser.value = payload.user;
}

async function handleLogout() {
    if (authToken.value) {
        try {
            await authApi.logout();
        } catch {
            authStorage.clear();
        }
    } else {
        authStorage.clear();
    }
    authToken.value = "";
    currentUser.value = null;
    showToast("Logged out successfully.", "info");
    router.push({ name: "login" });
}

onMounted(async () => {
    if (authToken.value) {
        try {
            const user = await authApi.getUser();
            currentUser.value = user;
            authStorage.setUser(user);
        } catch {
            authStorage.clear();
            authToken.value = "";
            currentUser.value = null;
            router.push({ name: "login" });
        }
    }
});
</script>

<template>
    <div class="min-h-screen bg-gray-50 text-gray-900 font-sans">
        <!-- Toast Alert Feedback -->
        <ToastAlert
            :show="toast.show"
            :type="toast.type"
            :message="toast.message"
            @close="toast.show = false"
        />

        <!-- Basic Header / Navigation -->
        <header class="bg-white border-b border-gray-300 py-3 px-4 sm:px-8">
            <div
                class="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2"
            >
                <div>
                    <h1 class="text-base font-bold text-gray-800">
                        <router-link
                            :to="{ name: 'students.index' }"
                            class="hover:underline"
                        >
                            Student Management System
                        </router-link>
                    </h1>
                </div>

                <!-- User Session & Action Controls -->
                <div
                    v-if="isAuthenticated"
                    class="flex flex-wrap items-center gap-2.5 text-xs"
                >
                    <span class="text-gray-600">
                        User:
                        <strong class="text-gray-900">{{
                            currentUser?.name
                        }}</strong>
                        <span
                            class="ml-1 px-1.5 py-0.5 rounded text-[11px] font-bold"
                            :class="
                                isAdmin
                                    ? 'bg-purple-100 text-purple-700 border border-purple-200'
                                    : 'bg-blue-100 text-blue-700 border border-blue-200'
                            "
                        >
                            {{ isAdmin ? "Admin" : "Regular User" }}
                        </span>
                    </span>

                    <!-- Logout Button -->
                    <button
                        type="button"
                        @click="handleLogout"
                        class="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded cursor-pointer font-medium"
                    >
                        Logout
                    </button>
                </div>

                <!-- Guest Login Link -->
                <div v-else class="text-xs">
                    <router-link
                        :to="{ name: 'login' }"
                        class="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium"
                    >
                        Sign In
                    </router-link>
                </div>
            </div>
        </header>

        <!-- Main Content Area: Renders Active Route View -->
        <main class="max-w-5xl mx-auto py-6 px-4">
            <router-view
                @notify="handleNotify"
                @login-success="handleLoginSuccess"
                @auth-expired="handleLogout"
            />
        </main>
    </div>
</template>
