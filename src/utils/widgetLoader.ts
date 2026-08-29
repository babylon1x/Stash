const TWITTER_WIDGETS_URL = 'https://platform.twitter.com/widgets.js';

export interface TwitterWidgets {
  createTweet: (
    tweetId: string,
    element: HTMLElement,
    options?: Record<string, unknown>
  ) => Promise<HTMLElement | null>;
  load: (element?: HTMLElement) => void;
}

export interface TwitterGlobal {
  widgets: TwitterWidgets;
  ready?: (cb: () => void) => void;
}

declare global {
  interface Window {
    twttr?: TwitterGlobal;
    __stashWidgetsPromise?: Promise<TwitterGlobal>;
  }
}

let loadPromise: Promise<TwitterGlobal> | null = null;

function injectWidgetsScript(): Promise<TwitterGlobal> {
  return new Promise<TwitterGlobal>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${TWITTER_WIDGETS_URL}"]`
    ) as HTMLScriptElement | null;

    const onLoad = () => {
      if (window.twttr?.widgets) {
        resolve(window.twttr);
      } else {
        reject(new Error('Twitter widgets script loaded but twttr was not initialized.'));
      }
    };

    const script = existing ?? document.createElement('script');

    if (!existing) {
      script.src = TWITTER_WIDGETS_URL;
      script.async = true;
      script.charset = 'utf-8';
      script.onload = onLoad;
      script.onerror = () => reject(new Error('Failed to load Twitter widgets script.'));
      document.head.appendChild(script);
    } else {
      if (script.dataset.loaded === 'true') {
        onLoad();
        return;
      }
      script.addEventListener('load', onLoad);
      script.addEventListener('error', () =>
        reject(new Error('Failed to load Twitter widgets script.'))
      );
    }
  });
}

export function getTwitterWidgets(): Promise<TwitterGlobal> {
  if (window.twttr?.widgets) {
    return Promise.resolve(window.twttr);
  }

  if (!loadPromise) {
    loadPromise = injectWidgetsScript();
  }

  return loadPromise;
}