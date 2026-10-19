import ScrollReveal from '@/core/widgets/ScrollReveal';

interface SectionHeadingProps {
  eyebrow: string;
  title: React.ReactNode;
  subtitle?: string;
  action?: React.ReactNode;
  center?: boolean;
}

export default function SectionHeading({ eyebrow, title, subtitle, action, center }: SectionHeadingProps) {
  return (
    <ScrollReveal
      className={`mb-10 lg:mb-14 flex flex-col gap-4 ${
        center ? 'items-center text-center' : 'lg:flex-row lg:items-end lg:justify-between'
      }`}
    >
      <div className={center ? 'max-w-2xl' : 'max-w-2xl'}>
        <p className="text-gold-dark text-sm font-bold uppercase tracking-[0.2em] mb-3">{eyebrow}</p>
        <h2 className="font-display font-light text-fg text-[clamp(2rem,4vw,3rem)] leading-tight">
          {title}
        </h2>
        {subtitle && <p className="text-ash-light mt-4 leading-relaxed">{subtitle}</p>}
      </div>
      {action}
    </ScrollReveal>
  );
}
