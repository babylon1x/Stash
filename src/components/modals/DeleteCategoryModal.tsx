import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import type { Category } from '../../types';

interface DeleteCategoryModalProps {
  category: Category;
  postCount: number;
  onClose: () => void;
  onConfirmDelete: (id: string) => void;
}

export const DeleteCategoryModal: React.FC<DeleteCategoryModalProps> = ({
  category,
  postCount,
  onClose,
  onConfirmDelete,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div
        className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2 text-amber-400">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="text-lg font-semibold text-slate-100">Delete Category</h3>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 mb-6">
          <p className="text-sm text-slate-200">
            Delete <strong className="text-white font-semibold">"{category.name}"</strong>?
          </p>
          <p className="text-xs text-slate-400 leading-relaxed bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl">
            This will also delete the {postCount} saved {postCount === 1 ? 'post' : 'posts'} inside this category.
            This action cannot be undone.
          </p>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirmDelete(category.id);
              onClose();
            }}
            className="px-4 py-2 text-sm font-medium bg-red-500 hover:bg-red-400 text-white rounded-xl shadow-sm transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
