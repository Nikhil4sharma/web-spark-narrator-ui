# 🌟 WebStory Hub - React + TypeScript + Supabase

A modern, responsive web application for creating, managing, and sharing stories with a beautiful admin panel.

## 🚀 Features

### Public Features
- **Story Display**: Beautiful story cards with cover images
- **Category Filtering**: Browse stories by categories
- **Search Functionality**: Find stories by title or content
- **Responsive Design**: Mobile-friendly interface
- **Reading Time**: Estimated reading time for each story

### Admin Panel
- **Dashboard**: Analytics and overview
- **Story Management**: Create, edit, delete stories
- **Category Management**: Manage story categories
- **User Authentication**: Secure admin login
- **Real-time Updates**: Live data synchronization

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI Framework**: shadcn/ui + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Real-time)
- **State Management**: React Query (TanStack Query)
- **Styling**: Tailwind CSS + CSS Modules
- **Icons**: Lucide React

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### Setup Steps

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd web-spark-narrator-ui
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
Create `.env` file in root directory:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Database Setup**
- Go to Supabase Dashboard
- Run `supabase-setup.sql` in SQL Editor
- Create admin user: `nikhil@webstory.in` / `Nikhil@1305`

5. **Start Development Server**
```bash
npm run dev
```

## 🌐 URLs

- **Public Site**: http://localhost:8080
- **Admin Panel**: http://localhost:8080/admin
- **Admin Login**: nikhil@webstory.in / Nikhil@1305

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── admin-layout.tsx
│   └── theme-provider.tsx
├── hooks/              # Custom React hooks
│   ├── use-categories.ts
│   ├── use-dashboard.ts
│   └── use-stories.ts
├── lib/                # Utility functions
│   ├── api.ts          # API service
│   ├── supabase.ts     # Supabase client
│   └── utils.ts        # Helper functions
├── pages/              # Page components
│   ├── Index.tsx       # Home page
│   ├── StoryPage.tsx   # Story detail page
│   ├── AdminLogin.tsx  # Admin login
│   ├── AdminDashboard.tsx
│   ├── StoryEditor.tsx
│   └── CategoryManagement.tsx
└── main.tsx           # App entry point
```

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Database Schema

**Tables:**
- `categories`: Story categories
- `stories`: Story content and metadata
- `users`: Admin users

**Key Features:**
- UUID primary keys
- Automatic timestamps
- Row Level Security (RLS)
- Real-time subscriptions

## 🔒 Security

- Environment variables excluded from Git
- Row Level Security enabled
- Admin authentication required
- Input validation and sanitization

## 🚀 Deployment

### Vercel (Recommended)
1. Connect GitHub repository
2. Set environment variables
3. Deploy automatically

### Netlify
1. Build command: `npm run build`
2. Publish directory: `dist`
3. Set environment variables

## 📝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## 📄 License

This project is licensed under the MIT License.

## 🤝 Support

For support and questions:
- Create an issue on GitHub
- Contact: nikhil@webstory.in

---

**Built with ❤️ using React, TypeScript, and Supabase**
