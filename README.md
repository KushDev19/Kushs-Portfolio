# Kush's Portfolio

A modern, cinematic portfolio for Kush Rank, ML Engineer, built with Next.js 14, featuring smooth animations and scroll effects.

## Tech Stack

- **Next.js 14** - App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **GSAP** - Professional animations
- **Lenis** - Smooth scroll library
- **Next Font** - Optimized font loading

## Color Palette

```js
deepBlue: '#0a192f'    // Primary background
cyan: '#64ffda'        // Accent color
orange: '#ff6b35'      // Secondary accent
slate: '#8892b0'       // Text color
almostBlack: '#020c1b' // Dark backgrounds
```

## Typography

- **Body**: Inter (via next/font/google)
- **Headings**: Space Grotesk (via next/font/google)

## Project Structure

```
kushs-portfolio/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with fonts
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── SmoothScroll.tsx  # Lenis smooth scroll integration
│   └── CustomCursor.tsx  # Custom animated cursor
├── lib/                   # Utility functions
├── public/
│   └── assets/           # Static assets
├── styles/               # Additional styles
└── tailwind.config.ts    # Tailwind configuration
```

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/kushs-portfolio.git
cd kushs-portfolio
```

2. Install dependencies (already done):
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Custom Tailwind Classes

### Gradient Text
```jsx
<h1 className="text-gradient">Gradient Text</h1>
```

### Section Padding
```jsx
<section className="section-padding">Content</section>
```

## Features

✅ **Lenis Smooth Scroll** - Integrated with GSAP ScrollTrigger for buttery smooth scrolling
✅ **Custom Animated Cursor** - Glowing cyan cursor with hover effects
✅ **Custom Color Palette** - Carefully selected colors for a cinematic feel
✅ **Google Fonts** - Inter and Space Grotesk optimized with next/font

## Next Steps

1. **Build Components**
   - Hero section with animated text
   - Project showcase with scroll effects
   - About section with reveal animations
   - Contact form

2. **Add Content**
   - ML projects and case studies
   - Skills and expertise section
   - Work experience timeline

3. **Optimize Performance**
   - Lazy load images
   - Code splitting
   - SEO optimization

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Font Usage

The fonts are already configured and available via CSS variables:

```jsx
// Body text (default)
<p className="font-sans">This uses Inter</p>

// Headings
<h1 className="font-heading">This uses Space Grotesk</h1>
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [GSAP Documentation](https://greensock.com/docs/)
- [Lenis Smooth Scroll](https://lenis.studiofreight.com/)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
