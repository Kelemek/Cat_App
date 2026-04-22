import Link from "next/link";
import type { DiaryPhotoWithUrl } from "@/lib/data/diary";

type Props = {
  photos: DiaryPhotoWithUrl[];
  selectedDate: string;
};

export function DiaryMonthGrid({ photos, selectedDate }: Props) {
  if (photos.length === 0) {
    return (
      <p className="px-2 py-8 text-center text-sm text-muted-foreground">
        No photos this month yet. Add some for{" "}
        <span className="font-medium text-foreground">{selectedDate}</span> below.
      </p>
    );
  }

  return (
    <div
      id="album-grid"
      className="grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-border bg-card p-px sm:grid-cols-4 md:grid-cols-5"
    >
      {photos.map((p) => {
        const active = p.diary_date === selectedDate;
        return (
          <Link
            key={p.id}
            href={`/diary?date=${p.diary_date}#day-tools`}
            className={`relative aspect-square overflow-hidden bg-muted outline-none ring-inset focus-visible:ring-2 focus-visible:ring-primary ${
              active ? "ring-2 ring-primary ring-inset" : ""
            }`}
          >
            {p.signedUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={p.signedUrl}
                alt="Album photo"
                className="size-full object-cover"
              />
            ) : (
              <span className="flex size-full items-center justify-center text-[10px] text-muted-foreground">
                …
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );
}
