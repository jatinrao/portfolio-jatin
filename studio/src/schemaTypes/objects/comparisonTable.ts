import { defineType, defineField, defineArrayMember } from 'sanity'
import { DocumentSheetIcon } from '@sanity/icons'

/**
 * Fully-structured comparison table for blog body content — columns,
 * grouped rows, and per-cell verdicts. Optional block inside
 * `blogBlockContent`; not every post needs one.
 *
 * Cell verdicts use `iconRef` (from @web-portfolio/icons-sanity) rather
 * than a fixed good/bad/partial enum, so an editor picks the exact icon
 * (e.g. a check or a cross) from the same registry `<Icon>` renders on the
 * front end — see studio/src/schemaTypes/objects/icon.ts's header comment
 * for how that differs from this package's plain image-upload `icon` type.
 */

const tableCell = defineType({
  name: 'tableCell',
  title: 'Cell',
  type: 'object',
  fields: [
    defineField({
      name: 'icon',
      title: 'Verdict icon',
      type: 'iconRef',
      description: 'Optional — e.g. a check or cross from the icon registry.',
    }),
    defineField({ name: 'note', title: 'Note', type: 'text', rows: 2 }),
  ],
  preview: {
    select: { title: 'note', subtitle: 'icon' },
  },
})

const tableGroupRow = defineType({
  name: 'tableGroupRow',
  title: 'Group divider row',
  type: 'object',
  fields: [
    defineField({ name: 'label', title: 'Label', type: 'string', validation: (R) => R.required() }),
  ],
  preview: {
    select: { title: 'label' },
    prepare({ title }: { title?: string }) {
      return { title: title ? `— ${title} —` : 'Group row' }
    },
  },
})

const tableDataRow = defineType({
  name: 'tableDataRow',
  title: 'Data row',
  type: 'object',
  fields: [
    defineField({ name: 'label', title: 'Row label', type: 'string', validation: (R) => R.required() }),
    defineField({
      name: 'cells',
      title: 'Cells',
      type: 'array',
      of: [defineArrayMember({ type: 'tableCell' })],
      description: 'One cell per column, in the same order as the columns above.',
    }),
  ],
  preview: {
    select: { title: 'label' },
  },
})

const tableColumn = defineType({
  name: 'tableColumn',
  title: 'Column',
  type: 'object',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', validation: (R) => R.required() }),
    defineField({ name: 'descriptor', title: 'Descriptor', type: 'string' }),
    defineField({
      name: 'highlight',
      title: 'Highlight this column',
      type: 'boolean',
      initialValue: false,
      description: 'Visually calls out this column (e.g. "this repo").',
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'descriptor' },
  },
})

export const comparisonTable = defineType({
  name: 'comparisonTable',
  title: 'Comparison table',
  type: 'object',
  icon: DocumentSheetIcon,
  fields: [
    defineField({ name: 'caption', title: 'Caption', type: 'string' }),
    defineField({
      name: 'columns',
      title: 'Columns',
      type: 'array',
      of: [defineArrayMember({ type: 'tableColumn' })],
      validation: (R) => R.min(1),
    }),
    defineField({
      name: 'rows',
      title: 'Rows',
      type: 'array',
      of: [
        defineArrayMember({ type: 'tableGroupRow' }),
        defineArrayMember({ type: 'tableDataRow' }),
      ],
    }),
    defineField({ name: 'footnote', title: 'Footnote', type: 'text', rows: 2 }),
  ],
  preview: {
    select: { title: 'caption' },
    prepare({ title }: { title?: string }) {
      return { title: title || 'Comparison table' }
    },
  },
})

export const comparisonTableTypes = [tableCell, tableGroupRow, tableDataRow, tableColumn, comparisonTable]
