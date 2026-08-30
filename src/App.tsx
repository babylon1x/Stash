import React, { useState } from 'react';
import { Plus, FolderPlus, Bookmark, CheckCircle, AlertCircle, Search } from 'lucide-react';
import type { StashState, Category } from './types';
import { storageService } from './services/storage';
import { buildSearchText, matchesQuery } from './utils/search';
import { CategoryRow } from './components/category/CategoryRow';
import { CreateCategoryModal } from './components/modals/CreateCategoryModal';
import { RenameCategoryModal } from './components/modals/RenameCategoryModal';
import { DeleteCategoryModal } from './components/modals/DeleteCategoryModal';
import { AddPostModal } from './components/modals/AddPostModal';

export const App: React.FC = () => {
  const [state, setState] = useState<StashState>(() => storageService.getInitialState());
  const [searchQuery, setSearchQuery] = useState('');

  // Modal active states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [renameCategory, setRenameCategory] = useState<Category | null>(null);
  const [deleteCategory, setDeleteCategory] = useState<Category | null>(null);
  const [addPostCategory, setAddPostCategory] = useState<Category | null>(null);

  // Notification / Feedback banner state
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // 1. Category Actions
  const handleCreateCategory = (name: string) => {
    const { state: updatedState } = storageService.addCategory(state, name);
    setState(updatedState);
    showToast(`Category "${name}" created`);
  };

  const handleRenameCategory = (id: string, newName: string) => {
    const updatedState = storageService.renameCategory(state, id, newName);
    setState(updatedState);
    showToast('Category renamed');
  };

  const handleDeleteCategory = (id: string) => {
    const catToDelete = state.categories.find((c) => c.id === id);
    const updatedState = storageService.deleteCategory(state, id);
    setState(updatedState);
    showToast(`Deleted category "${catToDelete?.name || ''}"`);
  };

  // 2. Post Actions
  const handleAddPost = (categoryId: string, url: string, tweetId: string) => {
    const { state: updatedState } = storageService.addPost(state, categoryId, url, tweetId);
    setState(updatedState);
    showToast('Post added to category');
  };

  const handleDeletePost = (postId: string) => {
    const updatedState = storageService.deletePost(state, postId);
    setState(updatedState);
    showToast('Post removed');
  };

  const handlePostMetadata = (postId: string, metadata: { author?: string; searchText?: string }) => {
    const existing = state.posts.find((p) => p.id === postId);
    if (!existing) return;

    const category = state.categories.find((c) => c.id === existing.categoryId);

    const hasNewAuthor = !!metadata.author;
    const hasText = !!metadata.searchText && metadata.searchText !== metadata.author;

    if (!hasNewAuthor && !hasText) return;

    const author = metadata.author || existing.author;

    const text = metadata.searchText && metadata.searchText !== metadata.author
      ? metadata.searchText
      : existing.searchText;

    const mergedSearchText = buildSearchText({
      categoryName: category?.name,
      username: existing.username,
      author,
      text,
      url: existing.url,
    }) || existing.searchText;

    const updatedState = storageService.updatePostMetadata(state, postId, {
      author,
      searchText: mergedSearchText,
    });
    setState(updatedState);
  };

  const hasCategories = state.categories.length > 0;

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const isSearching = normalizedQuery.length > 0;

  const filtered = state.categories
    .map((category) => {
      const posts = state.posts.filter((post) => {
        if (post.categoryId !== category.id) return false;
        if (!isSearching) return true;

        const categoryName = category.name;
        const searchText = post.searchText ?? buildSearchText({
          categoryName,
          username: post.username,
          author: post.author,
          url: post.url,
        });

        return (
          matchesQuery(searchText, normalizedQuery) ||
          matchesQuery(categoryName, normalizedQuery)
        );
      });

      return { category, posts };
    })
    .filter(({ posts }) => posts.length > 0);

  const totalMatchCount = filtered.reduce((sum, { posts }) => sum + posts.length, 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-sky-500/30 selection:text-sky-200">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center shadow-md shadow-sky-500/10">
                <Bookmark className="w-5 h-5 text-white fill-white/20" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  Stash
                  <span className="text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
                    MVP
                  </span>
                </h1>
              </div>
            </div>

            {hasCategories && (
              <button
                onClick={() => setIsCreateModalOpen(true)}
                type="button"
                className="max-w-[250px] inline-flex items-center justify-center gap-2 px-4 py-2 bg-sky-500 hover:bg-sky-400 text-white font-medium text-sm rounded-xl shadow-sm transition-all hover:shadow-sky-500/25"
              >
                <Plus className="w-4 h-4" />
                <span>Create a category</span>
              </button>
            )}
          </div>

          <div className="relative mt-4">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search saved posts by text, username, category, or URL"
              aria-label="Search saved posts"
              className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all placeholder:text-slate-600"
            />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        {!hasCategories ? (
          /* Global Empty State */
          <div className="max-w-md mx-auto my-20 text-center flex flex-col items-center justify-center p-8 bg-slate-900/40 border border-slate-800 rounded-2xl shadow-xl">
            <div className="w-14 h-14 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center mb-5 text-sky-400">
              <FolderPlus className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-bold text-slate-100 tracking-tight mb-2">
              Organize the X posts you want to keep.
            </h2>
            <p className="text-sm text-slate-400 mb-8 max-w-sm leading-relaxed">
              Save your favorite public X posts into custom categories right in your browser.
            </p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              type="button"
              className="w-full max-w-[250px] inline-flex items-center justify-center gap-2 px-5 py-3 bg-sky-500 hover:bg-sky-400 text-white font-semibold text-sm rounded-xl shadow-md transition-all hover:shadow-sky-500/25"
            >
              <Plus className="w-4 h-4" />
              <span>Create a category</span>
            </button>
          </div>
        ) : (
          /* Category List Rows */
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
                {isSearching
                  ? `Showing ${totalMatchCount} matching ${totalMatchCount === 1 ? 'post' : 'posts'}`
                  : `Your Categories (${state.categories.length})`}
              </p>
            </div>

            {isSearching && filtered.length === 0 ? (
              <div className="py-16 px-4 text-center flex flex-col items-center justify-center">
                <Search className="w-10 h-10 text-slate-600 mb-3 stroke-[1.5]" />
                <p className="text-base font-semibold text-slate-200">No matching posts found.</p>
                <p className="text-sm text-slate-400 mt-1">Try another keyword or username.</p>
              </div>
            ) : (
              filtered.map(({ category, posts }) => (
                <CategoryRow
                  key={category.id}
                  category={category}
                  posts={posts}
                  onRenameClick={(cat) => setRenameCategory(cat)}
                  onDeleteCategoryClick={(cat) => setDeleteCategory(cat)}
                  onAddPostClick={(cat) => setAddPostCategory(cat)}
                  onDeletePostClick={handleDeletePost}
                  onMetadataExtracted={handlePostMetadata}
                />
              ))
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 px-6 py-6 text-center text-xs text-slate-600">
        <p>Stash — Local X Bookmark Organizer</p>
      </footer>

      {/* Modals (conditionally rendered so form state resets on open) */}
      {isCreateModalOpen && (
        <CreateCategoryModal
          onClose={() => setIsCreateModalOpen(false)}
          onCreate={handleCreateCategory}
        />
      )}

      {renameCategory && (
        <RenameCategoryModal
          key={renameCategory.id}
          category={renameCategory}
          onClose={() => setRenameCategory(null)}
          onRename={handleRenameCategory}
        />
      )}

      {deleteCategory && (
        <DeleteCategoryModal
          category={deleteCategory}
          postCount={state.posts.filter((p) => p.categoryId === deleteCategory.id).length}
          onClose={() => setDeleteCategory(null)}
          onConfirmDelete={handleDeleteCategory}
        />
      )}

      {addPostCategory && (
        <AddPostModal
          key={addPostCategory.id}
          category={addPostCategory}
          onClose={() => setAddPostCategory(null)}
          onAddPost={handleAddPost}
        />
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-slate-900 border border-slate-700 text-slate-100 rounded-xl shadow-2xl text-xs font-medium animate-in slide-in-from-bottom-5 duration-200">
          {toastMessage.type === 'success' ? (
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-400" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}
    </div>
  );
};

export default App;
