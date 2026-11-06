<script setup>
defineProps({
    show: {
        type: Boolean,
        default: false
    },
    type: {
        type: String,
        default: 'info' // 'success', 'error', 'info', 'warning'
    },
    message: {
        type: String,
        default: ''
    }
});

const emit = defineEmits(['close']);
</script>

<template>
    <div
        v-if="show && message"
        class="fixed top-4 right-4 z-50 p-4 rounded border text-sm max-w-sm w-full shadow bg-white"
        :class="{
            'border-green-500 text-green-700 bg-green-50': type === 'success',
            'border-red-500 text-red-700 bg-red-50': type === 'error',
            'border-yellow-500 text-yellow-700 bg-yellow-50': type === 'warning',
            'border-blue-500 text-blue-700 bg-blue-50': type === 'info'
        }"
    >
        <div class="flex justify-between items-center">
            <span>{{ message }}</span>
            <button
                type="button"
                @click="emit('close')"
                class="ml-3 font-bold text-gray-500 hover:text-black cursor-pointer"
            >
                &times;
            </button>
        </div>
    </div>
</template>
