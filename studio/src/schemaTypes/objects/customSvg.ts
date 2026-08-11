import { defineField, defineType } from 'sanity'
import { SvgInput } from '../../components/SvgComponent'

export default defineType({
  name: 'svg',
  title: 'SVG Icon',
  type: 'object',

  components: {
    input: SvgInput,
  },

  fields: [
    defineField({
      name: 'sourceSvg',
      title: 'Source SVG',
      type: 'inlineSvg',
    }),

    defineField({
      name: 'strokeColor',
      title: 'Stroke',
      type: 'string',
      initialValue: '#000000',
      hidden: true,
    }),

    defineField({
  name: 'fillColor',
  title: 'Fill Color',
  type: 'string',
  initialValue: '#000000',
}),

    defineField({
      name: 'size',
      title: 'Size',
      type: 'string',
      initialValue: '24',
      hidden: true,
    }),

    defineField({
      name: 'strokeWidth',
      title: 'Stroke Width',
      type: 'string',
      initialValue: '2',
      hidden: true,
    }),

    defineField({
      name: 'strokeLinecap',
      title: 'Stroke Line Cap',
      type: 'string',
      initialValue: 'round',
      hidden: true,
    }),

    defineField({
      name: 'strokeLinejoin',
      title: 'Stroke Line Join',
      type: 'string',
      initialValue: 'round',
      hidden: true,
    }),

    defineField({
      name: 'svg',
      title: 'SVG',
      type: 'string',
      readOnly: true,
      hidden: true,
    }),
  ],
})