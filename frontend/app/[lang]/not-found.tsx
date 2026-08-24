import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="font-label-caps text-label-sm text-primary">404</p>
      <h1 className="font-headline-lg text-2xl tight-heading md:text-3xl">
        We couldn&apos;t find that page.
      </h1>
      <Link href="/" className="font-label-caps text-label-sm text-primary underline">
        Back to home
      </Link>
    </div>
  );
}
