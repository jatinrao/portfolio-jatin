interface SectionHeadingProps { children: React.ReactNode }

/**
 * Shared section title style — every resume section (Summary,
 * Experience, Education, Projects, Skills) renders its heading through
 * this one component, so the look stays identical everywhere and only
 * has to be adjusted in one place.
 */
export function SectionHeading({ children }: SectionHeadingProps) {
  return (
    <h2 style={{
      fontSize:      '10.5pt',
      fontWeight:    700,
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
      color:         '#2d5a3d',
      borderBottom:  '1px solid #c9a84c',
      paddingBottom: '3px',
      margin:        '0 0 8px',
    }}>
      {children}
    </h2>
  )
}
