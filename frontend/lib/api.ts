import { Property, ApiResponse, PaginatedResponse } from '@/types/property';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const headers: HeadersInit = {
    'X-Requested-With': 'XMLHttpRequest',
    ...options.headers,
  };

  if (!(options.body instanceof FormData)) {
    (headers as Record<string, string>)['Content-Type'] = 'application/json';
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include',
    signal: controller.signal,
  });

  clearTimeout(timeoutId);

  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(
      data.message || 'Bir hata oluştu',
      response.status
    );
  }

  return data;
}

// Auth API
export const authApi = {
  loginAdmin: (email: string, password: string, captchaToken?: string) =>
    request<{ success: boolean; data: { _id: string; email: string; firstName: string; lastName: string; role: string } }>(
      '/auth/admin/login',
      { method: 'POST', body: JSON.stringify({ email, password, captchaToken }) }
    ),

  loginCustomer: (email: string, password: string, captchaToken?: string) =>
    request<{ success: boolean; data: { _id: string; email: string; firstName: string; lastName: string; role: string } }>(
      '/auth/customer/login',
      { method: 'POST', body: JSON.stringify({ email, password, captchaToken }) }
    ),

  getMe: () =>
    request<{ success: boolean; data: { _id: string; email: string; firstName: string; lastName: string; role: string } }>(
      '/auth/me'
    ),

  logout: () =>
    request<{ success: boolean; message: string }>(
      '/auth/logout',
      { method: 'POST' }
    ),

  registerCustomer: (data: {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    captchaToken?: string;
  }) =>
    request<{ success: boolean; data: unknown }>(
      '/auth/customer/register',
      { method: 'POST', body: JSON.stringify(data) }
    ),

  createAdmin: (data: {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) =>
    request<{ success: boolean; data: { _id: string; username: string; email: string; firstName: string; lastName: string; role: string } }>(
      '/auth/admin/create',
      { method: 'POST', body: JSON.stringify(data) }
    ),
};

// Properties API
export const propertiesApi = {
  getAll: (params?: { page?: number; limit?: number; sort?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', String(params.page));
    if (params?.limit) searchParams.set('limit', String(params.limit));
    if (params?.sort) searchParams.set('sort', params.sort);
    const qs = searchParams.toString();
    return request<PaginatedResponse<Property>>(
      `/properties${qs ? `?${qs}` : ''}`
    );
  },

  search: (params: {
    type?: string;
    status?: string;
    city?: string;
    minPrice?: number;
    maxPrice?: number;
    page?: number;
    limit?: number;
    sort?: string;
  }) => {
    const searchParams = new URLSearchParams();
    if (params.type) searchParams.set('type', params.type);
    if (params.status) searchParams.set('status', params.status);
    if (params.city) searchParams.set('city', params.city);
    if (params.minPrice) searchParams.set('minPrice', String(params.minPrice));
    if (params.maxPrice && params.maxPrice < 10000000) searchParams.set('maxPrice', String(params.maxPrice));
    if (params.page) searchParams.set('page', String(params.page));
    if (params.limit) searchParams.set('limit', String(params.limit));
    if (params.sort) searchParams.set('sort', params.sort);
    return request<PaginatedResponse<Property>>(
      `/properties/search?${searchParams.toString()}`
    );
  },

  getAdminAll: (params?: { page?: number; limit?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', String(params.page));
    if (params?.limit) searchParams.set('limit', String(params.limit));
    const qs = searchParams.toString();
    return request<PaginatedResponse<Property>>(
      `/properties/admin${qs ? `?${qs}` : ''}`
    );
  },

  getById: (id: string) =>
    request<ApiResponse<Property>>(`/properties/${id}`),

  create: (data: Record<string, unknown>) =>
    request<ApiResponse<Property>>('/properties', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Record<string, unknown>) =>
    request<ApiResponse<Property>>(`/properties/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    request<ApiResponse<Record<string, never>>>(`/properties/${id}`, {
      method: 'DELETE',
    }),

  uploadImages: (id: string, files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => formData.append('images', file));
    return request<ApiResponse<Property['images']>>(
      `/properties/${id}/images`,
      { method: 'POST', body: formData }
    );
  },

  deleteImage: (propertyId: string, imageId: string) =>
    request<ApiResponse<Property['images']>>(
      `/properties/${propertyId}/images/${imageId}`,
      { method: 'DELETE' }
    ),
};

// Admin Stats API
export const statsApi = {
  getDashboard: () =>
    request<ApiResponse<{
      totalProperties: number;
      activeProperties: number;
      totalCustomers: number;
      totalViews: number;
    }>>('/admin/stats'),
};

// Customers API
export const customersApi = {
  getAll: (params?: { page?: number; limit?: number; search?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', String(params.page));
    if (params?.limit) searchParams.set('limit', String(params.limit));
    if (params?.search) searchParams.set('search', params.search);
    const qs = searchParams.toString();
    return request<PaginatedResponse<{
      _id: string;
      username: string;
      email: string;
      firstName: string;
      lastName: string;
      phoneNumber: string;
      role: string;
      createdAt: string;
    }>>(`/customers${qs ? `?${qs}` : ''}`);
  },

  getById: (id: string) =>
    request<ApiResponse<{
      _id: string;
      username: string;
      email: string;
      firstName: string;
      lastName: string;
      phoneNumber: string;
      favorites: Property[];
      createdAt: string;
    }>>(`/customers/${id}`),

  delete: (id: string) =>
    request<ApiResponse<unknown>>(`/customers/${id}`, { method: 'DELETE' }),
};

// Profile API
export const profileApi = {
  update: (data: { firstName?: string; lastName?: string; email?: string; phoneNumber?: string }) =>
    request<ApiResponse<unknown>>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    request<ApiResponse<unknown>>('/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

export { ApiError };
