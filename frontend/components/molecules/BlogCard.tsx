import Link from "next/link";
import type { ALL_BLOGS_QUERY_RESULT } from "@/sanity.types";
import { LangId, localize } from "@/lib/locale";
import { urlForImage, dataAttr } from "@/sanity/lib/utils";
import { formatBlogDate } from "@/lib/format-date-range";
import { ImageFrame3D } from "@/components/molecules/ImageFrame3D";
import "./blog-card.css";

export interface BlogCardProps {
  post: ALL_BLOGS_QUERY_RESULT[number];
  locale: LangId;
}

export function BlogCard({ post, locale }: BlogCardProps) {
  const title = localize(post.title, locale);
  const dek = localize(post.dek, locale);
  const coverUrl = post.coverImage?.asset ? urlForImage(post.coverImage)?.url() : undefined;

  return (
    <Link href={`/${locale}/blog/${post.slug.current}`} className="blog-card">
      <div className={`blog-card-image${coverUrl ? "" : " blog-card-image--empty"}`}>
        {coverUrl && (
          <ImageFrame3D
            src={coverUrl}
            alt={localize(post.coverImage.alt, locale) ?? title}
            sizes="(max-width: 734px) 100vw, 360px"
            dataSanity={dataAttr({ id: post._id, type: "blog", path: "coverImage" }).toString()}
          />
        )}
      </div>
      <div className="blog-card-body">
        <div className="blog-card-meta">
          <span className="blog-card-category">{post.category}</span>
          <span className="blog-card-date">{formatBlogDate(post.publishedDate, locale)}</span>
        </div>
        <h3 className="blog-card-title">{title}</h3>
        {dek && <p className="blog-card-dek">{dek}</p>}
      </div>
    </Link>
  );
}

export default BlogCard;
