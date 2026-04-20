# SDA Resources App

A comprehensive Seventh-day Adventist resource application built with React, TypeScript, and Tailwind CSS. This application provides access to Bible texts, hymns, scripture songs, devotional books, Ellen G. White writings, and audio resources.

## Features

- **Bible** - Read and study the Bible
- **Hymns** - Access the SDA Hymnal
- **Scripture Songs** - Browse and listen to scripture-based songs
- **Devotional Books** - Read devotional materials
- **Ellen G. White Books** - Access EGW writings
- **Audio Resources** - Listen to Bible and EGW audio books
- **Responsive Design** - Works on desktop and mobile devices
- **Dark/Light Theme** - Built-in theme support

## Tech Stack

- **Frontend Framework:** React 18.3.1
- **Language:** TypeScript 5.8.3
- **Build Tool:** Vite 5.4.19
- **Styling:** Tailwind CSS 3.4.17
- **UI Components:** Radix UI, shadcn/ui
- **Routing:** React Router 6.30.1
- **State Management:** TanStack Query (React Query) 5.83.0
- **Forms:** React Hook Form 7.61.1 with Zod validation
- **Database:** Supabase
- **Testing:** Vitest 3.2.4

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- npm, yarn, pnpm, or bun package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd <project-directory>
```

2. Install dependencies:
```bash
npm install
# or
bun install
```

3. Set up environment variables:
Create a `.env` file in the root directory with your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server:
```bash
npm run dev
# or
bun run dev
```

5. Open your browser and navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development mode
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode

## Project Structure

```
src/
├── components/     # Reusable UI components
├── hooks/          # Custom React hooks
├── lib/            # Utility functions and configurations
├── pages/          # Page components
│   ├── Index.tsx
│   ├── BiblePage.tsx
│   ├── HymnsPage.tsx
│   ├── ScriptureSongsPage.tsx
│   ├── DevotionalBooksPage.tsx
│   ├── EgwBooksPage.tsx
│   ├── ListenPage.tsx
│   ├── AboutPage.tsx
│   ├── ContactPage.tsx
│   ├── DonationPage.tsx
│   ├── PrivacyPolicyPage.tsx
│   ├── TermsOfUsePage.tsx
│   └── NotFound.tsx
├── integrations/   # Third-party integrations
├── App.tsx         # Main application component
├── main.tsx        # Application entry point
└── index.css       # Global styles
```

## Routes

- `/` - Home page
- `/bible` - Bible reading
- `/hymns` - Hymnal
- `/songs` - Scripture songs
- `/devotionals` - Devotional books
- `/egw` - Ellen G. White books
- `/listen/bible` - Audio Bible
- `/listen/egw` - Audio EGW books
- `/about` - About page
- `/contact` - Contact page
- `/donation` - Donation page
- `/privacy-policy` - Privacy policy
- `/terms-of-use` - Terms of use

## Configuration

### Tailwind CSS
Customize the design in `tailwind.config.ts`

### TypeScript
TypeScript configuration is split across multiple files:
- `tsconfig.json` - Base configuration
- `tsconfig.app.json` - Application specific config
- `tsconfig.node.json` - Node specific config

### ESLint
Configuration in `eslint.config.js`

## Testing

Run tests with:
```bash
npm run test
```

Watch mode for development:
```bash
npm run test:watch
```

## Deployment

Build the production bundle:
```bash
npm run build
```

The built files will be in the `dist/` directory, ready to be deployed to your hosting provider.

## License

This project is private and proprietary.

## Contributing

This is a private project. For questions or issues, please contact the maintainers.

---

Built with ❤️ using [Lovable](https://lovable.dev)
