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
    projectTypes: ["Web", "Product"],
    techStack: ["React", "TypeScript", "Tailwind CSS"],
    gallery: [
      {
        src: "/placeholders/folders/projects/project-01.svg",
        alt: "Abstract placeholder artwork for Project One",
        caption: "Project visual",
      },
      {
        src: "/placeholders/folders/projects/project-02.svg",
        alt: "Second abstract placeholder artwork for Project One",
        caption: "Alternate view",
      },
    ],
    // TODO: Replace placeholder URLs when real project links are imported.
    githubUrl: "https://example.com",
    liveUrl: "https://example.com",
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
    projectTypes: ["Full Stack"],
    techStack: ["Next.js", "TypeScript", "Node.js"],
    gallery: [
      {
        src: "/placeholders/folders/projects/project-03.svg",
        alt: "Abstract placeholder artwork for Project Two",
      },
    ],
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
    projectTypes: ["Data"],
    techStack: ["React", "Node.js", "PostgreSQL"],
    gallery: [],
  },
];
