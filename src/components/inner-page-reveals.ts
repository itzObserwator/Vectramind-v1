// Inner-page content only. The landing page retains its own animation sequence.
const text = "h1,h2,h3,h4,h5,h6,p,blockquote,figcaption,summary,strong,small";
const visuals =
  ".inner-hero-art,.platform-image-link,.expertise-photo,.founder-image,.career-photo,.article-cover,.people-image,.insight-image,.prose-document img,.prose-document table";
export const innerRevealTargets = [
  text,
  visuals,
  "[data-reveal]",
  ".eyebrow",
  ".section-label",
  ".inner-breadcrumb",
  ".inner-hero-bottom",
  ".product-metrics > div",
  ".module-buttons > button",
  ".module-detail-navigation > a",
  ".milestone-filters > button",
  ".enquiry-types > label",
  ".enquiry-types legend",
  ".module-panel > .brand-mark",
  ".office-chips > a",
  ".expertise-detail li",
  ".prose-document li",
  ".text-link",
  ".button",
  ".page-jump-nav > a",
  ".form-fields > label",
  ".form-consent",
  ".form-submit",
  ".email-draft pre",
  ".draft-actions",
  ".draft-edit",
  ".contact-email",
  ".contact-side-links > a",
  ".locations-grid > a > span:last-child",
  ".article-byline > span",
  ".article-back",
  ".article-layout > aside > a",
  ".legal-layout > aside > a",
  ".related-platform > a",
  ".insights-toolbar > label",
  ".faq-search",
  ".founder-section > div > span:last-child",
].join(",");

export function shouldRevealInnerElement(element: HTMLElement) {
  if (element.closest('[aria-hidden="true"], .sr-only, [data-scroll-reveal]'))
    return false;
  // A tall article/section must not consume the reveals of text further below.
  // Existing data-reveal containers yield to their individual content blocks.
  if (
    element.hasAttribute("data-reveal") &&
    !element.matches(`${text},${visuals}`) &&
    element.querySelector(innerRevealTargets)
  )
    return false;
  return true;
}
