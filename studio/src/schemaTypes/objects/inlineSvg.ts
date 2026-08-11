import {defineField, defineType} from 'sanity'
import {InlineSvgInput} from '../../components/InlineSvgInput'

export default defineType({
  name: 'inlineSvg',
  title: 'SVG',
  type: 'string',

  components: {
    input: InlineSvgInput,
  },

  validation: Rule =>
    Rule.required().custom(value => {
      if (!value) return true

      return value.includes('<svg')
        ? true
        : 'Please provide valid SVG markup.'
    }),
})