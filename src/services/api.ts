const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  statusCode?: number;
  retryAfter?: number;
}

class ApiClient {
  private getHeaders(): HeadersInit {
    const token = localStorage.getItem('quplo_admin_token');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

    const headers = {
      ...this.getHeaders(),
      ...(options.headers || {}),
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      // Don't auto-redirect on login attempt failure
      if (!endpoint.includes('/admin/auth/login')) {
        localStorage.removeItem('quplo_admin_token');
        localStorage.removeItem('quplo_admin_user');
        window.dispatchEvent(new CustomEvent('admin_auth_unauthorized'));
      }
    }

    let responseData: any = null;
    try {
      responseData = await response.json();
    } catch {
      // Body may be empty (e.g. 204 or void response)
    }

    if (!response.ok) {
      const errorMessage =
        responseData?.message ||
        responseData?.error ||
        `Request failed with status ${response.status}`;

      const err: any = new Error(
        Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage,
      );
      err.statusCode = response.status;
      err.data = responseData;
      err.retryAfter = responseData?.retryAfter;
      throw err;
    }

    return responseData as T;
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    let url = endpoint;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          searchParams.append(key, String(val));
        }
      });
      const qs = searchParams.toString();
      if (qs) url += `?${qs}`;
    }
    return this.request<T>(url, { method: 'GET' });
  }

  async post<T>(endpoint: string, body?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async patch<T>(endpoint: string, body?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const api = new ApiClient();
