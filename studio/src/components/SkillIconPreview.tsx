import { Icon } from '@web-portfolio/icons'
import { ImageIcon } from '@sanity/icons'

interface SkillIconPreviewProps {
  iconName?: string
  svgIcon?: string
}

/** Same registry/rendering used by the icon picker input and the frontend, so the document list preview matches what actually ships. */
export function SkillIconPreview({ iconName, svgIcon }: SkillIconPreviewProps) {
  if (iconName) {
    return <Icon name={iconName} size={24} />
  }

  if (svgIcon) {
    return (
      <span
        style={{ display: 'inline-flex', width: 24, height: 24 }}
        dangerouslySetInnerHTML={{ __html: svgIcon }}
      />
    )
  }

  return <ImageIcon />
}
