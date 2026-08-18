import { Icon } from '@web-portfolio/icons'
import type { SupportedLanguage } from '@/lib/resume/validation'

// ─── Main component ───────────────────────────────────────────────────────

interface DownloadResumeButtonProps {
  slug: string
  /**
   * Optional override — pass this on pages (like /resume) that resolve
   * `lang` from the query string rather than from live site navigation.
   * If omitted, falls back to the site's current `useLanguage()` value,
   * which is the right behavior when this button is dropped into the
   * main portfolio pages alongside the language switcher.
   */
  lang?: SupportedLanguage
  label?: string
}

/**
 * Fixed/sticky position, same idea as a language switcher widget: stays
 * visible in the corner regardless of scroll position. Position and
 * exact styling here are a reasonable default matching the site's
 * gold/green/cream palette — swap the inline `style` values below to
 * match your actual language switcher's placement/look exactly once
 * that component is available to reference.
 */
export function DownloadResumeButton({ slug, lang: langOverride, label }: DownloadResumeButtonProps) {
  // const { lang: contextLang } = useLanguage()
  const lang = langOverride as string;

  const href = `/api/resume/pdf?slug=${encodeURIComponent(slug)}&lang=${encodeURIComponent(lang)}`

  return (
    <a 
      href={href}
      download
      className="pdf-hide"
      data-print-hide="true"
      style={{
        position:       'fixed',
        bottom:         '24px',
        right:          '24px',
        zIndex:         50,
        display:        'inline-flex',
        alignItems:     'center',
        gap:            '8px',
        padding:        '12px 20px',
        background:     'var(--color-primary)',
        color:          'var(--color-on-primary)',
        fontWeight:     700,
        fontSize:       '14px',
        borderRadius:   '999px',
        border:         '2px solid var(--color-secondary-fixed)',
        boxShadow:      '0 4px 16px rgba(0,0,0,0.18)',
        textDecoration: 'none',
        transition:     'transform 0.15s ease, box-shadow 0.15s ease',
      }}
      // onMouseEnter={(e) => {
      //   ;(e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'
      //   ;(e.currentTarget as HTMLElement).style.boxShadow  = '0 6px 20px rgba(0,0,0,0.24)'
      // }}
      // onMouseLeave={(e) => {
      //   ;(e.currentTarget as HTMLElement).style.transform = ''
      //   ;(e.currentTarget as HTMLElement).style.boxShadow  = '0 4px 16px rgba(0,0,0,0.18)'
      // }}
    >
      <Icon name="download" size={16} />
      {label ?? 'Download Resume'}
    </a>
  )
}