import Hero from '@/components/Hero';
import About from '@/components/About';
import Skills from '@/components/Skills';
import Projects from '@/components/Projects';
import GitHubStats from '@/components/GitHubStats';
import Contact from '@/components/Contact';
import SectionTransition from '@/components/SectionTransition';
import { Analytics } from '@vercel/analytics/next';

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <div id="hero">
        <Hero />
      </div>

      {/* About Section */}
      <div id="about">
        <SectionTransition type="fade">
          <About />
        </SectionTransition>
      </div>

      {/* Skills Section */}
      <div id="skills">
        <SectionTransition type="fade" delay={0.1}>
          <Skills />
        </SectionTransition>
      </div>

      {/* Projects Section */}
      <div id="projects">
        <SectionTransition type="wipe" delay={0.2}>
          <Projects />
        </SectionTransition>
      </div>

      {/* GitHub Stats Section */}
      <div id="github">
        <SectionTransition type="fade" delay={0.1}>
          <GitHubStats />
        </SectionTransition>
      </div>

      {/* Contact Section */}
      <div id="contact">
        <SectionTransition type="fade">
          <Contact />
        </SectionTransition>
      </div>
    </>
  );
}
