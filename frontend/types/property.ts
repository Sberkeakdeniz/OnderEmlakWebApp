export interface PropertyImage {
  _id?: string;
  url: string;
  caption?: string;
}

export interface PropertyLocation {
  address: string;
  city: string;
  state: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface PropertyFeatures {
  bedrooms?: number;
  bathrooms?: number;
  area: number;
  parking: boolean;
  furnished: boolean;
}

export interface PropertyOwner {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export type PropertyType = 'apartment' | 'house' | 'villa' | 'office' | 'land';
export type PropertyStatus = 'for-sale' | 'for-rent' | 'sold' | 'rented';

export interface Property {
  _id: string;
  title: string;
  description: string;
  type: PropertyType;
  status: PropertyStatus;
  price: number;
  location: PropertyLocation;
  features: PropertyFeatures;
  images: PropertyImage[];
  amenities: string[];
  owner: PropertyOwner;
  views: number;
  sahibindenUrl?: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  count: number;
  total: number;
  page: number;
  pages: number;
  data: T[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  count?: number;
}
