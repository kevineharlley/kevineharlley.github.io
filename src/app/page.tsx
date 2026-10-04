import { NavigationWrapper } from "@/components/ui/NavigationWrapper";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Education } from "@/components/sections/Education";
import { Skills } from "@/components/sections/SkillSection";
import { CoreCompetencies } from "@/components/sections/CoreCompetencies";
import { WorkExperience } from "@/components/sections/WorkExperience";
import { Portfolio } from "@/components/sections/Portfolio";
import { Leadership } from "@/components/sections/Leadership";
import { Contact } from "@/components/sections/Contact";
import { TraceRule } from "@/components/ui/TraceRule";
import { Reveal } from "@/components/ui/Reveal";

const SECTIONS = ["About", "Competencies", "Skills", "Experience", "Portfolio", "Education", "Leadership", "Contact"];

export default function Home() {
  return (
    <>
      <NavigationWrapper sections={SECTIONS} />
      <Hero />
      <TraceRule />
      <Reveal><About /></Reveal>
      <TraceRule />
      <Reveal><WorkExperience /></Reveal>
      <TraceRule />
      <Reveal><CoreCompetencies /></Reveal>
      <TraceRule />
      <Reveal><Skills /></Reveal>
      <TraceRule />
      <Reveal><Portfolio /></Reveal>
      <TraceRule />
      <Reveal><Education /></Reveal>
      <TraceRule />
      <Reveal><Leadership /></Reveal>
      <TraceRule />
      <Reveal><Contact /></Reveal>
    </>
  );
}
