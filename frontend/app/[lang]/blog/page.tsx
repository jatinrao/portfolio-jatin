import type { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { ALL_BLOGS_QUERY } from "@/sanity/lib/queries";
import { fetchPortfolioData } from "@/lib/queries";
import type { HeroRawData } from "@/lib/queries";
import { LangId, localize } from "@/lib/locale";
import { getChannelKind } from "@/lib/channel-kind";
import { LanguageProvider } from "@/components/organisms/LanguageContext";
import { Header, type HeaderData } from "@/components/organisms/Header";
import { Footer } from "@/components/organisms/Footer";
import { FloatingControls } from "@/components/shared/FloatingControls";
import { BlogCard } from "@/components/molecules/BlogCard";
import "./blog-list.css";

export const metadata: Metadata = {
  title: "Blog",
};

interface BlogListPageProps {
  params: Promise<{ lang: string }>;
}

export default async function BlogListPage({ params }: BlogListPageProps) {
  const { lang } = await params;
  const locale = lang as LangId;

  // Plain client.fetch, not the Live Content API's sanityFetch: as of
  // next-sanity 13 on Next 16, sanityFetch nulls out dereferenced (`asset->`)
  // fields like coverImage inside this app's runtime — a raw client.fetch
  // with identical project/dataset/token/query resolves them correctly.
  // Trade-off: this page won't live-refresh when content is published in
  // Studio (a manual reload picks up the change) — everything else about
  // stega/visual-editing is unaffected since it's baked into the client.
  const [posts, portfolio] = await Promise.all([
    client.fetch(ALL_BLOGS_QUERY),
    fetchPortfolioData("jatin-kumar"),
  ]);

  const uiLabels = (portfolio?.data as any)?.uiLabels;

  return (
    <LanguageProvider lang={locale}>
      <Header data={portfolio?.data?.header as HeaderData | null} locale={locale} />
      <main className="blog-list">
        <div className="blog-list-column">
          <h1 className="blog-list-headline">Blog</h1>
          {(posts ?? []).length > 0 ? (
            <div className="blog-list-grid">
              {(posts ?? []).map((post) => (
                <BlogCard key={post._id} post={post} locale={locale} />
              ))}
            </div>
          ) : (
            <p className="blog-list-empty">No posts yet — check back soon.</p>
          )}
        </div>
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
