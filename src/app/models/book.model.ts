export interface Book {
  bookId?: number;
  title: string;
  author: Author;
  category: Category;
  price: number;
  description: string;
  isbn: string;
  publicationDate: string;
  publisher: string;
  imageUrl?: string;
  averageRating?: number;
  totalReviews?: number;
  stockQuantity?: number;
}

// Interface for API response format
export interface BookApiResponse {
  bookId?: number;
  title: string;
  authorName: string;
  categoryName: string;
  price: number;
  description?: string;
  isbn?: string;
  publicationDate?: string;
  publisher?: string;
  imageUrl?: string;
  averageRating?: number;
  totalReviews?: number;
  stockQuantity?: number;
}

export interface Author {
  authorId?: number;
  name: string;
  biography?: string;
  nationality?: string;
}

export interface Category {
  categoryId?: number;
  name: string;
  description?: string;
}

