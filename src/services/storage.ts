import type { Category, Post, StashState } from '../types';

const STORAGE_KEY = 'stash_app_v1_data';

export const storageService = {
  getInitialState(): StashState {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        return { categories: [], posts: [] };
      }
      const parsed = JSON.parse(stored);
      return {
        categories: Array.isArray(parsed.categories) ? parsed.categories : [],
        posts: Array.isArray(parsed.posts) ? parsed.posts : [],
      };
    } catch (err) {
      console.error('Failed to load Stash data from localStorage:', err);
      return { categories: [], posts: [] };
    }
  },

  saveState(state: StashState): boolean {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      return true;
    } catch (err) {
      console.error('Failed to save Stash data to localStorage:', err);
      return false;
    }
  },

  addCategory(state: StashState, name: string): { state: StashState; category: Category } {
    const newCategory: Category = {
      id: 'cat_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      name: name.trim(),
      createdAt: Date.now(),
    };
    const nextState = {
      ...state,
      categories: [...state.categories, newCategory],
    };
    this.saveState(nextState);
    return { state: nextState, category: newCategory };
  },

  renameCategory(state: StashState, id: string, newName: string): StashState {
    const nextState = {
      ...state,
      categories: state.categories.map((cat) =>
        cat.id === id ? { ...cat, name: newName.trim() } : cat
      ),
    };
    this.saveState(nextState);
    return nextState;
  },

  deleteCategory(state: StashState, id: string): StashState {
    const nextState = {
      categories: state.categories.filter((cat) => cat.id !== id),
      posts: state.posts.filter((post) => post.categoryId !== id),
    };
    this.saveState(nextState);
    return nextState;
  },

  addPost(state: StashState, categoryId: string, url: string, tweetId: string): { state: StashState; post: Post } {
    const newPost: Post = {
      id: 'post_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      categoryId,
      url,
      tweetId,
      createdAt: Date.now(),
    };
    const nextState = {
      ...state,
      posts: [...state.posts, newPost],
    };
    this.saveState(nextState);
    return { state: nextState, post: newPost };
  },

  deletePost(state: StashState, postId: string): StashState {
    const nextState = {
      ...state,
      posts: state.posts.filter((post) => post.id !== postId),
    };
    this.saveState(nextState);
    return nextState;
  },
};
