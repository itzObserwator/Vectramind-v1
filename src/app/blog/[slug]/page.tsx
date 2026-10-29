import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import posts from "@/content/imported/posts.json";
import { PageCta } from "@/components/pages/page-primitives";
import { Arrow } from "@/components/site-primitives";

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}
export const dynamicParams = false;
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find((item) => item.slug === slug);
  return {
    title: post
      ? `${post.title} — Vectramind`
      : "Perspective not found — Vectramind",
    description: post?.excerpt,
  };
}
export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = posts.find((item) => item.slug === slug);
  if (!post) notFound();
  const related = posts.filter((item) => item.slug !== slug).slice(0, 2);
  return (
    <div className="inner-page article-page" id="top">
      <header className="article-header page-padding">
        <Link href="/blog" className="article-back">
          ← All perspectives
        </Link>
        <span className="eyebrow">
          {post.category} / Vectramind perspectives
        </span>
        <h1 className="display">{post.title}</h1>
        <p>{post.excerpt}</p>
        <div className="article-byline">
          <span>By the Vectramind team</span>
          <span>Intelligence. Innovation. Technology.</span>
        </div>
      </header>
      <div className="article-cover page-padding">
        <img src={post.image} alt={post.title} fetchPriority="high" />
      </div>
      <div className="article-layout page-padding">
        <aside>
          <span className="eyebrow">A shared perspective</span>
          <p>Ideas for better human experiences.</p>
          <Link href="/firstpass">
            Explore Firstpass
            <Arrow />
          </Link>
          <Link href="/synapse">
            Explore Synapse
            <Arrow />
          </Link>
          <Link href="/support/#contact-form">
            Talk to our team
            <Arrow />
          </Link>
        </aside>
        <article
          className="prose-document article-body"
          dangerouslySetInnerHTML={{ __html: post.body }}
        />
      </div>
      <section className="related-articles page-padding">
        <span className="eyebrow">Keep exploring</span>
        <div>
          {related.map((item) => (
            <Link href={`/blog/${item.slug}`} key={item.slug}>
              <span className="eyebrow">{item.category}</span>
              <h2>{item.title}</h2>
              <Arrow />
            </Link>
          ))}
        </div>
      </section>
      <PageCta title="A different perspective. A new possibility." />
    </div>
  );
}
