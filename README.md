# Stash

A lightweight desktop web app for organizing public X posts into personal categories using browser local storage.

## Product Concept

People who do not have X Premium cannot organize their X bookmarks into categories. Stash gives them a simple personal place to save public X posts into custom categories so they can find those posts later.

Stash does not retrieve or store post content. It stores only the post URL and uses X's official website embed mechanism to render each post. Everything lives in the user's browser; no backend, no account, and no data leaves the device.

## Features Implemented

- Create categories with a name.
- Rename categories inline.
- Delete categories with a confirmation warning (also deletes contained posts).
- Add public X post URLs into a selected category.
- Render saved posts using official X embeds.
- Delete individual saved posts.
- Horizontal scrolling post rows within each category.
- Persistent local browser storage that survives page refreshes.
- Empty states for new users and empty categories.
- URL validation that accepts only public X post URLs from x.com and twitter.com.

## How It Works

1. Open Stash.
2. Create a category.
3. Click **Add link to post** inside a category.
4. Paste a public X post URL and click **Add**.
5. The URL is validated and saved locally.
6. The official X embed renders inside the category row.
7. To organize further, create additional categories and repeat.

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS (via `@tailwindcss/vite`)
- Lucide React (icons)
- Browser Local Storage
- X official embed script (`platform.twitter.com/widgets.js`)

## Project Structure

```text
src/
 ├── types/
 │    └── index.ts          # Category and Post type definitions
 ├── services/
 │    └── storage.ts        # LocalStorage persistence layer
 ├── utils/
 │    └── urlValidator.ts   # X/Twitter URL validation and normalization
 ├── components/
 │    ├── category/
 │    │    └── CategoryRow.tsx     # One category row with its posts and controls
 │    ├── post/
 │    │    └── PostEmbed.tsx       # X embed card with loading and fallback states
 │    └── modals/
 │         ├── CreateCategoryModal.tsx
 │         ├── RenameCategoryModal.tsx
 │         ├── DeleteCategoryModal.tsx
 │         └── AddPostModal.tsx
 ├── App.tsx                 # Main application state and layout
 ├── main.tsx                # Entry point
 └── index.css               # Tailwind imports and global styles
```

## Running Locally

```bash
npm install
npm run dev
```

To build for production:

```bash
npm run build
```

To preview the production build:

```bash
npm run preview
```

## Storage

Stash uses browser local storage for persistence.

- No backend server.
- No account or authentication required.
- Data is stored per browser and does not sync across devices or browsers.
- All data survives page refreshes.
- Stored data includes only category IDs, names, creation timestamps, post IDs, post URLs, tweet IDs, and the category relationship to each post.
- Full X post content is never stored.

## Supported Links

Stash accepts public X post URLs from:

- `x.com`
- `twitter.com`

Accepted URL format: a status page such as `https://x.com/username/status/123456789`.

Unsupported links are rejected, including YouTube, Reddit, Instagram, other websites, X profiles, search pages, lists, home pages, and non-post pages.

## Current Scope

Stash is a focused MVP for organizing public X posts into categories. The current version does not include:

- Search
- Notes or tags on posts
- Authentication or user accounts
- Cross-device sync or cloud storage
- Mobile-specific interface or mobile optimization
- Importing existing X bookmarks
- Category drag-and-drop or reordering
- Post reordering
- Undo or trash for deleted items

## Design Principles

Stash is built as a focused desktop utility, not a social network. The interface prioritizes clean layout, strong spacing, clear hierarchy, and minimal visual noise. The entire experience lives on one page where all categories and their posts are visible at once. Saved X post cards maintain a consistent width of `max-width: 340px` with naturally varying heights based on the X embed.

## License

MIT License.
