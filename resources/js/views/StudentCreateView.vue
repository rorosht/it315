<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { studentApi } from '../services/api';
import StudentForm from '../components/StudentForm.vue';

const router = useRouter();
const emit = defineEmits(['notify']);

const submitting = ref(false);
const validationErrors = ref({});

async function handleSubmit(formData) {
    submitting.value = true;
    validationErrors.value = {};

    try {
        const res = await studentApi.create(formData);
        emit('notify', { message: res.message || 'Student created successfully!', type: 'success' });
        router.push({ name: 'students.index' });
    } catch (err) {
        if (err.status === 422 && err.errors) {
            validationErrors.value = err.errors;
            emit('notify', { message: 'Validation failed. Please correct form fields.', type: 'error' });
        } else {
            emit('notify', { message: err.message || 'Failed to create student.', type: 'error' });
        }
    } finally {
        submitting.value = false;
    }
}
</script>

<template>
    <div class="max-w-xl mx-auto bg-white border border-gray-300 rounded p-6 shadow-xs">
        <div class="flex justify-between items-center border-b border-gray-200 pb-3 mb-4">
            <div>
                <h2 class="text-base font-bold text-gray-800">Add New Student</h2>
                <p class="text-xs text-gray-500">Fill in the student details below</p>
            </div>
            <router-link
                :to="{ name: 'students.index' }"
                class="px-2.5 py-1 text-xs border border-gray-300 rounded bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium"
            >
                &larr; Back to List
            </router-link>
        </div>

        <StudentForm
            :errors="validationErrors"
            :submitting="submitting"
            @submit="handleSubmit"
        />
    </div>
</template>
