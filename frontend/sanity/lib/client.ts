import {createClient} from 'next-sanity'

import {apiVersion, dataset, projectId, stegaEnabled, studioUrl} from '@/sanity/lib/api'
import {token} from '@/sanity/lib/token'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: 'published',
  token, // Required if you have a private dataset
  stega: {studioUrl, enabled: stegaEnabled},
})
