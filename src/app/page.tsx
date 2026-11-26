import { Navbar } from "@/components/layout/navbar";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll-provider";
import { CinematicExperience } from "@/features/landing/cinematic-experience";
import { OpeningGate } from "@/features/landing/components/opening-gate";

export default function Home() {
  return (
    <>
      <OpeningGate />
      <SmoothScrollProvider>
        <Navbar />
        <main>
          <CinematicExperience />
        </main>
      </SmoothScrollProvider>
    </>
  );
}
