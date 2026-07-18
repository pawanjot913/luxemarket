const viteEnv = (import.meta as ImportMeta & { env?: { VITE_API_BASE_URL?: string } }).env;

import { Product } from './types';

export const API_BASE_URL = (import.meta as ImportMeta & { env?: { VITE_API_BASE_URL?: string } }).env?.VITE_API_BASE_URL || 'http://localhost:5000';

export const getAuthToken = () => localStorage.getItem('luxemarket_token');
export const setAuthToken = (token: string) => localStorage.setItem('luxemarket_token', token);
export const removeAuthToken = () => localStorage.removeItem('luxemarket_token');

export const normalizeProduct = (product: any): Product => {
  const imageArray = Array.isArray(product.image) ? product.image : (product.image ? [product.image] : []);
  return {
    ...product,
    id: product.id || product._id,
    image: imageArray[0] || '',
    images: imageArray.length > 0 ? imageArray : [product.image || ''],
  };
};

export async function fetchProducts(page?: number, limit?: number, category?: string, search?: string, gender?: string) {
  let url = `${API_BASE_URL}/api/products?`;
  const params: string[] = [];
  if (page !== undefined) params.push(`page=${page}`);
  if (limit !== undefined) params.push(`limit=${limit}`);
  if (category) params.push(`category=${encodeURIComponent(category)}`);
  if (search) params.push(`search=${encodeURIComponent(search)}`);
  if (gender) params.push(`gender=${encodeURIComponent(gender)}`);
  
  url += params.join('&');

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  const data = await response.json();
  return (data.products || []).map(normalizeProduct);
}

export async function fetchUserProfile(token?: string) {
  const accessToken = token || getAuthToken();
  if (!accessToken) {
    return null;
  }

  const response = await fetch(`${API_BASE_URL}/api/users/me`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch user profile');
  }

  const json = await response.json();
  return json.data ?? json;
}

export async function fetchProductReviews(productId: string, page: number = 1, limit: number = 10) {
  const response = await fetch(`${API_BASE_URL}/api/products/${productId}/reviews?page=${page}&limit=${limit}`);
  if (!response.ok) {
    throw new Error('Failed to fetch reviews');
  }
  const data = await response.json();
  return {
    averageRating: data.averageRating || 0,
    numReviews: data.numReviews || 0,
    reviews: (data.reviews || []).map((r: any) => ({
      id: r.id || r._id,
      user: {
        id: r.user?.id || r.user?._id || '',
        name: r.user?.name || 'Anonymous User',
      },
      rating: r.rating || 0,
      comment: r.comment || '',
      createdAt: r.createdAt || new Date().toISOString(),
    })),
  };
}

export async function addProductReview(productId: string, rating: number, comment: string, token: string) {
  const response = await fetch(`${API_BASE_URL}/api/products/${productId}/reviews`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ productId, rating, comment }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to submit review');
  }
  return data;
}

export async function loginUser(email: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Login failed');
  }
  return data;
}

export async function registerUser(name: string, email: string, password: string, role?: string) {
  const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email, password, role }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Registration failed');
  }
  return data;
}

export async function fetchProductById(id: string): Promise<Product> {
  const response = await fetch(`${API_BASE_URL}/api/products/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch product');
  }
  const data = await response.json();
  const rawProduct = data.product ?? data.data ?? data;
  return normalizeProduct(rawProduct);
}

export async function createProduct(productData: any, token: string) {
  const response = await fetch(`${API_BASE_URL}/api/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(productData),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to create product');
  }
  return data;
}

export async function updateProduct(id: string, productData: any, token: string) {
  const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(productData),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to update product');
  }
  return data;
}

export async function deleteProduct(id: string, token: string) {
  const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to delete product');
  }
  return data;
}

export async function fetchAdminDashboardStats(token: string) {
  const response = await fetch(`${API_BASE_URL}/api/orders/admin/dashboard`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch dashboard stats');
  }
  return response.json();
}

export async function fetchAdminOrders(token: string) {
  const response = await fetch(`${API_BASE_URL}/api/orders/admin/orders`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch admin orders list');
  }
  return response.json();
}

export async function fetchAdminAOV(token: string) {
  const response = await fetch(`${API_BASE_URL}/api/orders/admin/aov`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch average order value stats');
  }
  return response.json();
}

export async function fetchAdminTopProducts(token: string) {
  const response = await fetch(`${API_BASE_URL}/api/orders/admin/top-products`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch top selling products');
  }
  return response.json();
}

export async function fetchAdminMonthlyRevenue(token: string) {
  const response = await fetch(`${API_BASE_URL}/api/orders/admin/monthly-revenue`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch monthly revenue analytics');
  }
  return response.json();
}

export async function fetchAdminOrderStatus(token: string) {
  const response = await fetch(`${API_BASE_URL}/api/orders/admin/order-status`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch order status analytics');
  }
  return response.json();
}

export async function fetchAdminTopCustomers(token: string) {
  const response = await fetch(`${API_BASE_URL}/api/orders/admin/top-customers`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch top customers');
  }
  return response.json();
}

export async function fetchAdminLowStock(token: string, threshold?: number) {
  const thresholdParam = threshold !== undefined ? `?threshold=${threshold}` : '';
  const response = await fetch(`${API_BASE_URL}/api/orders/admin/low-stock${thresholdParam}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch low stock products');
  }
  return response.json();
}

export async function fetchAdminTopCategories(token: string) {
  const response = await fetch(`${API_BASE_URL}/api/orders/admin/top-categories`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch top categories');
  }
  return response.json();
}

export async function updateOrderStatus(orderId: string, status: string, token: string) {
  const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to update order status');
  }
  return data;
}

export async function fetchAdminCoupons(token: string) {
  const response = await fetch(`${API_BASE_URL}/api/admin/coupons`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch coupons');
  }
  return data;
}

export async function createAdminCoupon(payload: any, token: string) {
  const response = await fetch(`${API_BASE_URL}/api/admin/coupons`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to create coupon');
  }
  return data;
}

export async function updateAdminCoupon(couponId: string, payload: any, token: string) {
  const response = await fetch(`${API_BASE_URL}/api/admin/coupons/${couponId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to update coupon');
  }
  return data;
}

export async function deleteAdminCoupon(couponId: string, token: string) {
  const response = await fetch(`${API_BASE_URL}/api/admin/coupons/${couponId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to delete coupon');
  }
  return data;
}

export async function toggleAdminCouponStatus(couponId: string, token: string) {
  const response = await fetch(`${API_BASE_URL}/api/admin/coupons/${couponId}/toggle-status`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to toggle coupon status');
  }
  return data;
}

