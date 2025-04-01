# Community Platform

A modern, full-stack community platform built with Next.js, Express, and MongoDB. This application provides a robust foundation for building online communities with features like user authentication, content management, and real-time interactions.

## 🚀 Features

- **Modern Tech Stack**
  - Next.js 15 with App Router
  - Express.js backend
  - MongoDB database
  - TypeScript for type safety
  - Tailwind CSS for styling
  - Radix UI components

- **Authentication & Security**
  - JWT-based authentication
  - Secure password hashing with bcrypt
  - Protected routes and API endpoints
  - Environment variable configuration

- **User Experience**
  - Responsive design
  - Dark/Light mode support
  - Modern UI components
  - Form validation with Zod
  - Toast notifications

## 🛠️ Prerequisites

- Node.js (v18 or higher)
- MongoDB
- pnpm (recommended) or npm

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
Fill in the required environment variables in `.env.local`

4. Start the development server:
```bash
pnpm dev
```

## 🔧 Available Scripts

- `pnpm dev` - Start the development server
- `pnpm build` - Build the application for production
- `pnpm start` - Start the production server
- `pnpm lint` - Run ESLint

## 📁 Project Structure

```
community/
├── app/                 # Next.js app directory
├── components/          # Reusable UI components
├── controllers/         # Express route controllers
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── middleware/         # Express middleware
├── models/             # MongoDB models
├── public/             # Static assets
├── routes/             # Express routes
├── styles/             # Global styles
└── utils/              # Helper functions
```

## 🔐 Environment Variables

Create a `.env.local` file with the following variables:

```env
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- Shashi Verma - Initial work

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Vercel for hosting and deployment
- All contributors and maintainers
