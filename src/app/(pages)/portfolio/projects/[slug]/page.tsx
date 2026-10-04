import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProjectDetail from "@/components/pages/project-detail";
import { profile, projects } from "@/config/portfolio-data";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return projects.map((p) => ({ slug: p.id }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.id === slug);
  if (!project) return {};
  return {
    title: `${project.title} | ${profile.name}`,
    description: project.summary,
  };
}

const Page = async ({ params }: { params: Promise<Params> }) => {
  const { slug } = await params;
  const index = projects.findIndex((p) => p.id === slug);
  if (index === -1) notFound();

  const prev = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];

  return <ProjectDetail project={projects[index]} prev={prev} next={next} />;
};

export default Page;
