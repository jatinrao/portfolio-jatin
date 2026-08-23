interface SectionHeadingProps { children: React.ReactNode }

/**
 * Shared section title style — every resume section (Summary,
 * Experience, Education, Projects, Skills) renders its heading through
 * this one component, so the look stays identical everywhere and only
 * has to be adjusted in one place.
 */
export function SectionHeading({ children }: SectionHeadingProps) {
  return (
    <h2 className="resume-section-title">
      {children}
    </h2>
  )
}
