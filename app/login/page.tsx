import { LoginForm } from "@/app/login/login-form";

export default function LoginPage() {
  return (
    <div className="relative flex min-h-full flex-col items-center justify-center bg-background px-4 py-16">
      <p className="mb-6 max-w-md text-center text-sm text-muted-foreground">
        A quiet corner for ragdoll photos, memories, and health notes.
      </p>
      <LoginForm />
    </div>
  );
}
