import Image from "next/image";
import { PortableText, type PortableTextComponents } from "next-sanity";
import { Icon } from "@web-portfolio/icons";
import type { BLOG_BY_SLUG_QUERY_RESULT, LocaleString } from "@/sanity.types";
import { LangId, localize } from "@/lib/locale";
import { urlForImage, dataAttr, resolveRichTextLink, type RichTextLinkMark } from "@/sanity/lib/utils";
import { formatBlogDate } from "@/lib/format-date-range";
import { ComparisonTable } from "@/components/molecules/ComparisonTable";
import { ImageFrame3D } from "@/components/molecules/ImageFrame3D";
import "./blog-detail.css";

type BlogPost = NonNullable<BLOG_BY_SLUG_QUERY_RESULT>;

/** An embedded `customImage` block inside blog body, as shaped by
 * BLOG_BY_SLUG_QUERY's per-language projection (asset dereferenced). */
interface BlogBodyImage {
  asset?: {
    url: string;
    metadata?: { dimensions?: { width: number; height: number } | null } | null;
  } | null;
  alt?: LocaleString;
  caption?: LocaleString;
  credit?: string;
}

function buildPortableTextComponents(locale: LangId): PortableTextComponents {
  return {
    block: {
      h3: ({ children }) => <h2 className="blog-detail-h2">{children}</h2>,
      h4: ({ children }) => <h3 className="blog-detail-h3">{children}</h3>,
      normal: ({ children }) => <p className="blog-detail-p">{children}</p>,
      blockquote: ({ children }) => (
        <blockquote className="blog-detail-pull">{children}</blockquote>
      ),
    },
    list: {
      bullet: ({ children }) => <ul className="blog-detail-list">{children}</ul>,
      number: ({ children }) => <ol className="blog-detail-list">{children}</ol>,
    },
    marks: {
      link: ({ children, value }) => {
        const resolved = resolveRichTextLink(value as RichTextLinkMark, locale);
        if (!resolved) return <>{children}</>;
        return (
          <a
            href={resolved.href}
            className="blog-detail-link-inline"
            target={resolved.target}
            rel={resolved.target === "_blank" ? "noopener noreferrer" : undefined}
          >
            {children}
          </a>
        );
      },
    },
    types: {
      calloutBox: ({ value }) => (
        <div className="blog-detail-callout">
          {value.label && <span className="blog-detail-callout-label">{value.label}</span>}
          <p className="blog-detail-callout-text">{localize(value.text, locale)}</p>
        </div>
      ),
      codeSnippet: ({ value }) => (
        <div className="blog-detail-snippet">
          <div className="blog-detail-snippet-tag">
            {value.label && <span>{value.label}</span>}
            {value.language && <span>{value.language}</span>}
          </div>
          <pre>
            <code>{value.code}</code>
          </pre>
        </div>
      ),
      comparisonTable: ({ value }) => <ComparisonTable table={value} />,
      customImage: ({ value }: { value: BlogBodyImage }) => {
        const src = value.asset?.url;
        if (!src) return null;
        const dimensions = value.asset?.metadata?.dimensions;
        const caption = localize(value.caption, locale);
        return (
          <figure className="blog-detail-image">
            <Image
              src={src}
              alt={localize(value.alt, locale) || ""}
              width={dimensions?.width ?? 1200}
              height={dimensions?.height ?? 800}
              sizes="(max-width: 734px) 100vw, 692px"
              className="blog-detail-image-img"
            />
            {(caption || value.credit) && (
              <figcaption className="blog-detail-image-caption">
                {caption}
                {value.credit && <span className="blog-detail-image-credit"> — {value.credit}</span>}
              </figcaption>
            )}
          </figure>
        );
      },
    },
  };
}

export interface BlogDetailProps {
  post: BlogPost;
  locale: LangId;
}

export default function BlogDetail({ post, locale }: BlogDetailProps) {
  const title = localize(post.title, locale);
  const dek = localize(post.dek, locale);
  const authorName = post.author ? localize(post.author.name, locale) : "";
  const coverUrl = post.coverImage?.asset ? urlForImage(post.coverImage)?.url() : undefined;
  const body = post.body?.[locale] ?? [];
  const stats = post.stats ?? [];
  const footerLinks = post.footerLinks ?? [];
  const components = buildPortableTextComponents(locale);

  return (
    <article className="blog-detail">
      <div className="blog-detail-column blog-detail-column--head">
        <div className="blog-detail-meta">
          <span className="blog-detail-eyebrow">{post.category}</span>
          <span className="blog-detail-date">{formatBlogDate(post.publishedDate, locale)}</span>
        </div>
        <h1 className="blog-detail-headline">{title}</h1>
        {dek && <p className="blog-detail-dek">{dek}</p>}
        {authorName && (
          <div className="blog-detail-byline-row">
            <span className="blog-detail-byline">{authorName}</span>
            <a
              className="blog-detail-share"
              href={`mailto:?subject=${encodeURIComponent(title)}`}
              aria-label="Share via email"
            >
              <Icon name="mail" size={16} />
            </a>
          </div>
        )}
      </div>

      {coverUrl && (
        <div className="blog-detail-hero">
          <ImageFrame3D
            src={coverUrl}
            alt={localize(post.coverImage.alt, locale) || title}
            priority
            sizes="(max-width: 1068px) 100vw, 900px"
            dataSanity={dataAttr({ id: post._id, type: "blog", path: "coverImage" }).toString()}
          />
        </div>
      )}

      <div className="blog-detail-column">
        {stats.length > 0 && (
          <div className="blog-detail-stats">
            {stats.map((stat) => (
              <div key={stat._key} className="blog-detail-stat">
                <div className="blog-detail-stat-value">{stat.value}</div>
                {stat.label && <div className="blog-detail-stat-label">{stat.label}</div>}
              </div>
            ))}
          </div>
        )}

        {body.length > 0 && (
          <div className="blog-detail-body">
            <PortableText value={body} components={components} />
          </div>
        )}

        {footerLinks.length > 0 && (
          <div className="blog-detail-links">
            {footerLinks.map((link) => (
              <a key={link._key} href={link.url} className="blog-detail-link">
                {link.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
