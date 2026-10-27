import apiClient, { API_BASE_URL } from './apiClient';
import { setAuthToken, removeAuthToken, setStoredUser, removeStoredUser, getAuthToken } from '../utils/token';

export const authService = {
  async login(email, password) {
    const res = await apiClient.post('/login', { email, password });
    if (res.data?.data?.token) {
      setAuthToken(res.data.data.token);
      setStoredUser(res.data.data.user);
    }
    return res.data;
  },

  async logout() {
    try {
      await apiClient.post('/logout');
    } finally {
      removeAuthToken();
      removeStoredUser();
    }
  },

  async getCurrentUser() {
    const res = await apiClient.get('/me');
    return res.data;
  },
};

export const employeeService = {
  async getEmployees({
    page = 1,
    perPage = 10,
    search = '',
    qualification = '',
    dobFrom = '',
    dobTo = '',
    sortBy = 'id',
    sortDir = 'desc',
  } = {}) {
    const params = {
      page,
      per_page: perPage,
      sort_by: sortBy,
      sort_dir: sortDir,
    };

    if (search) params.search = search;
    if (qualification && qualification !== 'all') params.education_qualification = qualification;
    if (dobFrom) params.dob_from = dobFrom;
    if (dobTo) params.dob_to = dobTo;

    const res = await apiClient.get('/employees', { params });
    return res.data;
  },

  async getEmployee(id) {
    const res = await apiClient.get(`/employees/${id}`);
    return res.data;
  },

  async getNextId() {
    const res = await apiClient.get('/employees/next-id');
    return res.data;
  },

  async getStats() {
    const res = await apiClient.get('/employees/stats');
    return res.data;
  },

  async createEmployee(formData) {
    const res = await apiClient.post('/employees', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },

  async updateEmployee(id, formData) {
    // POST used for Laravel multipart support with PUT semantics
    const res = await apiClient.post(`/employees/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },

  async deleteEmployee(id) {
    const res = await apiClient.delete(`/employees/${id}`);
    return res.data;
  },

  async importEmployees(file) {
    const formData = new FormData();
    formData.append('file', file);
    const res = await apiClient.post('/employees/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },

  async downloadExport(format = 'xlsx', search = '', qualification = '') {
    const params = { format };
    if (search) params.search = search;
    if (qualification && qualification !== 'all') params.education_qualification = qualification;

    const res = await apiClient.get('/employees/export', {
      params,
      responseType: 'blob',
    });

    const extension = format === 'csv' ? 'csv' : 'xlsx';
    const filename = `employees_${new Date().toISOString().replace(/[:.]/g, '-')}.${extension}`;

    const blobUrl = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = blobUrl;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  },

  getExportUrl(format = 'xlsx', search = '', qualification = '') {
    const params = new URLSearchParams({ format });
    if (search) params.append('search', search);
    if (qualification && qualification !== 'all') params.append('education_qualification', qualification);
    const token = getAuthToken();
    if (token) params.append('token', token);
    return `${API_BASE_URL}/employees/export?${params.toString()}`;
  },
};

