# Nike E-commerce Store

A modern e-commerce application built with Next.js, TypeScript, Tailwind CSS, Better Auth, Neon PostgreSQL, Drizzle ORM, and Zustand.

## Features

- 🛍️ Product catalog with Nike items
- 🎨 Modern UI with Tailwind CSS
- 🔐 Authentication with Better Auth
- 🗄️ PostgreSQL database with Neon
- 🔄 Type-safe database operations with Drizzle ORM
- 🏪 State management with Zustand
- 📱 Responsive design
- ⚡ Built with Next.js 15 and TypeScript

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Neon PostgreSQL
- **ORM**: Drizzle ORM
- **Authentication**: Better Auth
- **State Management**: Zustand
- **Deployment**: Vercel (recommended)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Neon PostgreSQL database

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd nike-ecommerce
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your actual values:
   - `DATABASE_URL`: Your Neon PostgreSQL connection string
   - `BETTER_AUTH_SECRET`: A secure secret key for authentication

4. Set up the database:
   ```bash
   # Generate database schema
   npm run db:generate
   
   # Push schema to database
   npm run db:push
   
   # Seed with sample Nike products
   npm run db:seed
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

The application includes a `products` table with the following fields:
- `id`: Primary key
- `name`: Product name
- `description`: Product description
- `price`: Product price (decimal)
- `image`: Product image URL
- `category`: Product category
- `brand`: Product brand (defaults to "Nike")
- `size`: Product size
- `color`: Product color
- `stock`: Available stock quantity
- `createdAt`: Creation timestamp
- `updatedAt`: Update timestamp

## Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run lint`: Run ESLint
- `npm run db:generate`: Generate Drizzle schema
- `npm run db:push`: Push schema to database
- `npm run db:seed`: Seed database with sample data

## Project Structure

```
src/
├── app/                 # Next.js app router
│   ├── api/            # API routes
│   ├── globals.css     # Global styles
│   └── page.tsx        # Homepage
├── components/         # React components
├── lib/               # Utilities and configurations
│   ├── auth/          # Better Auth configuration
│   └── db/            # Database configuration and schema
└── store/             # Zustand stores
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.