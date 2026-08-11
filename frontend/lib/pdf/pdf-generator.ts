import "server-only";

/**
 * Abstraction the route/service layer depends on. Any implementation
 * (Playwright today; Puppeteer, an external rendering service, or a
 * different engine tomorrow) only needs to satisfy this one method.
 * Nothing outside `lib/pdf/` should ever import Playwright directly.
 */
export interface PdfGenerator {
  generate(html: string): Promise<Buffer>;
}
