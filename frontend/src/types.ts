export interface Color {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: 'Outerwear' | 'Footwear' | 'Eyewear' | 'Bags' | 'Accessories';
  gender: 'Men' | 'Women' | 'Unisex';
  image: string;
  images?: string[];
  description: string;
  sizes?: string[];
  colors: Color[];
  rating: number;
  reviewsCount: number;
  details: string[];
  isNew?: boolean;
  stock?: number;
}

export interface ProductReview {
  id: string;
  user: {
    id: string;
    name: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
}

export interface CartItem {
  id: string; // unique cart item id (product.id + size + color)
  product: Product;
  selectedSize: string;
  selectedColor: Color;
  quantity: number;
}

export interface Order {
  id: string;
  date: string;
  itemsCount: number;
  total: number;
  status: 'Processing' | 'Shipped' | 'Delivered';
  image: string;
}

export interface UserProfile {
  name: string;
  email: string;
  tier: 'Obsidian' | 'Platinum' | 'Gold';
  points: number;
  nextTierPoints: number;
  orders: Order[];
  savedAddress: string;
  role?: string;
}
