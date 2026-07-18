import { useState, useEffect } from 'react';
import { Product, CartItem, Color } from '../types';
import { normalizeProduct } from '../api';

export function useCart(triggerNotification: (msg: string, type?: 'success' | 'info') => void, setUserProfile: any) {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('luxemarket_cart');
    return saved
      ? JSON.parse(saved).map((item: CartItem) => ({
          ...item,
          product: normalizeProduct(item.product),
        }))
      : [];
  });

  const [favoriteItems, setFavoriteItems] = useState<Product[]>(() => {
    const saved = localStorage.getItem('luxemarket_favorites');
    return saved ? JSON.parse(saved).map(normalizeProduct) : [];
  });

  useEffect(() => {
    localStorage.setItem('luxemarket_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('luxemarket_favorites', JSON.stringify(favoriteItems));
  }, [favoriteItems]);

  const handleAddToCart = (product: Product, size: string, color: Color, quantity: number) => {
    const cartItemId = `${product.id}-${size}-${color.name}`;
    
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === cartItemId);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === cartItemId ? { ...item, quantity: item.quantity + quantity } : item
        );
      } else {
        return [...prevItems, { id: cartItemId, product, selectedSize: size, selectedColor: color, quantity }];
      }
    });

    triggerNotification(`Added ${quantity}x ${product.name} (${size}) to your bag`);
  };

  const handleUpdateCartQuantity = (id: string, quantity: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const handleRemoveCartItem = (id: string) => {
    const item = cartItems.find((i) => i.id === id);
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
    if (item) {
      triggerNotification(`Removed ${item.product.name} from bag`, 'info');
    }
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleFavoriteToggle = (product: Product) => {
    const isAlreadyFav = favoriteItems.some((item) => item.id === product.id);
    if (isAlreadyFav) {
      setFavoriteItems((prev) => prev.filter((item) => item.id !== product.id));
      triggerNotification(`Removed ${product.name} from favorites`, 'info');
    } else {
      setFavoriteItems((prev) => [...prev, product]);
      triggerNotification(`Saved ${product.name} to favorites`);
    }
  };

  const handleAddOrder = (total: number, itemsCount: number, image: string) => {
    const newOrder = {
      id: `LM-${Math.floor(10000 + Math.random() * 90000)}`,
      date: new Date().toISOString().split('T')[0],
      itemsCount,
      total,
      status: 'Processing' as const,
      image
    };

    const pointsEarned = Math.floor(total * 10);

    setUserProfile((prev: any) => {
      const updatedPoints = prev.points + pointsEarned;
      let nextTier = prev.tier;
      if (updatedPoints >= 20000) {
        nextTier = 'Obsidian';
      } else if (updatedPoints >= 10000) {
        nextTier = 'Platinum';
      }

      return {
        ...prev,
        points: updatedPoints,
        tier: nextTier,
        orders: [newOrder, ...prev.orders]
      };
    });

    triggerNotification(`Order processed! Earned +${pointsEarned} loyalty points.`);
  };

  return {
    cartItems,
    favoriteItems,
    handleAddToCart,
    handleUpdateCartQuantity,
    handleRemoveCartItem,
    handleClearCart,
    handleFavoriteToggle,
    handleAddOrder,
  };
}
