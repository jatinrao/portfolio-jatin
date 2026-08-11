import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'formField',
  title: 'Form Field',
  type: 'object',
  fields: [
    defineField({
      name: 'name',
      title: 'Field key',
      description:
        "Machine name used as the form control's `name`/state key, e.g. \"identity\", \"coordinates\", \"payload\". Not shown to visitors.",
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'step',
      title: 'Step prefix',
      description: 'The leading number shown before the label, e.g. "01", "02".',
      type: 'string',
    }),
    defineField({
      name: 'label',
      title: 'Label',
      type: 'localeString',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'placeholder',
      title: 'Placeholder',
      type: 'localeString',
    }),
    defineField({
      name: 'fieldType',
      title: 'Field type',
      type: 'string',
      options: {
        list: [
          { title: 'Text', value: 'text' },
          { title: 'Email', value: 'email' },
          { title: 'Textarea', value: 'textarea' },
        ],
      },
      initialValue: 'text',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'required',
      title: 'Required',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'colSpan',
      title: 'Full width',
      description: 'Whether this field spans both columns of the form grid (e.g. the message textarea).',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: 'label.en', subtitle: 'fieldType' },
  },
});