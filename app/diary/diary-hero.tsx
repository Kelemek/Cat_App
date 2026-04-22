import { monthShortName } from "@/lib/dates";
import type { DiaryPhotoWithUrl } from "@/lib/data/diary";

type Props = {
  year: number;
  month: number;
  heroPhoto: DiaryPhotoWithUrl | null;
  subtitle: string | null;
};

export function DiaryHero({ year, month, heroPhoto, subtitle }: Props) {
  const monthLabel = monthShortName(month);

  return (
    <section className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 overflow-hidden bg-muted">
      <div className="relative aspect-[4/3] max-h-[min(72vh,520px)] w-full sm:aspect-[16/10] sm:max-h-[min(78vh,640px)]">
        {heroPhoto?.signedUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={heroPhoto.signedUrl}
            alt=""
            className="absolute inset-0 size-full object-cover"
          />
        ) : (
          <div
            className="absolute inset-0 bg-gradient-to-br from-rose-50 via-pink-50 to-amber-50/80"
            aria-hidden
          />
        )}
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent"
          aria-hidden
        />
        <div className="absolute inset-x-0 bottom-0 p-5 pb-6 text-white sm:p-8 sm:pb-8">
          <p className="font-heading text-3xl font-semibold leading-none tracking-tight sm:text-4xl">
            {monthLabel}
          </p>
          <p className="mt-1 text-lg font-normal text-white/90 sm:text-xl">
            {year}
          </p>
          {subtitle ? (
            <p className="mt-4 max-w-md text-base font-medium leading-snug text-white/95 sm:text-lg">
              {subtitle}
            </p>
          ) : (
            <p className="mt-4 max-w-md text-base text-white/85 sm:text-lg">
              Your ragdoll&apos;s moments
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
