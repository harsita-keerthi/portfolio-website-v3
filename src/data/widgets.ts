import type { DockItemContent, HomeWidgetContent } from "@/types";

export const homeWidgetContent: HomeWidgetContent = {
  profile: {
    body: "Building thoughtful interfaces where engineering, product sense, and imagination meet.",
  },
  technicalSkills: {
    title: "Skills",
    items: [
      "Python",
      "Java",
      "JavaScript",
      "HTML",
      "CSS",
      "Next.js",
      "TypeScript",
      "React",
      "Node.js",
      "SQL",
    ],
  },
  resume: {
    title: "Resume",
    summary: "Selected work and experience",
    viewLabel: "View",
    downloadLabel: "Download",
    unavailableLabel: "Resume PDF coming soon",
  },
};

export const dockItems: DockItemContent[] = [
  { id: "education", label: "Education" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
];
