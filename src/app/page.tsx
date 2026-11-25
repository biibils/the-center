import { Navbar } from "@/components/layout/navbar";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll-provider";
import { CinematicExperience } from "@/features/landing/cinematic-experience";

export default function Home() {
  return (
    <SmoothScrollProvider>
      <Navbar />
      <main>
        <CinematicExperience />
      </main>
    </SmoothScrollProvider>
  );
}
