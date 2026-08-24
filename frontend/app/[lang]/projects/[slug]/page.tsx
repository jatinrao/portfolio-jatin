import { notFound } from "next/navigation";
import { sanityFetch } from "@/sanity/lib/live";
import { client } from "@/sanity/lib/client";
import { PROJECT_BY_SLUG_QUERY, projectSlugs } from "@/sanity/lib/queries";
import type { Project } from "@/sanity.types";
import { fetchPortfolioData } from "@/lib/queries";
import type { HeroRawData } from "@/lib/queries";
import { LangId, localize } from "@/lib/locale";
import { getChannelKind } from "@/lib/channel-kind";
import { LanguageProvider } from "@/components/organisms/LanguageContext";
import { Header, type HeaderData } from "@/components/organisms/Header";
import { Footer } from "@/components/organisms/Footer";
import { FloatingControls } from "@/components/shared/FloatingControls";
import ProjectDetail from "@/components/templates/ProjectDetail";

export async function generateStaticParams() {
  // Plain client.fetch here, not the draft-mode-aware sanityFetch — the
  // latter calls draftMode(), which isn't available in this build-time-only
  // context (no HTTP request to read cookies from).
  const slugs = await client.fetch<{ slug: string }[]>(projectSlugs);
  return (slugs ?? []).map((project) => ({ slug: project.slug }));
}

interface ProjectPageProps {
  params: Promise<{ lang: string; slug: string }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { lang, slug } = await params;
  const locale = lang as LangId;

  const [{ data: project }, portfolio] = await Promise.all([
    sanityFetch({ query: PROJECT_BY_SLUG_QUERY, params: { slug } }),
    fetchPortfolioData("jatin-kumar"),
  ]);

  if (!project) {
    notFound();
  }

  const uiLabels = (portfolio?.data as any)?.uiLabels;

  return (
    <LanguageProvider lang={locale}>
      <Header data={portfolio?.data?.header as HeaderData | null} locale={locale} />
      <main>
        <ProjectDetail project={project as unknown as Project} locale={locale} />
      </main>
      <Footer
        brandName={localize(portfolio?.data?.hero_section?.name, locale)}
        tagline={localize(portfolio?.data?.hero_section?.headline, locale)}
        locale={locale}
        exploreLabel={localize(uiLabels?.footerExplore, locale) || undefined}
        connectLabel={localize(uiLabels?.footerConnect, locale) || undefined}
        navItems={(portfolio?.data?.header?.navItems ?? []).map(
          (item: NonNullable<HeaderData["navItems"]>[number]) => ({
            anchorId: item.anchorId,
            label: localize(item.label, locale),
          }),
        )}
        socialLinks={(portfolio?.data?.hero_section?.channels ?? [])
          .filter((channel: NonNullable<HeroRawData["channels"]>[number]) => {
            const kind = getChannelKind(channel);
            return Boolean(channel.url) && kind !== "phone";
          })
          .map((channel: NonNullable<HeroRawData["channels"]>[number]) => {
            const kind = getChannelKind(channel);
            const uiLabelOverride =
              kind === "linkedin"
                ? localize(uiLabels?.linkedin, locale)
                : kind === "mail"
                  ? localize(uiLabels?.mail, locale)
                  : "";
            return {
              label: uiLabelOverride || localize(channel.label, locale) || channel.url,
              href: channel.url,
            };
          })}
      />
      <FloatingControls resumeSlug="jatin-kumar" />
    </LanguageProvider>
  );
}
