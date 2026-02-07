export type PropertyType = 'hotel' | 'apartment';

export interface Property {
  id: string;
  name: string;
  type: PropertyType;
  description: string;
  address: string;
  neighborhood: string;
  city: string;
  pricePerNight: number;
  currency: string;
  rating: number;
  reviewCount: number;
  images: string[];
  amenities: string[];
  rooms: number;
  bathrooms: number;
  maxGuests: number;
  isFeatured: boolean;
  latitude: number;
  longitude: number;
  contactPhone: string;
  contactEmail: string;
}

export interface Booking {
  id: string;
  propertyId: string;
  propertyName: string;
  propertyImage: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  currency: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  createdAt: string;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  avatar?: string;
}

export interface SearchFilters {
  type?: PropertyType;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  neighborhood?: string;
  guests?: number;
}
