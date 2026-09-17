export function SectionHeading({ title }: { title: string }) {
  return (
    <div className="text-center mb-12">
      <h2 className="text-4xl md:text-5xl font-light glow-quaternary text-quaternary">
        {title}
      </h2>
    </div>
  );
}
