import React, { useEffect, useRef, useState } from 'react';
import { ExternalLink, AlertCircle, Trash2 } from 'lucide-react';
import { getTwitterWidgets } from '../../utils/widgetLoader';

interface PostEmbedProps {
  url: string;
  tweetId: string;
  onDelete: () => void;
}

export const PostEmbed: React.FC<PostEmbedProps> = ({ url, tweetId, onDelete }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loadStatus, setLoadStatus] = useState<'loading' | 'success' | 'failed'>('loading');

  useEffect(() => {
    let isMounted = true;
    let timeoutId: ReturnType<typeof setTimeout>;

    const renderEmbed = async () => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      container.innerHTML = '';

      try {
        timeoutId = setTimeout(() => {
          if (isMounted) {
            setLoadStatus((prev) => (prev === 'loading' ? 'failed' : prev));
          }
        }, 8000);

        const twttr = await getTwitterWidgets();
        if (!isMounted) return;

        const el = await twttr.widgets.createTweet(tweetId, container, {
          theme: 'dark',
          dnt: true,
          align: 'center',
          conversation: 'none',
        });

        clearTimeout(timeoutId);

        if (!isMounted) return;

        if (el) {
          setLoadStatus('success');
        } else {
          setLoadStatus('failed');
        }
      } catch (err) {
        clearTimeout(timeoutId);
        console.error('Error rendering tweet embed:', err);
        if (isMounted) setLoadStatus('failed');
      }
    };

    renderEmbed();

    return () => {
      isMounted = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [tweetId]);

  return (
    <div className="group relative w-[340px] max-w-[340px] flex-shrink-0 bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden shadow-md flex flex-col hover:border-slate-700 transition-colors">
      {/* Top action bar overlay */}
      <div className="p-2.5 flex items-center justify-between bg-slate-900/90 border-b border-slate-800/60 z-10">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-slate-400 hover:text-sky-400 flex items-center gap-1.5 transition-colors truncate max-w-[240px]"
          title={url}
        >
          <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="truncate">{url.replace(/^https?:\/\//, '')}</span>
        </a>

        <button
          onClick={onDelete}
          type="button"
          aria-label="Delete saved post"
          title="Delete post"
          className="text-slate-500 hover:text-red-400 hover:bg-red-500/10 p-1.5 rounded-md transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Embed Container & States */}
      <div className="p-2 flex items-start justify-center relative">
        <div
          ref={containerRef}
          className={`w-full flex justify-center ${loadStatus !== 'success' ? 'min-h-[140px]' : ''}`}
        />

        {loadStatus === 'loading' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-slate-900/50 text-slate-400 gap-2">
            <div className="w-5 h-5 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs">Loading X embed...</span>
          </div>
        )}

        {loadStatus === 'failed' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-slate-900/50 text-slate-400 gap-2">
            <AlertCircle className="w-8 h-8 text-amber-400/80" />
            <div className="space-y-1 text-center">
              <p className="text-sm font-medium text-slate-200">X post could not load</p>
              <p className="text-xs text-slate-400">Post may be private, deleted, or blocked by browser extensions.</p>
            </div>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-500/10 text-sky-400 hover:bg-sky-500/20 text-xs font-medium transition-colors"
            >
              Open on X
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
};