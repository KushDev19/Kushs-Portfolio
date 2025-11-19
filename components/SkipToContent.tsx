'use client';

export default function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:px-6 focus:py-3 focus:bg-cyan focus:text-almostBlack focus:font-mono focus:font-bold focus:rounded-lg focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-orange focus:ring-offset-2 focus:ring-offset-almostBlack"
    >
      Skip to main content
    </a>
  );
}
