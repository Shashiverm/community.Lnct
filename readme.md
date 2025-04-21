# Community Platform

A modern, full-stack community platform built with Next.js, Express, and MongoDB. This application provides a robust foundation for building online communities with features like user authentication, content management, and real-time interactions.

## 🚀 Features

- **Modern Tech Stack**
  - Next.js 15 with App Router for server-side rendering and API routes
  - Express.js backend for robust API handling
  - MongoDB with Mongoose for flexible data modeling
  - TypeScript for enhanced type safety and developer experience
  - Tailwind CSS for utility-first styling
  - Radix UI for accessible and customizable components
  - Zod for runtime type validation
  - NextAuth.js for authentication
  - Socket.io for real-time features

- **Authentication & Security**
  - JWT-based authentication with refresh tokens
  - Secure password hashing with bcrypt
  - Protected routes and API endpoints
  - Environment variable configuration
  - CSRF protection
  - Rate limiting
  - Input sanitization

- **User Experience**
  - Responsive design for all devices
  - Dark/Light mode support with system preference detection
  - Modern UI components with animations
  - Form validation with Zod
  - Toast notifications for user feedback
  - Loading states and error handling
  - Optimized performance with image optimization
  - SEO-friendly pages

- **Content Management**
  - Rich text editor support
  - Image upload and optimization
  - Content moderation tools
  - Search functionality
  - Categories and tags
  - User-generated content management

## 🛠️ Prerequisites

- Node.js (v18 or higher)
- MongoDB (v6.0 or higher)
- pnpm (v8.0 or higher) or npm (v9.0 or higher)
- Git for version control
- Modern web browser (Chrome, Firefox, Safari, Edge)

## 📦 Installation

1. Clone the repository:
```bash
git clone [your-repository-url]
cd community
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```
Fill in the required environment variables in `.env.local`:
```env
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
NODE_ENV=development
```

4. Start the development server:
```bash
pnpm dev
```

## 🔧 Available Scripts

- `pnpm dev` - Start the development server with hot reloading
- `pnpm build` - Build the application for production
- `pnpm start` - Start the production server
- `pnpm lint` - Run ESLint for code quality
- `pnpm test` - Run test suite
- `pnpm type-check` - Run TypeScript type checking
- `pnpm format` - Format code with Prettier

## 📁 Project Structure

```
community/
├── app/                 # Next.js app directory
│   ├── api/            # API routes
│   ├── (auth)/         # Authentication pages
│   └── (main)/         # Main application pages
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components
│   └── features/       # Feature-specific components
├── controllers/         # Express route controllers
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── middleware/         # Express middleware
├── models/             # MongoDB models
├── public/             # Static assets
├── routes/             # Express routes
├── styles/             # Global styles
├── types/              # TypeScript type definitions
└── utils/              # Helper functions
```

## 🔐 Environment Variables

Required environment variables:

```env
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
NODE_ENV=development
```

Optional environment variables:

```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure your PR includes:
- Clear description of changes
- Updated documentation if needed
- Passing tests
- Follows the project's code style

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- Shashi Verma - Initial work

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Vercel for hosting and deployment
- All contributors and maintainers
- Open source community for inspiration and tools
