export interface Category {
  id: string;
  name: string;
  createdAt: number;
}

export interface Post {
  id: string;
  categoryId: string;
  url: string;
  tweetId: string;
  createdAt: number;
}

export interface StashState {
  categories: Category[];
  posts: Post[];
}
