import { SectionHeading } from "@/components/ui/SectionHeading";
import { Accent } from "@/lib/accent";
import { ReactNode } from "react";

type PageSectionProps = {
  id: string;
  title: string;
  accent: Accent;
  className?: string;
  children: ReactNode;
};

export function PageSection({ id, title, accent, className, children }: PageSectionProps) {
  return (
    <section id={id} className={`py-16 sm:py-24 ${className}`}>
      <div className="container mx-auto px-2 sm:px-8">
        <SectionHeading title={title} accent={accent} />
        {children}
      </div>
    </section>
  );
}
