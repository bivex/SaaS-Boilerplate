import { setRequestLocale } from 'next-intl/server';
import { Hero } from '@/components/ui/animated-hero';

function HeroDemo() {
  return (
    <div className="block">
      <Hero />
    </div>
  );
}

export default async function AnimatedHeroDemoPage(props: { params: Promise<{ locale: string }> }) {
  const params = await props.params;
  setRequestLocale(params.locale);

  return (
    <div className="min-h-screen">
      <HeroDemo />
    </div>
  );
}
