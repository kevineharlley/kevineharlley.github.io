"use client";

import { useState } from "react";
import { Navbar } from "@/components/sections/Navbar";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Education } from "@/components/sections/Education";
import { Skills } from "@/components/sections/SkillSection";
import { CoreCompetencies } from "@/components/sections/CoreCompetencies";
import { WorkExperience } from "@/components/sections/WorkExperience";
import { Portfolio } from "@/components/sections/Portfolio";
import { Leadership } from "@/components/sections/Leadership";
import { Contact } from "@/components/sections/Contact";
import { ProfileModals } from "@/components/sections/ProfileModals";
import { TraceRule } from "@/components/ui/TraceRule";
import { Reveal } from "@/components/ui/Reveal";
import type { ModalId } from "@/data";
import { useActiveSectionObserver } from "@/hooks/useActiveSectionObserver";

const SECTIONS = ["About", "Competencies", "Skills", "Experience", "Portfolio", "Education", "Leadership", "Contact"];

export default function Home() {
  const [activeModal, setActiveModal] = useState<ModalId | null>(null);
  const close = () => setActiveModal(null);
  const activeSection = useActiveSectionObserver(SECTIONS);

  return (
    <>
      <Navbar activeSection={activeSection} />
      <Hero />
      <TraceRule />
      <Reveal><About /></Reveal>
      <TraceRule />
      <Reveal><CoreCompetencies onSelectModal={setActiveModal} /></Reveal>
      <TraceRule />
      <Reveal><Skills /></Reveal>
      <TraceRule />
      <Reveal><WorkExperience  /></Reveal>
      <TraceRule />
      <Reveal><Portfolio onSelectModal={setActiveModal} /></Reveal>
      <TraceRule />
      <Reveal><Education /></Reveal>
      <TraceRule />
      <Reveal><Leadership onSelectModal={setActiveModal} /></Reveal>
      <TraceRule />
      <Reveal><Contact /></Reveal>
      <ProfileModals activeModal={activeModal} onClose={close} />
    </>
  );
}


