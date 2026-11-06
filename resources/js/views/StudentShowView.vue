<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { studentApi } from '../services/api';

const route = useRoute();
const router = useRouter();
const emit = defineEmits(['notify']);

const studentId = route.params.id;
const student = ref(null);
const loading = ref(true);

async function loadStudent() {
    loading.value = true;
    try {
        const data = await studentApi.getById(studentId);
        student.value = data;
    } catch (err) {
        emit('notify', { message: err.message || 'Could not fetch student details.', type: 'error' });
        router.push({ name: 'students.index' });
    } finally {
        loading.value = false;
    }
}

onMounted(() => {
    loadStudent();
});
</script>

<template>
    <div class="max-w-md mx-auto bg-white border border-gray-300 rounded p-6 shadow-xs">
        <div class="flex justify-between items-center border-b border-gray-200 pb-3 mb-4">
            <h2 class="text-base font-bold text-gray-800">Student Details</h2>
        </div>

        <div v-if="loading" class="text-center py-6 text-xs text-gray-500">
            Loading student details...
        </div>

        <div v-else-if="student" class="space-y-2 text-xs text-gray-800">
            <div class="flex border-b border-gray-100 py-1.5">
                <span class="w-32 font-semibold text-gray-500">Student ID:</span>
                <span class="font-mono font-bold">{{ student.student_id }}</span>
            </div>
            <div class="flex border-b border-gray-100 py-1.5">
                <span class="w-32 font-semibold text-gray-500">Full Name:</span>
                <span>{{ student.first_name }} {{ student.middle_name ? student.middle_name + ' ' : '' }}{{ student.last_name }}</span>
            </div>
            <div class="flex border-b border-gray-100 py-1.5">
                <span class="w-32 font-semibold text-gray-500">Email:</span>
                <span>{{ student.email }}</span>
            </div>
            <div class="flex border-b border-gray-100 py-1.5">
                <span class="w-32 font-semibold text-gray-500">Phone:</span>
                <span>{{ student.phone }}</span>
            </div>
            <div class="flex border-b border-gray-100 py-1.5">
                <span class="w-32 font-semibold text-gray-500">Course:</span>
                <span>{{ student.course }}</span>
            </div>
            <div class="flex border-b border-gray-100 py-1.5">
                <span class="w-32 font-semibold text-gray-500">Year Level:</span>
                <span>Year {{ student.year_level }}</span>
            </div>

            <div class="pt-4 flex justify-between items-center">
                <router-link
                    :to="{ name: 'students.edit', params: { id: student.id } }"
                    class="px-3 py-1.5 bg-yellow-500 hover:bg-yellow-600 text-white rounded text-xs font-semibold"
                >
                    Edit This Student
                </router-link>

                <router-link
                    :to="{ name: 'students.index' }"
                    class="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded text-xs text-gray-700"
                >
                    Back to List
                </router-link>
            </div>
        </div>
    </div>
</template>
