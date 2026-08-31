import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ImageFrame3D } from "./ImageFrame3D";

describe("ImageFrame3D", () => {
  it("renders the photo with the given alt text", () => {
    render(<ImageFrame3D src="/images/frame-demo-photo.jpg" alt="A framed beach photo" />);
    expect(screen.getByRole("img", { name: "A framed beach photo" })).toBeInTheDocument();
  });

  it("applies custom yaw and pitch as rotation custom properties", () => {
    const { container } = render(
      <ImageFrame3D src="/images/frame-demo-photo.jpg" alt="A framed beach photo" yaw={5} pitch={-2} />,
    );
    const root = container.querySelector(".if3d") as HTMLElement;
    expect(root.style.getPropertyValue("--if3d-rotate-y")).toBe("5deg");
    expect(root.style.getPropertyValue("--if3d-rotate-x")).toBe("-2deg");
  });

  it("puts the given data-sanity attribute on the photo well for Presentation tool overlays", () => {
    const { container } = render(
      <ImageFrame3D
        src="/images/frame-demo-photo.jpg"
        alt="A framed beach photo"
        dataSanity="sanity-edit-target"
      />,
    );
    const photoWell = container.querySelector(".if3d-photo") as HTMLElement;
    expect(photoWell.getAttribute("data-sanity")).toBe("sanity-edit-target");
  });
});
