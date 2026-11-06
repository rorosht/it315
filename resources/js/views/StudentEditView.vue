<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { studentApi } from '../services/api';
import StudentForm from '../components/StudentForm.vue';

const route = useRoute();
const router = useRouter();
const emit = defineEmits(['notify', 'auth-expired']);

const studentId = route.params.id;
const student = ref({});
const loading = ref(true);
const submitting = ref(false);
const validationErrors = ref({});

async function loadStudent() {
    loading.value = true;
    try {
        const data = await studentApi.getById(studentId);
        student.value = data;
    } catch (err) {
        if (err.status === 401) {
            emit('notify', { message: 'Session expired. Please log in again.', type: 'error' });
            emit('auth-expired');
        } else {
            emit('notify', { message: err.message || 'Failed to load student data.', type: 'error' });
            router.push({ name: 'students.index' });
        }
    } finally {
        loading.value = false;
    }
}

async function handleSubmit(formData) {
    submitting.value = true;
    validationErrors.value = {};

    try {
        const res = await studentApi.update(studentId, formData);
        emit('notify', { message: res.message || 'Student updated successfully!', type: 'success' });
        router.push({ name: 'students.index' });
    } catch (err) {
        if (err.status === 422 && err.errors) {
            validationErrors.value = err.errors;
            emit('notify', { message: 'Validation failed. Please correct form fields.', type: 'error' });
        } else if (err.status === 403) {
            emit('notify', { message: err.data?.message || 'Forbidden: Administrator role required.', type: 'error' });
        } else if (err.status === 401) {
            emit('notify', { message: 'Session expired. Please log in again.', type: 'error' });
            emit('auth-expired');
        } else {
            emit('notify', { message: err.message || 'Failed to update student.', type: 'error' });
        }
    } finally {
        submitting.value = false;
    }
}

onMounted(() => {
    loadStudent();
});
</script>

<template>
    <div class="max-w-xl mx-auto bg-white border border-gray-300 rounded p-6 shadow-xs">
        <div class="flex justify-between items-center border-b border-gray-200 pb-3 mb-4">
            <div>
                <h2 class="text-base font-bold text-gray-800">Edit Student Record</h2>
                <p class="text-xs text-gray-500">Update student information</p>
            </div>
            <router-link
                :to="{ name: 'students.index' }"
                class="px-2.5 py-1 text-xs border border-gray-300 rounded bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium"
            >
                &larr; Back to List
            </router-link>
        </div>

        <div v-if="loading" class="text-center py-6 text-xs text-gray-500">
            Loading student information...
        </div>

        <StudentForm
            v-else
            :isEditing="true"
            :initialData="student"
            :errors="validationErrors"
            :submitting="submitting"
            @submit="handleSubmit"
        />
    </div>
</template>
