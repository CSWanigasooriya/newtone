export interface Category {
  cid: string;
  title: string;
  imageURL?: string;
  source?: 'Domestic' | 'International';
  subCategories?: SubCategory[];
  notes?: string[];
}

export interface SubCategory {
  sid: string;
  name: string;
  imageURL?: string;
  description?: string;
}
