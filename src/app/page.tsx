import { Hero }            from '@/components/sections/Hero';
import { ManifestSection }  from '@/components/sections/ManifestSection';
import { StatsSection }     from '@/components/sections/StatsSection';
import { PathsSection }     from '@/components/sections/PathsSection';
import { CourseShowcase }   from '@/components/sections/CourseShowcase';
import { VoicesSection }    from '@/components/sections/VoicesSection';
import { InitiationSection } from '@/components/sections/InitiationSection';
import { InvocationSection } from '@/components/sections/InvocationSection';
import { Navbar }           from '@/components/layout/Navbar';
import { Footer }           from '@/components/layout/Footer';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <StatsSection />
        <ManifestSection />
        <PathsSection />
        <CourseShowcase />
        <VoicesSection />
        <InitiationSection />
        <InvocationSection />
      </main>
      <Footer />
    </>
  );
}

