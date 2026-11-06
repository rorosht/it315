<script setup>
import { reactive, watch } from 'vue';

const props = defineProps({
    isEditing: {
        type: Boolean,
        default: false
    },
    initialData: {
        type: Object,
        default: () => ({})
    },
    errors: {
        type: Object,
        default: () => ({})
    },
    submitting: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['submit']);

const form = reactive({
    student_id: '',
    first_name: '',
    middle_name: '',
    last_name: '',
    email: '',
    phone: '',
    course: '',
    year_level: 1
});

watch(
    () => props.initialData,
    (data) => {
        if (data && Object.keys(data).length > 0) {
            form.student_id = data.student_id || '';
            form.first_name = data.first_name || '';
            form.middle_name = data.middle_name || '';
            form.last_name = data.last_name || '';
            form.email = data.email || '';
            form.phone = data.phone || '';
            form.course = data.course || '';
            form.year_level = Number(data.year_level) || 1;
        }
    },
    { immediate: true }
);

function handleSubmit() {
    emit('submit', { ...form });
}
</script>

<template>
    <form @submit.prevent="handleSubmit" class="space-y-3 text-xs">
        <div>
            <label class="block font-semibold text-gray-700 mb-1">
                Student ID <span class="text-red-500">*</span>
            </label>
            <input
                v-model="form.student_id"
                type="text"
                required
                placeholder="e.g. 2024-0001"
                class="w-full px-3 py-1.5 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            />
            <p v-if="errors.student_id" class="text-red-600 mt-0.5">{{ errors.student_id[0] }}</p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
                <label class="block font-semibold text-gray-700 mb-1">
                    First Name <span class="text-red-500">*</span>
                </label>
                <input
                    v-model="form.first_name"
                    type="text"
                    required
                    placeholder="John"
                    class="w-full px-3 py-1.5 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                />
                <p v-if="errors.first_name" class="text-red-600 mt-0.5">{{ errors.first_name[0] }}</p>
            </div>

            <div>
                <label class="block font-semibold text-gray-700 mb-1">
                    Middle Name
                </label>
                <input
                    v-model="form.middle_name"
                    type="text"
                    placeholder="Optional"
                    class="w-full px-3 py-1.5 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                />
                <p v-if="errors.middle_name" class="text-red-600 mt-0.5">{{ errors.middle_name[0] }}</p>
            </div>
        </div>

        <div>
            <label class="block font-semibold text-gray-700 mb-1">
                Last Name <span class="text-red-500">*</span>
            </label>
            <input
                v-model="form.last_name"
                type="text"
                required
                placeholder="Doe"
                class="w-full px-3 py-1.5 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            />
            <p v-if="errors.last_name" class="text-red-600 mt-0.5">{{ errors.last_name[0] }}</p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
                <label class="block font-semibold text-gray-700 mb-1">
                    Email <span class="text-red-500">*</span>
                </label>
                <input
                    v-model="form.email"
                    type="email"
                    required
                    placeholder="john@example.com"
                    class="w-full px-3 py-1.5 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                />
                <p v-if="errors.email" class="text-red-600 mt-0.5">{{ errors.email[0] }}</p>
            </div>

            <div>
                <label class="block font-semibold text-gray-700 mb-1">
                    Phone (11 Digits) <span class="text-red-500">*</span>
                </label>
                <input
                    v-model="form.phone"
                    type="text"
                    required
                    maxlength="11"
                    placeholder="09123456789"
                    class="w-full px-3 py-1.5 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                />
                <p v-if="errors.phone" class="text-red-600 mt-0.5">{{ errors.phone[0] }}</p>
            </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
                <label class="block font-semibold text-gray-700 mb-1">
                    Course <span class="text-red-500">*</span>
                </label>
                <input
                    v-model="form.course"
                    type="text"
                    required
                    placeholder="BSIT"
                    class="w-full px-3 py-1.5 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                />
                <p v-if="errors.course" class="text-red-600 mt-0.5">{{ errors.course[0] }}</p>
            </div>

            <div>
                <label class="block font-semibold text-gray-700 mb-1">
                    Year Level <span class="text-red-500">*</span>
                </label>
                <select
                    v-model.number="form.year_level"
                    required
                    class="w-full px-3 py-1.5 border border-gray-300 rounded focus:outline-none focus:border-blue-500 bg-white"
                >
                    <option :value="1">Year 1</option>
                    <option :value="2">Year 2</option>
                    <option :value="3">Year 3</option>
                    <option :value="4">Year 4</option>
                    <option :value="5">Year 5</option>
                </select>
                <p v-if="errors.year_level" class="text-red-600 mt-0.5">{{ errors.year_level[0] }}</p>
            </div>
        </div>

        <div class="pt-3 border-t border-gray-200 flex justify-end gap-2">
            <slot name="actions">
                <button
                    type="submit"
                    :disabled="submitting"
                    class="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium disabled:opacity-50 cursor-pointer"
                >
                    {{ submitting ? 'Saving...' : (isEditing ? 'Update Student' : 'Save Student') }}
                </button>
            </slot>
        </div>
    </form>
</template>

