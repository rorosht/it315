import { createRouter, createWebHistory } from 'vue-router';
import StudentIndexView from '../views/StudentIndexView.vue';
import StudentCreateView from '../views/StudentCreateView.vue';
import StudentEditView from '../views/StudentEditView.vue';
import StudentShowView from '../views/StudentShowView.vue';

const routes = [
    {
        path: '/',
        redirect: '/students'
    },
    {
        path: '/students',
        name: 'students.index',
        component: StudentIndexView
    },
    {
        path: '/students/create',
        name: 'students.create',
        component: StudentCreateView
    },
    {
        path: '/students/:id',
        name: 'students.show',
        component: StudentShowView
    },
    {
        path: '/students/:id/edit',
        name: 'students.edit',
        component: StudentEditView
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

export default router;
