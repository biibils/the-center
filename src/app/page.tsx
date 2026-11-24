import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/features/landing/hero-section";
import { MissionSection } from "@/features/landing/mission-section";

export default function Home() {
  return (
    <>
      <Navbar />

      <main>
        <HeroSection />
        <MissionSection />
      </main>

      <Footer />
    </>
  );
}
