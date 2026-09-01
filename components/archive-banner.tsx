import Link from "next/link";

interface ArchiveBannerProps {
  title?: string;
  description?: string;
  ctaHref?: string;
  ctaLabel?: string;
}

export function ArchiveBanner({
  title = "Archived investigation",
  description = "This page is kept for historical reference. The site now focuses on OpenRouter model comparison and selection.",
  ctaHref = "/comparison",
  ctaLabel = "Go to model comparison",
}: ArchiveBannerProps) {
  return (
    <div className="mb-8 rounded-lg border border-amber-500/30 bg-amber-500/10 p-4">
      <p className="text-sm font-semibold text-amber-300">{title}</p>
      <p className="mt-1 text-sm text-amber-200/80">{description}</p>
      <Link
        href={ctaHref}
        className="mt-3 inline-block text-sm font-medium text-amber-300 underline decoration-amber-500/50 hover:text-amber-200"
      >
        {ctaLabel}
      </Link>
    </div>
  );
}
