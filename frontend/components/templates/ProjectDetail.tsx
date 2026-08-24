import type { ReactNode } from "react";
import Image from "next/image";
import { PortableText } from "next-sanity";
import { Icon } from "@web-portfolio/icons";
import type { Project, CustomImage } from "@/sanity.types";
import { LangId, localize } from "@/lib/locale";
import { urlForImage } from "@/sanity/lib/utils";
import { formatProjectDateRange } from "@/lib/format-date-range";
import Button from "@/components/atoms/Button";
import "./project-detail.css";

const projectDetailPortableTextComponents = {
  block: {
    h2: ({ children }: { children?: ReactNode }) => (
      <h2 className="project-detail-h2">{children}</h2>
    ),
    h3: ({ children }: { children?: ReactNode }) => (
      <h3 className="project-detail-h3">{children}</h3>
    ),
    normal: ({ children }: { children?: ReactNode }) => (
      <p className="project-detail-p">{children}</p>
    ),
    blockquote: ({ children }: { children?: ReactNode }) => (
      <blockquote className="project-detail-quote">{children}</blockquote>
    ),
  },
  list: {
    bullet: ({ children }: { children?: ReactNode }) => (
      <ul className="project-detail-list">{children}</ul>
    ),
    number: ({ children }: { children?: ReactNode }) => (
      <ol className="project-detail-list">{children}</ol>
    ),
  },
};

export interface ProjectDetailProps {
  project: Project;
  locale: LangId;
}

export default function ProjectDetail({ project, locale }: ProjectDetailProps) {
  const title = localize(project.title, locale);
  const description = localize(project.description, locale);
  const dateRange = formatProjectDateRange(project.startDate, project.endDate);
  const heroUrl = project.coverImage?.asset ? urlForImage(project.coverImage)?.url() : undefined;
  const body = project.body?.[locale];
  const gallery: CustomImage[] = project.gallery ?? [];

  return (
    <article className="project-detail">
      <div className="project-detail-hero">
        <div className="project-detail-hero-frame">
          {heroUrl && (
            <Image
              src={heroUrl}
              alt={localize(project.coverImage?.alt, locale) ?? title}
              fill
              priority
              sizes="(max-width: 1068px) 100vw, 980px"
              className="object-contain"
            />
          )}
        </div>
        <div className="project-detail-hero-overlay" aria-hidden="true" />
      </div>

      <div className="project-detail-column">
        {dateRange && <p className="project-detail-eyebrow">{dateRange}</p>}
        <h1 className="project-detail-headline">{title}</h1>
        {description && <p className="project-detail-lede">{description}</p>}

        {(project.repositoryUrl || project.projectUrl) && (
          <div className="project-detail-links">
            {project.repositoryUrl && (
              <Button variant="outline" href={project.repositoryUrl}>
                <Icon name="github" size={16} />
                View Repository
              </Button>
            )}
            {project.projectUrl && (
              <Button variant="primary" href={project.projectUrl}>
                <Icon name="open_in_new" size={16} />
                View Live
              </Button>
            )}
          </div>
        )}

        {body && (
          <div className="project-detail-body">
            <PortableText value={body} components={projectDetailPortableTextComponents} />
          </div>
        )}

        {gallery.length > 0 && (
          <div className="project-detail-gallery">
            {gallery.map((image, index) => {
              const imageUrl = image?.asset ? urlForImage(image)?.url() : undefined;
              if (!imageUrl) return null;
              return (
                <div key={index} className="project-detail-gallery-item">
                  <Image
                    src={imageUrl}
                    alt={localize(image.alt, locale) ?? `${title} gallery image ${index + 1}`}
                    fill
                    sizes="(max-width: 734px) 100vw, 692px"
                    className="object-cover"
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </article>
  );
}
