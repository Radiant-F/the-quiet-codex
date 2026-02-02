// ============ Author ============
export interface Author {
  id: string;
  username: string;
  profilePictureUrl?: string | null;
}

// ============ Article ============
export interface Article {
  id: string;
  slug: string;
  title: string;
  metaDescription: string;
  bannerImageUrl?: string | null;
  body: string;
  publishedAt?: string | null;
  author: Author;
  createdAt: string;
  updatedAt: string;
}

export interface ArticleListItem {
  id: string;
  slug: string;
  title: string;
  metaDescription: string;
  bannerImageUrl?: string | null;
  publishedAt?: string | null;
  author: Author;
  createdAt: string;
}

export interface PaginatedArticleList {
  articles: ArticleListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ============ Article Meta (Open Graph) ============
export interface ArticleMeta {
  title: string;
  description: string;
  image?: string | null;
  url: string;
  author: string;
  publishedAt?: string | null;
  type: "article";
}

// ============ Request Types ============
export interface CreateArticleRequest {
  title: string;
  metaDescription: string;
  body: string;
  slug?: string;
  publish?: boolean;
}

export interface UpdateArticleRequest {
  title?: string;
  metaDescription?: string;
  body?: string;
  slug?: string;
  publish?: boolean;
}

export interface ArticleListParams {
  page?: number;
  limit?: number;
  authorId?: string;
}

// ============ Response Types ============
export interface UploadBannerResponse {
  message: string;
  bannerImageUrl: string;
}

export interface MessageResponse {
  message: string;
}
