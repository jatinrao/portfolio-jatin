/**
 * This config is used to configure your Sanity Studio.
 * Learn more: https://www.sanity.io/docs/configuration
 */

import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './src/schemaTypes'
import {structure} from './src/structure'
import {unsplashImageAsset} from 'sanity-plugin-asset-source-unsplash'
import {
  presentationTool,
  defineDocuments,
  defineLocations,
  type DocumentLocation,
} from 'sanity/presentation'
import {assist} from '@sanity/assist'
import {sanityIconPicker} from '@web-portfolio/icons-sanity'
import { categoryI18nBundles } from './src/utils/categoryBundles'

// Environment variables for project configuration
const projectId = process.env.SANITY_STUDIO_PROJECT_ID || 'your-projectID'
const dataset = process.env.SANITY_STUDIO_DATASET || 'production'

// URL for preview functionality, defaults to localhost:3000 if not set
const SANITY_STUDIO_PREVIEW_URL = process.env.SANITY_STUDIO_PREVIEW_URL || 'http://localhost:3000'

// Real content routes — keep in sync with frontend/i18n/config.ts's `locales`
const SUPPORTED_LOCALES = ['en', 'es', 'fr', 'zh', 'hi', 'ar'] as const

// The sole person document backing this single-portfolio site — keep in
// sync with studio/scripts/migrate-feature-highlights.ts's PERSON_SLUG
const PERSON_SLUG = 'jatin-kumar'

// Main Sanity configuration
export default defineConfig({
  name: 'default',
  title: 'getResume.dev',

  projectId,
  dataset,

  plugins: [
    // Presentation tool configuration for Visual Editing
    presentationTool({
      previewUrl: {
        origin: SANITY_STUDIO_PREVIEW_URL,
        previewMode: {
          enable: '/api/draft-mode/enable',
        },
      },
      resolve: {
        // The Main Document Resolver API provides a method of resolving a main document from a given route or route pattern. https://www.sanity.io/docs/visual-editing/presentation-resolver-api#57720a5678d9
        // This is a single-portfolio site — every locale route resolves to
        // the one `person` document that backs the whole page.
        mainDocuments: defineDocuments([
          {
            route: '/:lang',
            filter: `_type == "person" && slug.current == "${PERSON_SLUG}"`,
          },
        ]),
        // Locations Resolver API allows you to define where data is being used in your application. https://www.sanity.io/docs/visual-editing/presentation-resolver-api#8d8bca7bfcd7
        locations: {
          person: defineLocations({
            select: {
              name: 'name.en',
              slug: 'slug.current',
            },
            resolve: (doc) => ({
              locations: SUPPORTED_LOCALES.map((lang) => ({
                title: `${doc?.name || 'Jatin Kumar'} — ${lang.toUpperCase()}`,
                href: `/${lang}`,
              })) satisfies DocumentLocation[],
            }),
          }),
        },
      },
    }),
    structureTool({
      structure, // Custom studio structure configuration, imported from ./src/structure.ts
    }),
    // Additional plugins for enhanced functionality
    unsplashImageAsset(),
    assist(),
    visionTool(),
    sanityIconPicker(),
  ],
  i18n: {
    bundles: [
      ...categoryI18nBundles,
      // ... any other bundles you already had here
    ],
  },
  // Schema configuration, imported from ./src/schemaTypes/index.ts
  schema: {
    types: schemaTypes,
  },
})
