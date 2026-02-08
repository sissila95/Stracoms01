import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Booking, User, SearchFilters } from '../types';

interface AppContextType {
  user: User | null;
  isAuthenticated: boolean;
  bookings: Booking[];
  filters: SearchFilters;
  favorites: string[];
  login: (email: string, password: string) => void;
  register: (user: Omit<User, 'id'>) => void;
  logout: () => void;
  addBooking: (booking: Booking) => void;
  cancelBooking: (bookingId: string) => void;
  setFilters: (filters: SearchFilters) => void;
  toggleFavorite: (propertyId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [favorites, setFavorites] = useState<string[]>([]);

  const login = (email: string, _password: string) => {
    setUser({
      id: '1',
      fullName: 'Jean Makaya',
      email,
      phone: '+242 06 123 4567',
    });
  };

  const register = (userData: Omit<User, 'id'>) => {
    setUser({
      id: Date.now().toString(),
      ...userData,
    });
  };

  const logout = () => {
    setUser(null);
    setBookings([]);
  };

  const addBooking = (booking: Booking) => {
    setBookings((prev) => [booking, ...prev]);
  };

  const cancelBooking = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'cancelled' as const } : b))
    );
  };

  const toggleFavorite = (propertyId: string) => {
    setFavorites((prev) =>
      prev.includes(propertyId)
        ? prev.filter((id) => id !== propertyId)
        : [...prev, propertyId]
    );
  };

  return (
    <AppContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        bookings,
        filters,
        favorites,
        login,
        register,
        logout,
        addBooking,
        cancelBooking,
        setFilters,
        toggleFavorite,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
