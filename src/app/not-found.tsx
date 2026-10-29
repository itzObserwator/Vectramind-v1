import Link from "next/link";
export default function NotFound() {
  return (
    <section className="not-found-page page-padding" id="top">
      <span className="eyebrow">404 / A different direction</span>
      <h1 className="display">
        Let’s get you
        <br />
        back on track.
      </h1>
      <p>
        The page you’re looking for isn’t here. There’s plenty more to explore.
      </p>
      <div>
        <Link className="button button-primary" href="/">
          Back to Vectramind ↗
        </Link>
        <Link className="button button-outline" href="/support/#contact-form">
          Talk to our team ↗
        </Link>
      </div>
    </section>
  );
}
