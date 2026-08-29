import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { sanityFetch } from "@/sanity/lib/live";
import { client } from "@/sanity/lib/client";
import { BLOG_BY_SLUG_QUERY, blogSlugs } from "@/sanity/lib/queries";
import { fetchPortfolioData } from "@/lib/queries";
import type { HeroRawData } from "@/lib/queries";
import { LangId, localize } from "@/lib/locale";
import type { Locale } from "@/i18n/config";
import { getChannelKind } from "@/lib/channel-kind";
import { buildBlogPostMetadata } from "@/lib/seo/site-metadata";
import { LanguageProvider } from "@/components/organisms/LanguageContext";
import { Header, type HeaderData } from "@/components/organisms/Header";
import { Footer } from "@/components/organisms/Footer";
import { FloatingControls } from "@/components/shared/FloatingControls";
import BlogDetail from "@/components/templates/BlogDetail";

export async function generateStaticParams() {
  // Plain client.fetch here, not the draft-mode-aware sanityFetch — same
  // reasoning as app/[lang]/projects/[slug]/page.tsx: draftMode() isn't
  // available in this build-time-only context.
  const slugs = await client.fetch<{ slug: string }[]>(blogSlugs);
  return (slugs ?? []).map((post) => ({ slug: post.slug }));
}

interface BlogPageProps {
  params: Promise<{ lang: string; slug: string }>;
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { lang, slug } = await params;
  const { data: post } = await sanityFetch({ query: BLOG_BY_SLUG_QUERY, params: { slug }, stega: false });
  if (!post) return {};
  return buildBlogPostMetadata(post, lang as Locale);
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { lang, slug } = await params;
  const locale = lang as LangId;

  const [{ data: post }, portfolio] = await Promise.all([
    sanityFetch({ query: BLOG_BY_SLUG_QUERY, params: { slug } }),
    fetchPortfolioData("jatin-kumar"),
  ]);

  if (!post) {
    notFound();
  }

  const uiLabels = (portfolio?.data as any)?.uiLabels;

  return (
    <LanguageProvider lang={locale}>
      <Header data={portfolio?.data?.header as HeaderData | null} locale={locale} />
      <main>
        <BlogDetail post={post} locale={locale} />
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
