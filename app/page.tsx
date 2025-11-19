export default function Home() {
  return (
    <main className="min-h-screen section-padding">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold mb-6">
          Kush Rank
        </h1>
        <h2 className="text-2xl md:text-3xl mb-8 text-gradient">
          ML Engineer | Data Science Enthusiast
        </h2>
        <p className="text-lg md:text-xl max-w-3xl leading-relaxed">
          Specializing in real-world data projects and end-to-end machine learning
          pipelines. This portfolio is built with Next.js 14, Tailwind CSS, GSAP,
          and Lenis smooth scroll for a cinematic experience.
        </p>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 border border-cyan/20 rounded-lg bg-almostBlack/50 hover:border-cyan/40 transition-colors">
            <h3 className="text-xl font-bold mb-2">GSAP Animations</h3>
            <p className="text-slate/80">
              Professional-grade animations with GSAP and ScrollTrigger
            </p>
          </div>

          <div className="p-6 border border-orange/20 rounded-lg bg-almostBlack/50 hover:border-orange/40 transition-colors">
            <h3 className="text-xl font-bold mb-2 text-orange">Smooth Scroll</h3>
            <p className="text-slate/80">
              Buttery smooth scrolling powered by Lenis
            </p>
          </div>

          <div className="p-6 border border-cyan/20 rounded-lg bg-almostBlack/50 hover:border-cyan/40 transition-colors">
            <h3 className="text-xl font-bold mb-2">Modern Stack</h3>
            <p className="text-slate/80">
              Built with Next.js 14 App Router and Tailwind CSS
            </p>
          </div>
        </div>

        <div className="mt-16 p-8 border border-slate/20 rounded-lg bg-almostBlack/30">
          <h3 className="text-2xl font-bold mb-4">Color Palette</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div>
              <div className="w-full h-20 bg-deepBlue rounded-lg mb-2 border border-slate/20"></div>
              <p className="text-sm">Deep Blue</p>
            </div>
            <div>
              <div className="w-full h-20 bg-cyan rounded-lg mb-2"></div>
              <p className="text-sm">Cyan</p>
            </div>
            <div>
              <div className="w-full h-20 bg-orange rounded-lg mb-2"></div>
              <p className="text-sm">Orange</p>
            </div>
            <div>
              <div className="w-full h-20 bg-slate rounded-lg mb-2"></div>
              <p className="text-sm">Slate</p>
            </div>
            <div>
              <div className="w-full h-20 bg-almostBlack rounded-lg mb-2 border border-slate/20"></div>
              <p className="text-sm">Almost Black</p>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <h3 className="text-2xl font-bold mb-4">Typography</h3>
          <p className="text-lg mb-4">
            <span className="font-sans">Body text uses Inter font</span>
          </p>
          <p className="text-lg">
            <span className="font-heading">Headings use Space Grotesk font</span>
          </p>
        </div>
      </div>
    </main>
  );
}
