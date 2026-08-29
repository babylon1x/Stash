import React, { useState } from 'react';
import { X, Link as LinkIcon } from 'lucide-react';
import type { Category } from '../../types';
import { validateAndNormalizeXUrl } from '../../utils/urlValidator';

interface AddPostModalProps {
  category: Category;
  onClose: () => void;
  onAddPost: (categoryId: string, url: string, tweetId: string) => void;
}

export const AddPostModal: React.FC<AddPostModalProps> = ({
  category,
  onClose,
  onAddPost,
}) => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = validateAndNormalizeXUrl(url);

    if (!result.isValid || !result.normalizedUrl || !result.tweetId) {
      setError(result.errorMessage || 'Enter a valid X post URL.');
      return;
    }

    onAddPost(category.id, result.normalizedUrl, result.tweetId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div
        className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
          <div className="flex items-center gap-2">
            <LinkIcon className="w-4 h-4 text-sky-400" />
            <h3 className="text-lg font-semibold text-slate-100">
              Add X Post to <span className="text-sky-400">{category.name}</span>
            </h3>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="post-url" className="block text-xs font-medium text-slate-400 mb-1.5">
              Public X Post URL
            </label>
            <input
              id="post-url"
              type="text"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (error) setError('');
              }}
              placeholder="https://x.com/username/status/1234567890"
              autoFocus
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all placeholder:text-slate-600"
            />
            {error ? (
              <p className="mt-2 text-xs text-red-400 font-medium">{error}</p>
            ) : (
              <p className="mt-2 text-xs text-slate-500">
                Paste any public link from x.com or twitter.com.
              </p>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium bg-sky-500 hover:bg-sky-400 text-white rounded-xl shadow-sm transition-colors"
            >
              Add Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
