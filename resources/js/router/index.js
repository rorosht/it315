import { createRouter, createWebHistory } from 'vue-router';
import { authStorage } from '../services/api';
import LoginView from '../views/LoginView.vue';
import StudentIndexView from '../views/StudentIndexView.vue';
import StudentCreateView from '../views/StudentCreateView.vue';
import StudentEditView from '../views/StudentEditView.vue';
import StudentShowView from '../views/StudentShowView.vue';

const routes = [
    {
        path: '/login',
        name: 'login',
        component: LoginView,
        meta: { guestOnly: true }
    },
    {
        path: '/',
        redirect: '/students'
    },
    {
        path: '/students',
        name: 'students.index',
        component: StudentIndexView,
        meta: { requiresAuth: true }
    },
    {
        path: '/students/create',
        name: 'students.create',
        component: StudentCreateView,
        meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
        path: '/students/:id',
        name: 'students.show',
        component: StudentShowView,
        meta: { requiresAuth: true }
    },
    {
        path: '/students/:id/edit',
        name: 'students.edit',
        component: StudentEditView,
        meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: '/students'
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

// Navigation Guards for Authentication & Role Restriction (Lab 4)
router.beforeEach((to, from, next) => {
    const token = authStorage.getToken();
    const user = authStorage.getUser();

    // 1. If route requires authentication and user has no token
    if (to.meta.requiresAuth && !token) {
        return next({ name: 'login' });
    }

    // 2. If logged-in user visits login page, redirect to students
    if (to.meta.guestOnly && token) {
        return next({ name: 'students.index' });
    }

    // 3. If route requires administrator privileges
    if (to.meta.requiresAdmin && user?.role !== 'admin') {
        alert('Access Denied: Administrator role required.');
        return next({ name: 'students.index' });
    }

    next();
});

export default router;
