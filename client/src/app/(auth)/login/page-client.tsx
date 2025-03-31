"use client";

import Link from "next/link";
import { GoogleButton } from "~/features/auth/ui";

import { Wordmark } from "~/components/shared";

export default function LoginPageClient() {
  return (
    <section className="flex min-h-screen px-4 py-16 dark:bg-transparent md:py-32">
      <form
        action=""
        className="m-auto h-fit w-full max-w-sm overflow-hidden rounded-[calc(var(--radius)+.125rem)] border bg-muted shadow-md shadow-zinc-950/5 dark:[--color-muted:var(--color-zinc-900)]"
      >
        <div className="-m-px rounded-[calc(var(--radius)+.125rem)] border bg-card p-8 pb-6">
          <div className="text-center">
            <Link href="/" aria-label="go home" className="mx-auto block w-fit">
              <Wordmark />
            </Link>
            <h1 className="text-title mb-1 mt-4 text-xl font-semibold">
              Get started with Lew
            </h1>
          </div>

          <div className="mt-6 space-y-6">
            <p className="text-center text-xs">
              Sign-up with Email will coming soon.
            </p>
          </div>

          <div className="my-6 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
            <hr className="border-dashed" />
            <span className="text-xs text-muted-foreground">
              Or continue With
            </span>
            <hr className="border-dashed" />
          </div>

          <GoogleButton />
        </div>

        <div className="p-3">
          <p className="text-center text-xs text-accent-foreground">
            Don&apos;t have an account ?
            <Link href="/register" className="px-2 text-xs underline">
              <span>Create account</span>
            </Link>
          </p>
        </div>
      </form>
    </section>
  );
}
