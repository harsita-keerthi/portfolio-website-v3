import type { Project } from "@/types";

export const projects: Project[] = [
  {
    id: "project-1",
    slug: "project-one",
    title: "Project One",
    shortDescription: "A creative engineering project showcasing design and technology",
    description:
      "A comprehensive project demonstrating technical ability and creative vision",
    role: "Lead Developer",
    dateLabel: "2024",
    context: "personal",
    disciplines: ["Design", "Frontend", "Engineering"],
    techStack: ["React", "TypeScript", "Tailwind CSS"],
    featured: true,
  },
  {
    id: "project-2",
    slug: "project-two",
    title: "Project Two",
    shortDescription: "Another innovative project demonstrating technical ability",
    description: "An innovative solution combining imagination with technical implementation",
    role: "Full Stack Developer",
    dateLabel: "2023",
    // TODO: Replace with the real context when portfolio project content is imported.
    context: "personal",
    disciplines: ["Design", "Frontend", "Backend"],
    techStack: ["Next.js", "TypeScript", "Node.js"],
  },
  {
    id: "project-3",
    slug: "project-three",
    title: "Project Three",
    shortDescription: "A project combining imagination with technical implementation",
    description:
      "Full-stack project showcasing architectural design and scalability considerations",
    role: "Full Stack Engineer",
    dateLabel: "2023",
    // TODO: Replace with the real context when portfolio project content is imported.
    context: "personal",
    disciplines: ["Backend", "Architecture", "DevOps"],
    techStack: ["React", "Node.js", "PostgreSQL"],
  },
];
