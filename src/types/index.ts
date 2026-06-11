/**
 * Portfolio v3 Type Definitions
 */

export interface Profile {
  name: string;
  role: string;
  introduction: string;
  location: string;
  profileImage?: string;
  socials: Social[];
  email?: string;
  resumeUrl?: string;
}

export interface Social {
  name: string;
  url: string;
  icon?: string;
}

export interface Screenshot {
  src: string;
  alt: string;
}

export type ProjectContext =
  | "sjsu"
  | "gtech"
  | "research"
  | "internship"
  | "personal";

export interface Project {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  role: string;
  dateLabel: string;
  context: ProjectContext;
  disciplines: string[];
  techStack: string[];
  screenshots?: Screenshot[];
  githubUrl?: string;
  liveUrl?: string;
  featured?: boolean;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  year: number;
  endYear?: number;
  description?: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  description: string;
  technologies: string[];
  startYear: number;
  endYear?: number;
  current?: boolean;
}

export interface Skill {
  category: string;
  items: string[];
}

export interface WidgetList {
  title: string;
  items: string[];
}

export interface ResumeContent {
  title: string;
  summary: string;
  viewLabel: string;
  downloadLabel: string;
  unavailableLabel: string;
}

export interface HomeWidgetContent {
  profile: {
    body: string;
  };
  technicalSkills: WidgetList;
  resume: ResumeContent;
}

export interface DockItemContent {
  id: "education" | "projects" | "experience";
  label: string;
}
