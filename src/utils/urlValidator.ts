export interface ValidationResult {
  isValid: boolean;
  errorMessage?: string;
  normalizedUrl?: string;
  tweetId?: string;
}

/**
 * Validates and normalizes an X/Twitter URL.
 * Accepts only individual post status URLs from x.com or twitter.com.
 * Rejects non-post pages (profiles, search, lists, home, settings) and other domains.
 */
export function validateAndNormalizeXUrl(inputUrl: string): ValidationResult {
  if (!inputUrl || typeof inputUrl !== 'string') {
    return { isValid: false, errorMessage: 'Enter a valid X post URL.' };
  }

  const trimmed = inputUrl.trim();
  if (!trimmed) {
    return { isValid: false, errorMessage: 'Enter a valid X post URL.' };
  }

  let parsedUrl: URL;
  try {
    // Add protocol if user pasted hostname directly
    const urlToParse = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    parsedUrl = new URL(urlToParse);
  } catch {
    return { isValid: false, errorMessage: 'Enter a valid X post URL.' };
  }

  const hostname = parsedUrl.hostname.toLowerCase().replace(/^www\./, '');

  // Check supported domains
  if (hostname !== 'x.com' && hostname !== 'twitter.com') {
    return { isValid: false, errorMessage: 'Stash only supports X post links.' };
  }

  const pathname = parsedUrl.pathname;

  // Pattern for X/Twitter post status: /{username}/status/{tweetId} or /i/status/{tweetId}
  const statusRegex = /^(?:\/([a-zA-Z0-9_]{1,15}))?\/status\/(\d+)/i;
  const match = pathname.match(statusRegex);

  if (!match) {
    // Determine if it's a known non-post section to give clearer feedback
    if (pathname === '/' || pathname === '') {
      return { isValid: false, errorMessage: 'Enter a valid X post URL, not the X homepage.' };
    }
    return { isValid: false, errorMessage: 'Enter a valid X post URL (e.g., https://x.com/username/status/123456789).' };
  }

  const tweetId = match[2];
  const username = match[1] || 'i';

  // Normalize URL format to https://x.com/{username}/status/{tweetId}
  const normalizedUrl = `https://x.com/${username}/status/${tweetId}`;

  return {
    isValid: true,
    normalizedUrl,
    tweetId,
  };
}
