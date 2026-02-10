import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'business';
  location?: string;
  phone?: string;
  // Business specific
  businessName?: string;
  businessAddress?: string;
  category?: string;
  logo?: string;
  // Customer specific
  favorites?: string[];
  co2Saved?: number;
  mealsPurchased?: number;
}

export interface Deal {
  id: string;
  businessId: string;
  businessName: string;
  businessLogo?: string;
  title: string;
  description: string;
  originalPrice: number;
  discountPrice: number;
  quantity: number;
  pickupStart: string;
  pickupEnd: string;
  category: string;
  image: string;
  rating: number;
  reviewCount: number;
  distance?: number;
  co2Saved: number;
  createdAt: string;
}

export interface Order {
  id: string;
  dealId: string;
  dealTitle: string;
  dealImage: string;
  customerId: string;
  customerName: string;
  businessId: string;
  businessName: string;
  quantity: number;
  totalPrice: number;
  originalTotal: number;
  status: 'pending' | 'confirmed' | 'ready' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refund_requested' | 'refunded';
  paymentMethod: 'kaspi' | 'card' | '';
  pickupTime: string;
  createdAt: string;
  co2Saved: number;
}

export interface Review {
  id: string;
  dealId: string;
  customerId: string;
  customerName: string;
  businessId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface AppContextType {
  user: User | null;
  deals: Deal[];
  orders: Order[];
  reviews: Review[];
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  registerCustomer: (data: Omit<User, 'id' | 'role' | 'favorites' | 'co2Saved' | 'mealsPurchased'> & { password: string }) => Promise<boolean>;
  registerBusiness: (data: Omit<User, 'id' | 'role'> & { password: string }) => Promise<boolean>;
  updateUser: (data: Partial<User>) => void;
  addDeal: (deal: Omit<Deal, 'id' | 'businessId' | 'businessName' | 'businessLogo' | 'rating' | 'reviewCount' | 'createdAt'>) => void;
  updateDeal: (id: string, data: Partial<Deal>) => void;
  deleteDeal: (id: string) => void;
  addOrder: (dealId: string, quantity: number, paymentMethod: 'kaspi' | 'card') => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  requestRefund: (orderId: string) => void;
  addReview: (dealId: string, rating: number, comment: string) => void;
  toggleFavorite: (dealId: string) => void;
  getBusinessDeals: () => Deal[];
  getBusinessOrders: () => Order[];
  getBusinessReviews: () => Review[];
  getCustomerOrders: () => Order[];
  getFavoriteDeals: () => Deal[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Mock data
const initialDeals: Deal[] = [
  {
    id: '1',
    businessId: 'b1',
    businessName: 'La Bella Italia',
    businessLogo: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=100&h=100&fit=crop',
    title: 'Surprise Pizza Box',
    description: 'Get 2 large pizzas with assorted toppings. Fresh from our wood-fired oven!',
    originalPrice: 32.00,
    discountPrice: 12.99,
    quantity: 5,
    pickupStart: '20:00',
    pickupEnd: '21:30',
    category: 'Restaurant',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&h=400&fit=crop',
    rating: 4.8,
    reviewCount: 156,
    distance: 0.8,
    co2Saved: 2.5,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    businessId: 'b2',
    businessName: 'Green Leaf Bakery',
    businessLogo: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=100&h=100&fit=crop',
    title: 'Fresh Bread & Pastries',
    description: 'Artisan bread, croissants, and pastries baked this morning.',
    originalPrice: 18.00,
    discountPrice: 5.99,
    quantity: 8,
    pickupStart: '17:00',
    pickupEnd: '18:30',
    category: 'Bakery',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&h=400&fit=crop',
    rating: 4.9,
    reviewCount: 203,
    distance: 1.2,
    co2Saved: 1.8,
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    businessId: 'b3',
    businessName: 'Sushi Master',
    businessLogo: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=100&h=100&fit=crop',
    title: 'Premium Sushi Platter',
    description: '20-piece assorted sushi including salmon, tuna, and specialty rolls.',
    originalPrice: 45.00,
    discountPrice: 18.99,
    quantity: 3,
    pickupStart: '21:00',
    pickupEnd: '22:00',
    category: 'Restaurant',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500&h=400&fit=crop',
    rating: 4.7,
    reviewCount: 89,
    distance: 2.1,
    co2Saved: 3.2,
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    businessId: 'b4',
    businessName: 'Café Aroma',
    businessLogo: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=100&h=100&fit=crop',
    title: 'Coffee & Treats Box',
    description: 'Two specialty coffees plus assorted cakes and muffins.',
    originalPrice: 22.00,
    discountPrice: 8.99,
    quantity: 6,
    pickupStart: '16:00',
    pickupEnd: '17:30',
    category: 'Café',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&h=400&fit=crop',
    rating: 4.6,
    reviewCount: 124,
    distance: 0.5,
    co2Saved: 1.5,
    createdAt: new Date().toISOString(),
  },
  {
    id: '5',
    businessId: 'b5',
    businessName: 'Fresh Market',
    businessLogo: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=100&h=100&fit=crop',
    title: 'Fruit & Veggie Rescue Box',
    description: 'Mixed seasonal fruits and vegetables, perfectly fresh!',
    originalPrice: 28.00,
    discountPrice: 9.99,
    quantity: 12,
    pickupStart: '18:00',
    pickupEnd: '20:00',
    category: 'Supermarket',
    image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=500&h=400&fit=crop',
    rating: 4.5,
    reviewCount: 78,
    distance: 1.8,
    co2Saved: 4.0,
    createdAt: new Date().toISOString(),
  },
  {
    id: '6',
    businessId: 'b6',
    businessName: 'Thai Orchid',
    businessLogo: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=100&h=100&fit=crop',
    title: 'Thai Feast Box',
    description: 'Pad Thai, Green Curry, and Spring Rolls - serves 2.',
    originalPrice: 38.00,
    discountPrice: 14.99,
    quantity: 4,
    pickupStart: '20:30',
    pickupEnd: '21:30',
    category: 'Restaurant',
    image: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=500&h=400&fit=crop',
    rating: 4.8,
    reviewCount: 167,
    distance: 1.5,
    co2Saved: 2.8,
    createdAt: new Date().toISOString(),
  },
];

const initialUsers: (User & { password: string })[] = [
  {
    id: 'c1',
    name: 'John Doe',
    email: 'customer@test.com',
    password: 'password',
    role: 'customer',
    location: '123 Main St, New York',
    phone: '+1 555-123-4567',
    favorites: ['1', '3'],
    co2Saved: 12.5,
    mealsPurchased: 8,
  },
  {
    id: 'b1',
    name: 'Marco Rossi',
    email: 'business@test.com',
    password: 'password',
    role: 'business',
    businessName: 'La Bella Italia',
    businessAddress: '456 Oak Ave, New York',
    category: 'Restaurant',
    phone: '+1 555-987-6543',
    logo: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=100&h=100&fit=crop',
  },
];

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<(User & { password: string })[]>(initialUsers);
  const [deals, setDeals] = useState<Deal[]>(initialDeals);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('refood_user');
    const savedDeals = localStorage.getItem('refood_deals');
    const savedOrders = localStorage.getItem('refood_orders');
    const savedReviews = localStorage.getItem('refood_reviews');
    const savedUsers = localStorage.getItem('refood_users');

    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedDeals) setDeals(JSON.parse(savedDeals));
    if (savedOrders) setOrders(JSON.parse(savedOrders));
    if (savedReviews) setReviews(JSON.parse(savedReviews));
    if (savedUsers) setUsers(JSON.parse(savedUsers));

    setIsLoading(false);
  }, []);

  // Save to localStorage on changes
  useEffect(() => {
    if (!isLoading) {
      if (user) {
        localStorage.setItem('refood_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('refood_user');
      }
    }
  }, [user, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('refood_deals', JSON.stringify(deals));
    }
  }, [deals, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('refood_orders', JSON.stringify(orders));
    }
  }, [orders, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('refood_reviews', JSON.stringify(reviews));
    }
  }, [reviews, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('refood_users', JSON.stringify(users));
    }
  }, [users, isLoading]);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call

    const foundUser = users.find(u => u.email === email && u.password === password);
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      setIsLoading(false);
      return true;
    }
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('refood_user');
  };

  const registerCustomer = async (data: Omit<User, 'id' | 'role' | 'favorites' | 'co2Saved' | 'mealsPurchased'> & { password: string }): Promise<boolean> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    if (users.find(u => u.email === data.email)) {
      setIsLoading(false);
      return false;
    }

    const newUser: User & { password: string } = {
      ...data,
      id: `c${Date.now()}`,
      role: 'customer',
      favorites: [],
      co2Saved: 0,
      mealsPurchased: 0,
    };

    setUsers(prev => [...prev, newUser]);
    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    setIsLoading(false);
    return true;
  };

  const registerBusiness = async (data: Omit<User, 'id' | 'role'> & { password: string }): Promise<boolean> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    if (users.find(u => u.email === data.email)) {
      setIsLoading(false);
      return false;
    }

    const newUser: User & { password: string } = {
      ...data,
      id: `b${Date.now()}`,
      role: 'business',
    };

    setUsers(prev => [...prev, newUser]);
    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    setIsLoading(false);
    return true;
  };

  const updateUser = (data: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...data };
    setUser(updatedUser);
    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, ...data } : u));
  };

  const addDeal = (deal: Omit<Deal, 'id' | 'businessId' | 'businessName' | 'businessLogo' | 'rating' | 'reviewCount' | 'createdAt'>) => {
    if (!user || user.role !== 'business') return;

    const newDeal: Deal = {
      ...deal,
      id: `d${Date.now()}`,
      businessId: user.id,
      businessName: user.businessName || user.name,
      businessLogo: user.logo,
      rating: 0,
      reviewCount: 0,
      createdAt: new Date().toISOString(),
    };

    setDeals(prev => [newDeal, ...prev]);
  };

  const updateDeal = (id: string, data: Partial<Deal>) => {
    setDeals(prev => prev.map(d => d.id === id ? { ...d, ...data } : d));
  };

  const deleteDeal = (id: string) => {
    setDeals(prev => prev.filter(d => d.id !== id));
  };

  const addOrder = (dealId: string, quantity: number, paymentMethod: 'kaspi' | 'card' = 'card') => {
    if (!user || user.role !== 'customer') return;

    const deal = deals.find(d => d.id === dealId);
    if (!deal || deal.quantity < quantity) return;

    const newOrder: Order = {
      id: `o${Date.now()}`,
      dealId,
      dealTitle: deal.title,
      dealImage: deal.image,
      customerId: user.id,
      customerName: user.name,
      businessId: deal.businessId,
      businessName: deal.businessName,
      quantity,
      totalPrice: deal.discountPrice * quantity,
      originalTotal: deal.originalPrice * quantity,
      status: 'confirmed',
      paymentStatus: 'paid',
      paymentMethod,
      pickupTime: `${deal.pickupStart} - ${deal.pickupEnd}`,
      createdAt: new Date().toISOString(),
      co2Saved: deal.co2Saved * quantity,
    };

    setOrders(prev => [newOrder, ...prev]);
    setDeals(prev => prev.map(d => d.id === dealId ? { ...d, quantity: d.quantity - quantity } : d));
    
    // Update user stats
    updateUser({
      co2Saved: (user.co2Saved || 0) + newOrder.co2Saved,
      mealsPurchased: (user.mealsPurchased || 0) + quantity,
    });
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  const requestRefund = (orderId: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, paymentStatus: 'refund_requested' as const } : o));
  };

  const addReview = (dealId: string, rating: number, comment: string) => {
    if (!user || user.role !== 'customer') return;

    const deal = deals.find(d => d.id === dealId);
    if (!deal) return;

    const newReview: Review = {
      id: `r${Date.now()}`,
      dealId,
      customerId: user.id,
      customerName: user.name,
      businessId: deal.businessId,
      rating,
      comment,
      createdAt: new Date().toISOString(),
    };

    setReviews(prev => [newReview, ...prev]);

    // Update deal rating
    const dealReviews = [...reviews.filter(r => r.dealId === dealId), newReview];
    const avgRating = dealReviews.reduce((acc, r) => acc + r.rating, 0) / dealReviews.length;
    updateDeal(dealId, { rating: Math.round(avgRating * 10) / 10, reviewCount: dealReviews.length });
  };

  const toggleFavorite = (dealId: string) => {
    if (!user || user.role !== 'customer') return;

    const favorites = user.favorites || [];
    const newFavorites = favorites.includes(dealId)
      ? favorites.filter(id => id !== dealId)
      : [...favorites, dealId];

    updateUser({ favorites: newFavorites });
  };

  const getBusinessDeals = () => {
    if (!user || user.role !== 'business') return [];
    return deals.filter(d => d.businessId === user.id);
  };

  const getBusinessOrders = () => {
    if (!user || user.role !== 'business') return [];
    return orders.filter(o => o.businessId === user.id);
  };

  const getBusinessReviews = () => {
    if (!user || user.role !== 'business') return [];
    return reviews.filter(r => r.businessId === user.id);
  };

  const getCustomerOrders = () => {
    if (!user || user.role !== 'customer') return [];
    return orders.filter(o => o.customerId === user.id);
  };

  const getFavoriteDeals = () => {
    if (!user || user.role !== 'customer') return [];
    return deals.filter(d => (user.favorites || []).includes(d.id));
  };

  return (
    <AppContext.Provider
      value={{
        user,
        deals,
        orders,
        reviews,
        isLoading,
        login,
        logout,
        registerCustomer,
        registerBusiness,
        updateUser,
        addDeal,
        updateDeal,
        deleteDeal,
        addOrder,
        updateOrderStatus,
        requestRefund,
        addReview,
        toggleFavorite,
        getBusinessDeals,
        getBusinessOrders,
        getBusinessReviews,
        getCustomerOrders,
        getFavoriteDeals,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
