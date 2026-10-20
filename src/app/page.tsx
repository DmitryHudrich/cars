import { Header } from "@/components/sections/Header";
import { Hero } from "@/components/sections/Hero";
import { CatalogPreview } from "@/components/sections/CatalogPreview";
import { HowWeWork } from "@/components/sections/HowWeWork";
import { Promos } from "@/components/sections/Promos";
import { Geography } from "@/components/sections/Geography";
import { WhyUs } from "@/components/sections/WhyUs";
import { Reviews } from "@/components/sections/Reviews";
import { Partners } from "@/components/sections/Partners";
import { Faq } from "@/components/sections/Faq";
import { News } from "@/components/sections/News";
import { Contacts } from "@/components/sections/Contacts";
import { LeadSection } from "@/components/sections/LeadSection";
import { Footer } from "@/components/sections/Footer";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <CatalogPreview />
        <HowWeWork />
        <Promos />
        <Geography />
        <WhyUs />
        <Reviews />
        <Partners />
        <Faq />
        <News />
        <Contacts />
        <LeadSection />
      </main>
      <Footer />
      <ScrollReveal />
    </>
  );
}
