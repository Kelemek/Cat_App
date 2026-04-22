import Link from "next/link";
import { logoutAction } from "@/app/actions/auth";
import { StickerToggleButton } from "@/components/stickers/sticker-toggle-button";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SiteHeaderProps = {
  variant?: "default" | "album";
};

export function SiteHeader({ variant = "default" }: SiteHeaderProps) {
  const isAlbum = variant === "album";

  return (
    <header
      className={cn(
        "sticky top-0 z-30 shrink-0 border-b border-border/80 bg-card/85 backdrop-blur-md",
      )}
      data-sticker-place-ignore
    >
      <div
        className={cn(
          "mx-auto flex flex-wrap items-center justify-between gap-3 px-4 py-3",
          isAlbum ? "max-w-6xl px-6" : "max-w-5xl",
        )}
      >
        <Link
          href="/"
          className={cn(
            "font-heading text-lg font-semibold tracking-tight text-foreground",
          )}
        >
          {isAlbum ? (
            <>
              Ragdoll <span className="text-primary">album</span>
            </>
          ) : (
            "Ragdoll diary"
          )}
        </Link>
        <nav className="flex flex-wrap items-center gap-1 sm:gap-2">
          {isAlbum ? (
            <>
              <Link
                href="/"
                className="rounded-xl px-2.5 py-1.5 text-sm text-foreground transition-colors hover:bg-muted hover:text-primary"
              >
                Home
              </Link>
              <Link
                href="/diary"
                className="rounded-xl px-2.5 py-1.5 text-sm font-medium text-primary"
              >
                Album
              </Link>
              <Link
                href="/symptoms"
                className="rounded-xl px-2.5 py-1.5 text-sm text-foreground transition-colors hover:bg-muted hover:text-primary"
              >
                Health
              </Link>
              <StickerToggleButton album />
              <form action={logoutAction} className="ml-1">
                <Button type="submit" variant="outline" size="sm">
                  Sign out
                </Button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/"
                className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
              >
                Home
              </Link>
              <Link
                href="/diary"
                className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
              >
                Album
              </Link>
              <Link
                href="/symptoms"
                className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
              >
                Health
              </Link>
              <StickerToggleButton />
              <form action={logoutAction}>
                <Button type="submit" variant="outline" size="sm">
                  Sign out
                </Button>
              </form>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
