import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'navItem',
  title: 'Nav item',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'localeString',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'linkType',
      title: 'Link type',
      type: 'string',
      options: {
        list: [
          { title: 'Anchor (section on this page)', value: 'anchor' },
          { title: 'Internal page', value: 'internal' },
          { title: 'External URL', value: 'external' },
        ],
        layout: 'radio',
      },
      initialValue: 'anchor',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'anchorId',
      title: 'Section anchor',
      type: 'string',
      description: 'Must match a Section ID exactly, e.g. "about" for #about.',
      hidden: ({ parent }) => parent?.linkType !== 'anchor',
      validation: (Rule) =>
        Rule.custom((value, context: any) =>
          context.parent?.linkType === 'anchor' && !value
            ? 'Anchor ID is required for anchor links'
            : true
        ),
    }),
    defineField({
      name: 'externalUrl',
      title: 'External URL',
      type: 'url',
      hidden: ({ parent }) => parent?.linkType !== 'external',
      validation: (Rule) =>
        Rule.custom((value, context: any) =>
          context.parent?.linkType === 'external' && !value
            ? 'Enter a URL'
            : true
        ).uri({ scheme: ['http', 'https', 'mailto'] }),
    }),
    defineField({
      name: 'openInNewTab',
      title: 'Open in new tab',
      type: 'boolean',
      initialValue: false,
      hidden: ({ parent }) => parent?.linkType === 'anchor',
    }),
    defineField({
      name: 'highlight',
      title: 'Highlight as CTA',
      type: 'boolean',
      initialValue: false,
      description: 'Styles this item as a button, e.g. "Hire Me" or "Resume".',
    }),
  ],
  preview: {
    select: {
      label: 'label.en',
      linkType: 'linkType',
      anchorId: 'anchorId',
      externalUrl: 'externalUrl',
    },
    prepare({ label, linkType, anchorId, externalUrl }) {
      const target =
        linkType === 'anchor' ? `#${anchorId}` : linkType === 'external' ? externalUrl : 'Internal page';
      return {
        title: label || 'Untitled nav item',
        subtitle: target,
      };
    },
  },
});