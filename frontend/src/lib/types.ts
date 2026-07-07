export interface Template {
  slug: string;
  code: string;
  name: string;
  emoji: string;
  description?: string;
  category: string;
  categoryName?: string;
  level: string;
  levelName?: string;
  levelEmoji?: string;
  price: { pen: string; usd: string; formatted: string };
  previewGradient?: string;
  pill?: string;
  title?: string;
  isFeatured?: boolean;
  fields?: TemplateField[];
}

export interface TemplateField {
  fieldKey: string;
  fieldType: string;
  label: string;
  placeholder?: string;
  maxLength?: number;
  isRequired: boolean;
}

export interface Category {
  id: number;
  slug: string;
  name: string;
  emoji: string;
  templateCount: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: { page: number; limit: number; total: number; totalPages: number };
}

export interface DraftResult {
  orderId: string;
  status: string;
  previewUrl: string;
  isFree: boolean;
  amount: number;
  currency: string;
}

export interface DedicationResult {
  slug: string;
  accessCode: string;
  para: string;
  de: string;
  mensaje: string;
  cancion?: string;
  viewUrl: string;
  templateSlug?: string;
  htmlContent?: string;
  template?: {
    slug: string;
    name: string;
    emoji: string;
    code: string;
    gradient?: string;
  };
}
