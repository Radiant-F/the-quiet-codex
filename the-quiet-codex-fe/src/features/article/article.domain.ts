export interface Author {
  id: string;
  username: string;
  profilePictureUrl: string | null;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  metaDescription: string | null;
  bannerImageUrl: string | null;
  body: string;
  publishedAt: string | null;
  author: Author;
  createdAt: string;
  updatedAt: string;
}

export interface ArticleListItem {
  id: string;
  slug: string;
  title: string;
  metaDescription: string | null;
  bannerImageUrl: string | null;
  publishedAt: string | null;
  author: Author;
  createdAt: string;
}

export interface PaginatedArticles {
  articles: ArticleListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateArticleRequest {
  title: string;
  metaDescription?: string;
  body: string;
  slug?: string;
  publish?: boolean;
  banner?: File;
}

export interface UpdateArticleRequest {
  title?: string;
  metaDescription?: string;
  body?: string;
  slug?: string;
  publish?: boolean;
  banner?: File;
  removeBanner?: boolean;
}

export interface ArticleListParams {
  page?: number;
  limit?: number;
  authorId?: string;
}

export interface MyArticleListParams {
  page?: number;
  limit?: number;
}

export interface ArticleMeta {
  title: string;
  description: string;
  image: string | null;
  url: string;
  author: string;
  publishedAt: string;
  type: string;
}

export interface MessageResponse {
  message: string;
}
