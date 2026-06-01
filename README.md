# Flipper

A movie-browsing app with a vertical, full-screen teaser scroller. Browse
popular films, search the catalog, and open detail pages with similar
recommendations. Powered by the [TMDB](https://www.themoviedb.org/) API.

## Stack

- [React](https://react.dev/) + [Vite](https://vite.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TMDB API](https://developer.themoviedb.org/docs) via `axios`

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file (see `.env.example`) with your TMDB read access token:

   ```
   VITE_TMDB_API_KEY=your_tmdb_read_access_token_here
   ```

   You can generate one in your [TMDB API settings](https://www.themoviedb.org/settings/api).

3. Start the dev server:

   ```bash
   npm run dev
   ```

## Scripts

| Command           | Description                              |
| ----------------- | ---------------------------------------- |
| `npm run dev`     | Start the Vite dev server                |
| `npm run build`   | Build for production into `dist/`        |
| `npm run preview` | Preview the production build locally     |
| `npm run lint`    | Run ESLint                               |
| `npm run deploy`  | Publish `dist/` to GitHub Pages          |
