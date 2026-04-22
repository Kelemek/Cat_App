import { SiteHeader } from "@/components/site-header";
import { STICKER_PLACEMENT_PLANE_ID } from "@/lib/stickers/user-storage";

type SiteShellProps = {
  children: React.ReactNode;
  variant?: "default" | "album";
};

export function SiteShell({ children, variant = "default" }: SiteShellProps) {
  if (variant === "album") {
    return (
      <div className="diary-album flex min-h-full flex-col">
        <SiteHeader variant="album" />
        <div className="relative min-h-0 flex-1 bg-muted/50">
          <div
            id={STICKER_PLACEMENT_PLANE_ID}
            className="relative mx-auto w-full max-w-6xl px-6 py-8"
          >
            {children}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <SiteHeader />
      <div
        id={STICKER_PLACEMENT_PLANE_ID}
        className="relative mx-auto w-full max-w-5xl flex-1 px-4 py-10"
      >
        {children}
      </div>
    </>
  );
}
