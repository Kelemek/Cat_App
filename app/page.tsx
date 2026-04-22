import Link from "next/link";
import { SiteShell } from "@/components/site-shell";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function HomePage() {
  return (
    <SiteShell>
      <div className="space-y-10">
        <div className="max-w-2xl space-y-3">
          <p className="text-sm font-medium uppercase tracking-wide text-primary">
            For ragdolls and the people who love them
          </p>
          <h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            A gentle diary for photos, memories, and health notes
          </h1>
          <p className="text-lg text-muted-foreground">
            Keep the everyday moments and the worrisome ones in one private
            place—dated photos beside written memories, plus a structured log
            when something seems off.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/diary"
              className={cn(buttonVariants({ variant: "default" }))}
            >
              Open album
            </Link>
            <Link
              href="/symptoms"
              className={cn(buttonVariants({ variant: "outline" }))}
            >
              Symptom journal
            </Link>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Photo &amp; memory album</CardTitle>
              <CardDescription>
                Choose a date, write what you remember, and upload photos tied to
                that day.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Symptom journal</CardTitle>
              <CardDescription>
                Log timing, severity, tags, medications, and free-form notes for
                vet visits or patterns.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </SiteShell>
  );
}
