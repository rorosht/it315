<script setup>
import { ref } from "vue";
import ToastAlert from "./components/ToastAlert.vue";

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
</script>

<template>
    <div class="min-h-screen bg-gray-50 text-gray-900 font-sans">
        <ToastAlert
            :show="toast.show"
            :type="toast.type"
            :message="toast.message"
            @close="toast.show = false"
        />

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
            </div>
        </header>

        <main class="max-w-5xl mx-auto py-6 px-4">
            <router-view @notify="handleNotify" />
        </main>
    </div>
</template>
