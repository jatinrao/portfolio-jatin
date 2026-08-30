import { useEffect, useRef, useState } from 'react'
import { Icon } from '@web-portfolio/icons'
import { TagIcon } from '@sanity/icons'

interface SkillIconPreviewProps {
  iconName?: string
  svgIcon?: string
}

/**
 * `@web-portfolio/icons`' <Icon> silently renders nothing for a name it
 * doesn't recognize (renamed/removed registry entry, bad data) — with no
 * public way to check registry membership ahead of render, so this checks
 * after paint whether anything actually landed in the DOM and swaps to a
 * generic tag icon if not. `key`'d by iconName at the call site so each
 * new value gets a fresh optimistic render instead of carrying over the
 * previous value's resolved/unresolved state.
 */
function IconOrFallback({ iconName }: { iconName: string }) {
  const containerRef = useRef<HTMLSpanElement>(null)
  const [resolved, setResolved] = useState(true)

  useEffect(() => {
    setResolved(!!containerRef.current?.firstElementChild)
  }, [])

  return (
    <span ref={containerRef} style={{ display: 'inline-flex' }}>
      {resolved ? <Icon name={iconName} size={24} /> : <TagIcon />}
    </span>
  )
}

/** Same registry/rendering used by the icon picker input and the frontend, so the document list preview matches what actually ships. */
export function SkillIconPreview({ iconName, svgIcon }: SkillIconPreviewProps) {
  if (iconName) {
    return <IconOrFallback key={iconName} iconName={iconName} />
  }

  if (svgIcon) {
    return (
      <span
        style={{ display: 'inline-flex', width: 24, height: 24 }}
        dangerouslySetInnerHTML={{ __html: svgIcon }}
      />
    )
  }

  return <TagIcon />
}
