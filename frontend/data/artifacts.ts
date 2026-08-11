import type { Artifact } from "@/types/artifact";

/**
 * Static seed data. In a real app this could come from MDX front-matter
 * or a CMS fetched inside `generateStaticParams` / at build time — the
 * carousel itself only ever receives a plain Artifact[], so the source
 * is swappable without touching component code.
 */
export const artifacts: Artifact[] = [
  {
    id: "obsidian-fragment",
    unitCode: "001",
    title: "Obsidian Fragment",
    series: "MONOLITH_SERIES",
    status: "ACTIVE",
    imageUrl:
      "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZThlOGU4Ii8+PGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iNSIgZmlsbD0iI2I0YjRiNCIvPjwvc3ZnPg==",
    imageAlt: "A jagged, dark volcanic-glass fragment against a black field.",
    description: "A sharp fragment of volcanic glass, collected from the Monolith Series.",
    metrics: [{ label: "Weight", value: "2.3g" }],
  },
  {
    id: "dark-energy",
    unitCode: "002",
    title: "Dark Energy",
    series: "COSMIC_PHENO",
    status: "STABLE",
    imageUrl:"",
    imageAlt: "A diffuse purple nebula cloud against deep space.",
    description: "Diffuse energetic field from deep space.",
    metrics: [],
  },
  {
    id: "solar-corona",
    unitCode: "003_CORE",
    title: "Solar Corona",
    series: "CELESTIAL_ARTIFACTS",
    status: "EMISSION_HIGH",
    imageUrl:"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZThlOGU4Ii8+PGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iNSIgZmlsbD0iI2I0YjRiNCIvPjwvc3ZnPg==",
       imageAlt: "The sun's corona glowing bright orange during an eclipse.",
    featured: true,
    description: "Outer atmosphere of a star with intense emission.",
    metrics: [],
  },
  {
    id: "gravitational-void",
    unitCode: "004",
    title: "Gravitational Void",
    series: "ABS_EQUILIBRIUM",
    status: "NULL_STATE",
    imageUrl:
      "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZThlOGU4Ii8+PGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iNSIgZmlsbD0iI2I0YjRiNCIvPjwvc3ZnPg==",
      imageAlt: "A perfectly black circular void ringed by faint light.",
    description: "An isolated region of null gravity with minimal detectable mass.",
    metrics: [],
  },
  {
    id: "luminous-drift",
    unitCode: "005",
    title: "Luminous Drift",
    series: "DUST_ARCHIVE",
    status: "SAMPLING",
    imageUrl:"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZThlOGU4Ii8+PGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iNSIgZmlsbD0iI2I0YjRiNCIvPjwvc3ZnPg==",
    imageAlt: "Faint luminous dust particles drifting across a dark backdrop.",
    description: "Particles of interstellar dust exhibiting faint luminescence.",
    metrics: [],
  },
];
