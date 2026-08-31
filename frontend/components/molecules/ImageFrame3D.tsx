import Image, { type StaticImageData } from "next/image";
import "./image-frame-3d.css";

export interface ImageFrame3DProps {
  /** Photo shown in the frame's recessed mat opening. */
  src: string | StaticImageData;
  alt: string;
  className?: string;
  /**
   * Camera rotation around the vertical axis, in degrees. Defaults to a
   * straight-on view; pass a few degrees for the source design's angled
   * "hanging on a wall" look.
   */
  yaw?: number;
  /**
   * Camera rotation around the horizontal axis, in degrees. Defaults to a
   * straight-on view.
   */
  pitch?: number;
  sizes?: string;
  /** Preloads the photo — set when this frame is the page's LCP element. */
  priority?: boolean;
  quality?: number;
  /**
   * Sanity `data-sanity` attribute (from `dataAttr(...).toString()`) for the
   * photo opening, so the Presentation tool's click-to-edit overlay can
   * target the image field. Applied to the recessed photo well, not the
   * `<img>` itself — the overlay measures whichever element carries it.
   */
  dataSanity?: string;
}

/**
 * A physically-modeled 3D picture frame built from CSS cuboids
 * (see https://css-tricks.com/css-in-3d-learning-to-think-in-cubes-instead-of-boxes/):
 * each rail is a front-facing lip plus two `rotateX`/`rotateY` planes that run
 * back to a shared depth, so the mitred corners line up without gaps. All
 * geometry scales off `--if3d-u` (container-query width units), so the frame
 * stays proportional at any rendered size with no JS and no resize observers.
 */
export function ImageFrame3D({
  src,
  alt,
  className,
  yaw = 0,
  pitch = 0,
  sizes = "(max-width: 640px) 100vw, (max-width: 1200px) 80vw, 940px",
  priority = false,
  quality,
  dataSanity,
}: ImageFrame3DProps) {
  return (
    <div
      className={["if3d", className].filter(Boolean).join(" ")}
      style={{
        ["--if3d-rotate-x" as string]: `${pitch}deg`,
        ["--if3d-rotate-y" as string]: `${yaw}deg`,
      }}
    >
      <div className="if3d-stage">
        <div className="if3d-frame">
          <div className="if3d-back" />
          <div className="if3d-mat" />

          <div className="if3d-photo" data-sanity={dataSanity}>
            <Image
              src={src}
              alt={alt}
              fill
              sizes={sizes}
              quality={quality}
              preload={priority}
              className="if3d-photo-img"
            />
          </div>

          <div className="if3d-rail if3d-rail--top-lip" />
          <div className="if3d-rail if3d-rail--top-outer" />
          <div className="if3d-rail if3d-rail--top-inner" />

          <div className="if3d-rail if3d-rail--bottom-lip" />
          <div className="if3d-rail if3d-rail--bottom-outer" />
          <div className="if3d-rail if3d-rail--bottom-inner" />

          <div className="if3d-rail if3d-rail--left-lip" />
          <div className="if3d-rail if3d-rail--left-outer" />
          <div className="if3d-rail if3d-rail--left-inner" />

          <div className="if3d-rail if3d-rail--right-lip" />
          <div className="if3d-rail if3d-rail--right-outer" />
          <div className="if3d-rail if3d-rail--right-inner" />
        </div>
      </div>
    </div>
  );
}

export default ImageFrame3D;
