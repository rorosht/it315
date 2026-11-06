<script setup>
import { ref, computed, onMounted } from 'vue';
import { studentApi } from '../services/api';

const emit = defineEmits(['notify']);

const students = ref([]);
const loading = ref(false);
const searchQuery = ref('');

// Computed filtered list for search
const filteredStudents = computed(() => {
    if (!searchQuery.value.trim()) {
        return students.value;
    }
    const q = searchQuery.value.toLowerCase();
    return students.value.filter((s) => {
        const fullName = `${s.first_name} ${s.middle_name || ''} ${s.last_name}`.toLowerCase();
        return (
            fullName.includes(q) ||
            s.student_id?.toLowerCase().includes(q) ||
            s.email?.toLowerCase().includes(q) ||
            s.course?.toLowerCase().includes(q)
        );
    });
});

// CRUD: Retrieve students (GET /api/students)
async function loadStudents() {
    loading.value = true;
    try {
        const data = await studentApi.getAll();
        students.value = Array.isArray(data) ? data : [];
    } catch (err) {
        emit('notify', { message: err.message || 'Failed to load students', type: 'error' });
    } finally {
        loading.value = false;
    }
}

// CRUD: Delete student (DELETE /api/students/:id)
async function handleDelete(student) {
    const confirmed = window.confirm(
        `Are you sure you want to delete "${student.first_name} ${student.last_name}" (${student.student_id})?`
    );
    if (!confirmed) return;

    try {
        const res = await studentApi.delete(student.id);
        emit('notify', { message: res.message || 'Student deleted successfully', type: 'success' });
        await loadStudents();
    } catch (err) {
        emit('notify', { message: err.message || 'Failed to delete student', type: 'error' });
    }
}

onMounted(() => {
    loadStudents();
});
</script>

<template>
    <div class="bg-white border border-gray-300 rounded p-5 shadow-xs">
        <!-- Top Toolbar -->
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
            <div>
                <h2 class="text-lg font-bold text-gray-800">Student List</h2>
                <p class="text-xs text-gray-500">
                    Total records: {{ filteredStudents.length }}
                </p>
            </div>

            <div class="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <!-- Search input -->
                <input
                    v-model="searchQuery"
                    type="text"
                    placeholder="Search by name, ID, or course..."
                    class="px-3 py-1.5 border border-gray-300 rounded text-xs w-full sm:w-60 focus:outline-none focus:border-blue-500"
                />

                <!-- Refresh button -->
                <button
                    type="button"
                    @click="loadStudents"
                    :disabled="loading"
                    class="px-3 py-1.5 border border-gray-300 rounded bg-gray-50 hover:bg-gray-100 text-xs font-medium cursor-pointer"
                >
                    {{ loading ? 'Loading...' : 'Refresh' }}
                </button>

                <!-- Add Student Link -->
                <router-link
                    :to="{ name: 'students.create' }"
                    class="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold cursor-pointer inline-block"
                >
                    + Add Student
                </router-link>
            </div>
        </div>

        <!-- Loading State: Demonstrating v-if -->
        <div v-if="loading" class="text-center py-8 text-xs text-gray-500">
            Loading student records...
        </div>

        <!-- Empty State: Demonstrating v-else-if -->
        <div v-else-if="filteredStudents.length === 0" class="text-center py-8 text-xs text-gray-500">
            No student records found.
        </div>

        <!-- Records Table: Demonstrating v-for -->
        <div v-else class="overflow-x-auto">
            <table class="w-full border-collapse border border-gray-300 text-xs text-left">
                <thead class="bg-gray-100 text-gray-700 font-semibold border-b border-gray-300">
                    <tr>
                        <th class="border border-gray-300 p-2">Student ID</th>
                        <th class="border border-gray-300 p-2">Full Name</th>
                        <th class="border border-gray-300 p-2">Email</th>
                        <th class="border border-gray-300 p-2">Phone</th>
                        <th class="border border-gray-300 p-2">Course</th>
                        <th class="border border-gray-300 p-2 text-center">Year</th>
                        <th class="border border-gray-300 p-2 text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="student in filteredStudents"
                        :key="student.id"
                        class="hover:bg-gray-50"
                    >
                        <td class="border border-gray-300 p-2 font-mono font-medium">{{ student.student_id }}</td>
                        <td class="border border-gray-300 p-2">
                            {{ student.first_name }} {{ student.middle_name ? student.middle_name + ' ' : '' }}{{ student.last_name }}
                        </td>
                        <td class="border border-gray-300 p-2">{{ student.email }}</td>
                        <td class="border border-gray-300 p-2">{{ student.phone }}</td>
                        <td class="border border-gray-300 p-2">{{ student.course }}</td>
                        <td class="border border-gray-300 p-2 text-center">Year {{ student.year_level }}</td>
                        <td class="border border-gray-300 p-2 text-center space-x-1 whitespace-nowrap">
                            <!-- View Details Route -->
                            <router-link
                                :to="{ name: 'students.show', params: { id: student.id } }"
                                class="px-2 py-1 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded text-gray-700 inline-block text-xs"
                            >
                                View
                            </router-link>

                            <!-- Edit Route -->
                            <router-link
                                :to="{ name: 'students.edit', params: { id: student.id } }"
                                class="px-2 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded inline-block text-xs"
                            >
                                Edit
                            </router-link>

                            <!-- Delete Action -->
                            <button
                                type="button"
                                @click="handleDelete(student)"
                                class="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded cursor-pointer text-xs"
                            >
                                Delete
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
