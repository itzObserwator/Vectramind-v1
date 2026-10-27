import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { firstpassModules } from "@/content/firstpass-modules";
import { FirstpassModulePage } from "@/components/pages/firstpass-module-page";

export const dynamicParams = false;
export function generateStaticParams() {
  return firstpassModules.map(({ slug }) => ({ module: slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ module: string }>;
}): Promise<Metadata> {
  const { module } = await params;
  const content = firstpassModules.find(({ slug }) => slug === module);
  return {
    title: content
      ? `${content.name} — Firstpass — Vectramind`
      : "Module not found",
    description: content?.introduction,
  };
}
export default async function Page({
  params,
}: {
  params: Promise<{ module: string }>;
}) {
  const { module } = await params;
  const content = firstpassModules.find(({ slug }) => slug === module);
  if (!content) notFound();
  return <FirstpassModulePage content={content} />;
}
