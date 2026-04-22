import { LoginForm } from "@/app/login/login-form";
import { StickerToggleButton } from "@/components/stickers/sticker-toggle-button";
import { STICKER_PLACEMENT_PLANE_ID } from "@/lib/stickers/user-storage";

export default function LoginPage() {
  return (
    <div
      id={STICKER_PLACEMENT_PLANE_ID}
      className="relative flex min-h-full flex-col items-center justify-center bg-background px-4 py-16"
    >
      <div className="absolute right-4 top-4 z-20 sm:right-6 sm:top-6">
        <StickerToggleButton album />
      </div>
      <p className="mb-6 text-center text-sm text-muted-foreground max-w-md">
        A quiet corner for ragdoll photos, memories, and health notes.
      </p>
      <LoginForm />
    </div>
  );
}
