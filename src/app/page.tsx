"use client";

import { useState } from "react";
import { Navbar } from "@/components/sections/Navbar";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Skills } from "@/components/sections/Skills";
import { Portfolio } from "@/components/sections/Portfolio";
import { Experience } from "@/components/sections/Experience";
import { Contact } from "@/components/sections/Contact";
import { ProfileModals } from "@/components/sections/ProfileModals";
import { TraceRule } from "@/components/ui/TraceRule";

export default function Home() {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const close = () => setActiveModal(null);

  return (
    <>
      <Navbar />
      <Hero />
      <TraceRule />
      <About />
      <TraceRule />
      <Skills />
      <TraceRule />
      <Portfolio onSelectModal={setActiveModal} />
      <TraceRule />
      <Experience onSelectModal={setActiveModal} />
      <TraceRule />
      <Contact />
      <ProfileModals activeModal={activeModal} onClose={close} />
    </>
  );
}


