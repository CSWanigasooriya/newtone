export interface Category {
  cid: string;
  name: string;
  imageURL?: string;
  subCategories?: SubCategory[];
}

export interface SubCategory {
  sid: string;
  name: string;
  imageURL?: string;
}
