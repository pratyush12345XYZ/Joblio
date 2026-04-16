# Joblio ✨

**A premium job & internship application tracker** — built with React + Vite.

Track your career journey with style. Manage applications, visualize your pipeline, and stay organized.

## Features

- 🔐 Simple username login (no auth needed)
- 📊 Dashboard with stats, search, filter, and sort
- ➕ Add/Edit/Delete applications with full details
- 🎯 Status pipeline board (Applied → Interview → Rounds → Selected → Rejected)
- 🌙 Dark & Light mode with persistence
- 📱 Mobile-first responsive design
- 💎 Glassmorphism UI with smooth animations
- 📁 Export to CSV
- 💾 All data persisted in localStorage

## Tech Stack

- **React 19** + **Vite 6**
- **Framer Motion** — animations
- **React Router v7** — routing
- **Lucide React** — icons
- **react-datepicker** — calendar inputs
- **Vanilla CSS** — custom design system

## Getting Started

### Prerequisites

- **Node.js** 18+ installed
- **npm** 9+ installed

### Run Locally

```bash
# Clone the repo
git clone <your-repo-url>
cd Joblio

# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

## Deployment

### Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → "New Project"
3. Import your GitHub repository
4. Vercel auto-detects Vite — click **Deploy**
5. Done! Your app is live 🚀

### Netlify

1. Push your code to GitHub
2. Go to [netlify.com](https://app.netlify.com) → "New site from Git"
3. Select your repository
4. Build command: `npm run build`
5. Publish directory: `dist`
6. Click **Deploy** 🚀

## License

MIT
