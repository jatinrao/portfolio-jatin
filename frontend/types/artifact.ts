/**
 * Domain model for a single "cover" in the Coverflow carousel.
 * Kept framework-agnostic so it can be sourced from a CMS, MDX
 * front-matter, or a static array at build time (SSG).
 */
export interface Artifact {
  /** Stable identifier, also used for the DOM id / aria-controls wiring */
  id: string;
  /** Zero-padded display code, e.g. "001" */
  unitCode: string;
  title: string;
  /** Small taxonomy label shown under the title, e.g. "MONOLITH_SERIES" */
  series: string;
  /** Status chip text, e.g. "ACTIVE" | "STABLE" | "EMISSION_HIGH" */
  status: string;
  imageUrl: string;
  imageAlt: string;
  /** Marks the card that should render color instead of grayscale/desaturated */
  featured?: boolean;
  /** Longer copy shown in the landscape detail panel */
  description: string;
  /** Labelled spec rows shown in the landscape detail panel, e.g. distance, composition */
  metrics: { label: string; value: string }[];
}
