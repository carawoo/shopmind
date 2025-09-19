export interface UploadDropzoneProps {
  onUpload: (files: File[]) => void;
  maxFiles?: number;
  acceptedTypes?: string[];
}

export interface ProductInfo {
  name: string;
  brand?: string;
  barcode?: string;
  ingredients?: string[];
  nutritionFacts?: NutritionFacts;
  allergens?: string[];
  price?: number;
  images?: string[];
}

export interface NutritionFacts {
  calories?: number;
  protein?: number;
  carbohydrates?: number;
  fat?: number;
  fiber?: number;
  sodium?: number;
  sugar?: number;
}

export interface UserProfile {
  budget_krw: number;
  allergies: string[];
  diet_tags: string[];
  preferences: {
    notification: boolean;
    price_alert: boolean;
    health_score: boolean;
  };
}
