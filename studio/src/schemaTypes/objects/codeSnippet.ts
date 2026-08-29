import { defineType, defineField } from 'sanity'
import { CodeBlockIcon } from '@sanity/icons'

/** Plain monospace code block for blog body content — no syntax-highlight
 * dependency, just a labeled snippet. */
export const codeSnippet = defineType({
  name: 'codeSnippet',
  title: 'Code snippet',
  type: 'object',
  icon: CodeBlockIcon,
  fields: [
    defineField({ name: 'label', title: 'Label', type: 'string', description: 'e.g. a filename or context, shown above the code.' }),
    defineField({ name: 'language', title: 'Language', type: 'string', description: 'e.g. "tsx", "bash" — shown as a small tag.' }),
    defineField({ name: 'code', title: 'Code', type: 'text', rows: 10, validation: (R) => R.required() }),
  ],
  preview: {
    select: { title: 'label', subtitle: 'language' },
    prepare({ title, subtitle }: { title?: string; subtitle?: string }) {
      return { title: title || 'Code snippet', subtitle }
    },
  },
})
