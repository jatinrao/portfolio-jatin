// Registry of design tokens exposed to the dev-only <DesignTokenEditor>.
// Single source of truth for: which CSS custom properties are editable,
// their current default (per light/dark), and how the "Save as default"
// API route finds/replaces them inside app/globals.css.
//
// IMPORTANT: the `light`/`dark` values below are a SEPARATE copy of
// app/globals.css's defaults, not read from it. DesignTokenEditor applies
// these as inline style overrides on <html> on every mount (dev only), so
// if you edit a tracked token's value in globals.css without updating the
// matching entry here, the dev-only override silently wins and the new
// globals.css value never renders while running `next dev` — cost real
// debugging time once already. Keep these in sync by hand until this
// reads live values instead.

export type TokenType = 'color' | 'duration' | 'spacing' | 'fontSize' | 'toggle'

export interface TokenDef {
  /** CSS custom property name, e.g. "--color-primary" */
  var: string
  label: string
  type: TokenType
  /** Default value used in the `@theme { ... }` block (light mode / base). */
  light: string
  /** Default value used in the `.dark { ... }` block. Omit for "fixed" tokens that don't vary by theme. */
  dark?: string
}

export interface TokenGroup {
  id: string
  label: string
  tokens: TokenDef[]
}

export const TOKEN_GROUPS: TokenGroup[] = [
  {
    id: 'primary',
    label: 'Primary',
    tokens: [
      { var: '--color-primary', label: 'Primary', type: 'color', light: '#1c63a0', dark: '#0091ff' },
      { var: '--color-on-primary', label: 'On Primary', type: 'color', light: '#ffffff', dark: '#ffffff' },
      { var: '--color-primary-container', label: 'Primary Container', type: 'color', light: '#e0f1ff', dark: '#002540' },
      { var: '--color-on-primary-container', label: 'On Primary Container', type: 'color', light: '#003a70', dark: '#99d1ff' },
    ],
  },
  {
    id: 'secondary',
    label: 'Secondary',
    tokens: [
      { var: '--color-secondary', label: 'Secondary', type: 'color', light: '#ff8d28', dark: '#ff9230' },
      { var: '--color-on-secondary', label: 'On Secondary', type: 'color', light: '#ffffff', dark: '#ffffff' },
      { var: '--color-secondary-container', label: 'Secondary Container', type: 'color', light: '#ffe8d6', dark: '#402611' },
      { var: '--color-on-secondary-container', label: 'On Secondary Container', type: 'color', light: '#7a3d0a', dark: '#ffcfa3' },
    ],
  },
  {
    id: 'surface',
    label: 'Surface',
    tokens: [
      { var: '--color-surface', label: 'Surface', type: 'color', light: '#ffffff', dark: '#000000' },
      { var: '--color-on-surface', label: 'On Surface', type: 'color', light: '#000000', dark: '#ffffff' },
      { var: '--color-surface-container', label: 'Surface Container', type: 'color', light: '#f2f2f7', dark: '#1c1c1e' },
      { var: '--color-surface-container-low', label: 'Surface Container Low', type: 'color', light: '#f8f8fa', dark: '#121214' },
      { var: '--color-outline', label: 'Outline', type: 'color', light: '#c6c6c8', dark: '#38383a' },
      { var: '--color-outline-variant', label: 'Outline Variant', type: 'color', light: 'rgba(0,0,0,0.12)', dark: 'rgba(255,255,255,0.17)' },
    ],
  },
  {
    id: 'text',
    label: 'Text',
    tokens: [
      { var: '--color-heading-ink', label: 'Heading Ink', type: 'color', light: '#000000', dark: '#ffffff' },
      { var: '--color-muted-body', label: 'Muted Body', type: 'color', light: 'rgba(60,60,67,0.6)', dark: 'rgba(235,235,245,0.7)' },
      { var: '--color-on-surface-variant', label: 'On Surface Variant', type: 'color', light: 'rgba(60,60,67,0.75)', dark: 'rgba(235,235,245,0.7)' },
    ],
  },
  {
    id: 'status',
    label: 'Status',
    tokens: [
      { var: '--color-error', label: 'Error', type: 'color', light: '#ff383c', dark: '#ff383c' },
      { var: '--color-on-error', label: 'On Error', type: 'color', light: '#ffffff', dark: '#ffffff' },
    ],
  },
  {
    id: 'rooms',
    label: 'Room TV',
    tokens: [
      { var: '--color-room-skills', label: 'Background 1', type: 'color', light: '#34c759', dark: '#30d158' },
      { var: '--color-room-experience', label: 'Background 2', type: 'color', light: '#5e5ce6', dark: '#7d7aff' },
      { var: '--color-room-projects', label: 'Background 3', type: 'color', light: '#ff375f', dark: '#ff375f' },
    ],
  },
  {
    id: 'glass',
    label: 'Liquid Glass',
    tokens: [
      { var: '--glass-enabled', label: 'Glass materials', type: 'toggle', light: '1', dark: '1' },
      { var: '--glass-fill', label: 'Glass overlay', type: 'color', light: 'rgba(245, 245, 247, 0.16)', dark: 'rgba(28, 28, 30, 0.28)' },
      { var: '--glass-fill-strong', label: 'Glass strong', type: 'color', light: 'rgba(245, 245, 247, 0.62)', dark: 'rgba(28, 28, 30, 0.55)' },
      { var: '--glass-hairline', label: 'Glass hairline', type: 'color', light: 'rgba(255, 255, 255, 0.55)', dark: 'rgba(255, 255, 255, 0.22)' },
      { var: '--glass-highlight', label: 'Glass highlight', type: 'color', light: 'rgba(255, 255, 255, 0.72)', dark: 'rgba(255, 255, 255, 0.28)' },
      { var: '--glass-shadow', label: 'Glass shadow', type: 'spacing', light: '0 8px 32px rgba(0, 0, 0, 0.12)', dark: '0 8px 32px rgba(0, 0, 0, 0.36)' },
      { var: '--glass-blur', label: 'Glass blur', type: 'spacing', light: '30px', dark: '30px' },
      { var: '--glass-saturate', label: 'Glass saturate', type: 'spacing', light: '1.8', dark: '1.8' },
      { var: '--glass-refraction', label: 'Glass refraction', type: 'spacing', light: '0.04', dark: '0.04' },
      { var: '--glass-clear-dim', label: 'Clear glass dim', type: 'color', light: 'rgba(0, 0, 0, 0.35)', dark: 'rgba(0, 0, 0, 0.35)' },
    ],
  },
  {
    id: 'motion',
    label: 'Motion',
    tokens: [
      { var: '--transition-fast', label: 'Hover — fast', type: 'duration', light: '150ms' },
      { var: '--transition-standard', label: 'Hover — standard', type: 'duration', light: '250ms' },
      { var: '--ease-standard', label: 'Easing curve', type: 'duration', light: 'cubic-bezier(0.25, 0.1, 0.25, 1)' },
    ],
  },
  {
    id: 'spacing',
    label: 'Spacing',
    tokens: [
      { var: '--spacing-margin-mobile', label: 'Page margin — mobile', type: 'spacing', light: '1.25rem' },
      { var: '--spacing-margin-desktop', label: 'Page margin — desktop', type: 'spacing', light: '3.5rem' },
      { var: '--spacing-gutter', label: 'Gutter', type: 'spacing', light: '2.5rem' },
    ],
  },
  {
    id: 'cards',
    label: 'Cards',
    tokens: [
      { var: '--radius-card', label: 'Card radius', type: 'spacing', light: '10px' },
      { var: '--radius-control', label: 'Control radius', type: 'spacing', light: '10px' },
      { var: '--shadow-card-resting', label: 'Shadow — resting', type: 'spacing', light: '0 4px 16px rgba(0, 0, 0, 0.06)' },
      { var: '--shadow-card-hover', label: 'Shadow — hover', type: 'spacing', light: '0 12px 28px rgba(0, 0, 0, 0.12)' },
    ],
  },
  {
    id: 'typography',
    label: 'Typography',
    tokens: [
      { var: '--text-headline-xl', label: 'Headline XL', type: 'fontSize', light: '3rem' },
      { var: '--text-headline-lg', label: 'Headline LG', type: 'fontSize', light: '2rem' },
      { var: '--text-headline-md', label: 'Headline MD', type: 'fontSize', light: '1.5rem' },
      { var: '--text-body-lg', label: 'Body LG', type: 'fontSize', light: '1.125rem' },
      { var: '--text-body-md', label: 'Body MD', type: 'fontSize', light: '1rem' },
      { var: '--text-label-caps', label: 'Label — caps', type: 'fontSize', light: '0.75rem' },
      { var: '--text-label-md', label: 'Label — md', type: 'fontSize', light: '0.6875rem' },
      { var: '--text-label-sm', label: 'Label — sm', type: 'fontSize', light: '0.625rem' },
      { var: '--text-label-xs', label: 'Label — xs', type: 'fontSize', light: '0.5rem' },
      { var: '--text-label-2xs', label: 'Label — 2xs', type: 'fontSize', light: '0.4375rem' },
    ],
  },
]

export const ALL_TOKENS: TokenDef[] = TOKEN_GROUPS.flatMap((g) => g.tokens)

export type TokenValues = Record<string, string>

export function defaultValues(mode: 'light' | 'dark'): TokenValues {
  const out: TokenValues = {}
  for (const t of ALL_TOKENS) {
    out[t.var] = mode === 'dark' ? (t.dark ?? t.light) : t.light
  }
  return out
}
