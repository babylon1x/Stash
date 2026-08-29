import React, { useEffect, useRef, useState } from 'react';
import { ExternalLink, AlertCircle, Trash2 } from 'lucide-react';

interface PostEmbedProps {
  url: string;
  tweetId: string;
  onDelete: () => void;
}

declare global {
  interface Window {
    twttr?: {
      widgets?: {
        createTweet?: (
          tweetId: string,
          element: HTMLElement,
          options?: Record<string, unknown>
        ) => Promise<HTMLElement | null>;
        load?: (element?: HTMLElement) => void;
      };
    };
  }
}

export const PostEmbed: React.FC<PostEmbedProps> = ({ url, tweetId, onDelete }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loadStatus, setLoadStatus] = useState<'loading' | 'success' | 'failed'>('loading');

  useEffect(() => {
    let isMounted = true;
    let timeoutId: ReturnType<typeof setTimeout>;

    const renderEmbed = async () => {
      if (!containerRef.current) return;
      containerRef.current.innerHTML = '';
      setLoadStatus('loading');

      // Helper to check for window.twttr availability
      const waitForTwttr = async (maxAttempts = 20): Promise<boolean> => {
        for (let i = 0; i < maxAttempts; i++) {
          if (window.twttr?.widgets?.createTweet) return true;
          await new Promise((res) => setTimeout(res, 250));
        }
        return false;
      };

      const hasTwttr = await waitForTwttr();

      if (!isMounted) return;

      if (!hasTwttr || !window.twttr?.widgets?.createTweet) {
        setLoadStatus('failed');
        return;
      }

      try {
        // Set fallback timeout in case widget rendering hangs
        timeoutId = setTimeout(() => {
          if (isMounted) {
            setLoadStatus((prev) => (prev === 'loading' ? 'failed' : prev));
          }
        }, 8000);

        const el = await window.twttr.widgets.createTweet(tweetId, containerRef.current, {
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
    <div className="group relative w-[340px] max-w-[340px] flex-shrink-0 bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden shadow-md flex flex-col justify-between hover:border-slate-700 transition-colors">
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
      <div className="p-2 min-h-[140px] flex items-center justify-center relative">
        {loadStatus === 'loading' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-slate-900/50 text-slate-400 gap-2">
            <div className="w-5 h-5 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs">Loading X embed...</span>
          </div>
        )}

        <div
          ref={containerRef}
          className={`w-full flex justify-center ${loadStatus !== 'success' ? 'hidden' : 'block'}`}
        />

        {loadStatus === 'failed' && (
          <div className="p-6 text-center flex flex-col items-center justify-center gap-3 text-slate-400">
            <AlertCircle className="w-8 h-8 text-amber-400/80" />
            <div className="space-y-1">
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
