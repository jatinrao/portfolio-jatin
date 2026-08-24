import type { SchemaTypeDefinition } from 'sanity'

// Localized field primitives
import { localeString } from './objects/localeString'
import { localeText } from './objects/localeText'
import { localeBlockContent } from './objects/localeBlockContent'

// Media
import { customImage } from './objects/customImage'
import { icon } from './objects/icon'

// Embedded objects
import { socialProfile } from './objects/socialProfile'
import { section } from './documents/section'
import { seoMetadata } from './objects/seoMetadata'
import { webSchema } from './objects/webSchema'
import svg  from './objects/customSvg'
// Documents
import { person } from './documents/person'
import { skill } from './documents/skill'
import { organization } from './documents/organization'
import { experience } from './documents/experience'
import { education } from './documents/education'
import { certification } from './documents/certification'
import { award } from './documents/award'
import { publication } from './documents/publication'
import { testimonial } from './documents/testimonial'
import { project } from './documents/project'
import { portfolio } from './documents/portfolio'
import inlineSvg from './objects/inlineSvg'
import { navigation } from './documents/navigation'
import navItem from './objects/navItem'
import { ctaButton } from './objects/ctaButton'
import { skillCategoryLabels } from './documents/category-labels'
import { uiLabels } from './documents/ui-labels'
export const schemaTypes: SchemaTypeDefinition[] = [
  // Localized primitives — must be registered before anything that uses them
  localeString,
  localeText,
  localeBlockContent,
  navItem,

  // Media
  customImage,
  icon,
 
  // Objects
  svg,
  inlineSvg,
  ctaButton,
  socialProfile,
  section,
  seoMetadata,
  webSchema,

  // Documents
  person,
  skill,
  organization,
  experience,
  education,
  certification,
  award,
  publication,
  testimonial,
  project,
  portfolio,
  navigation,
  skillCategoryLabels,
  uiLabels,
]
