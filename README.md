# Dupree Ops LLC — Business Website

Official business website for Dupree Ops, LLC. Built with Next.js, Tailwind CSS, and Supabase.

## Features

- **Services Page**: Showcase three core offerings with pricing and descriptions
- **Contact Form**: Accept inquiries with full validation and Supabase integration
- **Health Check**: `/api/health` endpoint for monitoring
- **Dark/Light Mode**: Theme toggle with persistent storage
- **Responsive Design**: Mobile, tablet, and desktop optimized
- **Analytics Tracking**: Page views and user interactions
- **WCAG Compliance**: Accessible forms and navigation

## Tech Stack

- **Framework**: Next.js 14
- **Styling**: Tailwind CSS 3.3
- **Database**: Supabase (PostgreSQL)
- **Language**: TypeScript
- **Hosting**: Vercel

## Setup

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account (or use existing project)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/IsaiahDupree/dupreeops-website.git
cd dupreeops-website
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
# Copy the example file
cp .env.example .env.local

# Edit .env.local with your Supabase credentials:
# NEXT_PUBLIC_SUPABASE_URL=your_url_here
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key_here
# SUPABASE_SERVICE_ROLE_KEY=your_service_key_here
```

4. Set up the database:
   - The migrations are automatically handled via Supabase
   - The `contact_submissions` table is created on deployment
   - RLS policies are configured for security

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (API only) | Yes |

**Note**: Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser. Never store sensitive secrets in these variables.

## Project Structure

```
.
├── pages/
│   ├── api/
│   │   ├── contact.ts       # Contact form API endpoint
│   │   └── health.ts        # Health check endpoint
│   ├── _app.tsx             # Next.js app wrapper
│   ├── index.tsx            # Homepage
│   ├── services.tsx         # Services listing page
│   ├── contact.tsx          # Contact page
│   └── [other pages]
├── components/
│   └── ContactForm.tsx      # Contact form with validation
├── lib/
│   ├── supabase.ts          # Supabase client config
│   ├── validation.ts        # Form validation logic
│   └── analytics.ts         # Analytics tracking
├── data/
│   └── services.ts          # Service offerings data
├── styles/
│   └── globals.css          # Global styles
├── public/                  # Static assets
└── vercel.json             # Vercel deployment config
```

## Available Pages

- `/` — Homepage with company information
- `/services` — Service offerings and pricing
- `/contact` — Contact form and contact information
- `/billing` — Billing and messaging policies
- `/terms` — Terms of service
- `/privacy` — Privacy policy
- `/sms` — SMS messaging policy

## API Endpoints

### Health Check
```
GET /api/health
```

Returns service health status:
```json
{
  "status": "healthy",
  "timestamp": "2024-04-18T21:00:00.000Z",
  "service": "dupreeops-website",
  "version": "1.0.0"
}
```

### Contact Form Submission
```
POST /api/contact
```

Request:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "I'd like to discuss your services..."
}
```

Response (success):
```json
{
  "success": true,
  "message": "Contact form submitted successfully",
  "id": "uuid"
}
```

Response (error):
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

## Building & Deployment

### Local Build
```bash
npm run build
npm run start
```

### Vercel Deployment

The project is configured for automatic deployment via Vercel:

1. Push to the main branch
2. Vercel automatically builds and deploys
3. Environment variables are configured in Vercel dashboard

Manual deployment:
```bash
npm install -g vercel
vercel --prod
```

## Form Validation

The contact form includes both client-side and server-side validation:

**Client-side**:
- Name: 2-100 characters
- Email: Valid email format
- Message: 10-5000 characters

**Server-side**: Same rules applied on API endpoint

Validation errors are returned with specific field messages for user guidance.

## Database Schema

### contact_submissions table

```sql
CREATE TABLE contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Row Level Security (RLS)**:
- Anonymous users can insert (for contact form)
- Authenticated users can view and delete
- Admin-only delete access recommended

## Performance

- Static site generation for pages (near-instant load times)
- Optimized images and assets
- Database indexes for fast queries
- CDN distribution via Vercel

## Monitoring

Health check endpoint (`/api/health`) can be monitored for uptime:
```bash
curl https://dupreeops.com/api/health
```

## Support & Issues

For support inquiries:
- **Email**: support@dupreeops.com
- **Business**: hello@dupreeops.com

## License

© 2026 Dupree Ops, LLC. All rights reserved.

## Contributing

This is a private project. External contributions are not accepted at this time.

---

**Built with care by Dupree Ops, LLC**

