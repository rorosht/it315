

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

export const authStorage = {
    getToken() {
        return localStorage.getItem(TOKEN_KEY);
    },
    setToken(token) {
        localStorage.setItem(TOKEN_KEY, token);
    },
    removeToken() {
        localStorage.removeItem(TOKEN_KEY);
    },
    getUser() {
        const raw = localStorage.getItem(USER_KEY);
        try {
            return raw ? JSON.parse(raw) : null;
        } catch {
            return null;
        }
    },
    setUser(user) {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
    },
    removeUser() {
        localStorage.removeItem(USER_KEY);
    },
    clear() {
        this.removeToken();
        this.removeUser();
    }
};

/**
 * Base fetch wrapper that includes Bearer token and headers
 */
export async function apiRequest(endpoint, options = {}) {
    const token = authStorage.getToken();

    const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...(options.headers || {})
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        ...options,
        headers
    };

    const response = await fetch(endpoint, config);

    let data = null;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
        data = await response.json();
    } else {
        const text = await response.text();
        data = { message: text };
    }

    if (!response.ok) {
        const error = new Error(data?.message || `HTTP ${response.status}: Request failed`);
        error.status = response.status;
        error.data = data;
        error.errors = data?.errors || null;
        throw error;
    }

    return data;
}

export const authApi = {
    async login(credentials) {
        const data = await apiRequest('/api/login', {
            method: 'POST',
            body: JSON.stringify(credentials)
        });
        if (data.token) {
            authStorage.setToken(data.token);
            if (data.user) {
                authStorage.setUser(data.user);
            }
        }
        return data;
    },

    async getUser() {
        return apiRequest('/api/user');
    },

    async logout() {
        try {
            await apiRequest('/api/logout', {
                method: 'POST'
            });
        } finally {
            authStorage.clear();
        }
    }
};


export const studentApi = {
    async getAll() {
        return apiRequest('/api/students');
    },

    async getById(id) {
        return apiRequest(`/api/students/${id}`);
    },

    async create(payload) {
        return apiRequest('/api/students', {
            method: 'POST',
            body: JSON.stringify(payload)
        });
    },

    async update(id, payload) {
        return apiRequest(`/api/students/${id}`, {
            method: 'PUT',
            body: JSON.stringify(payload)
        });
    },

    async delete(id) {
        return apiRequest(`/api/students/${id}`, {
            method: 'DELETE'
        });
    }
};

