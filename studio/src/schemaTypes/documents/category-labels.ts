import { defineField, defineType } from 'sanity';

export const skillCategoryLabels = defineType({
  name: 'skillCategoryLabels',
  title: 'Skill Category Labels',
  type: 'document',
  // This is meant to exist as exactly one document — a simple settings-style
  // singleton, not one document per category. If you want to enforce that
  // in the Studio UI (hide "Create new" / pin it as a single settings
  // entry), that's a Structure Tool tweak — happy to add it, but skipping
  // for now to keep this as plain/uncustomized as possible.
  fields: [
    // One `localeString` per category value on `skill.category` — same
    // localized-text type already used for `skill.name`, so the frontend's
    // existing `pickLocale()` helper works on these exactly the same way.
    defineField({ name: 'technical', title: 'Technical', type: 'localeString' }),
    defineField({ name: 'framework', title: 'Framework', type: 'localeString' }),
    defineField({ name: 'library', title: 'Library', type: 'localeString' }),
    defineField({ name: 'tool', title: 'Tool', type: 'localeString' }),
    defineField({ name: 'platform', title: 'Platform', type: 'localeString' }),
    defineField({ name: 'design', title: 'Design', type: 'localeString' }),
    defineField({ name: 'language', title: 'Language', type: 'localeString' }),
    defineField({ name: 'cloudDevops', title: 'Cloud & DevOps', type: 'localeString' }),
    defineField({ name: 'database', title: 'Database', type: 'localeString' }),
    defineField({ name: 'softSkill', title: 'Soft skill', type: 'localeString' }),
    defineField({ name: 'other', title: 'Other', type: 'localeString' }),
    defineField({ name: 'all', title: 'All', type: 'localeString' }),
    defineField({ name: 'frontend', title: 'Frontend', type: 'localeString' }),
    defineField({ name: 'backend', title: 'Backend', type: 'localeString' }),
    defineField({ name: 'ai', title: 'AI', type: 'localeString' }),
 
  ],
  preview: {
    prepare: () => ({ title: 'Skill Category Labels' }),
  },
});