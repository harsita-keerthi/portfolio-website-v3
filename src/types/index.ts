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

export interface MediaItem {
  src: string;
  alt: string;
  caption?: string;
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
  projectTypes: string[];
  techStack: string[];
  gallery: MediaItem[];
  screenshots?: Screenshot[];
  githubUrl?: string;
  liveUrl?: string;
  featured?: boolean;
}

export interface EducationItem {
  id: string;
  title: string;
  subtitle?: string;
  dateLabel: string;
  image?: string;
  gallery?: MediaItem[];
  coursework: string[];
  activities: string[];
  honors: string[];
}

export interface ExperienceItem {
  id: string;
  title: string;
  organization?: string;
  dateLabel: string;
  location?: string;
  description: string;
  techStack: string[];
  gallery?: MediaItem[];
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

export type FolderId = "education" | "projects" | "experience";

export interface PortfolioUIState {
  openFolder: FolderId | null;
  openItemId: string | null;
}

export interface DockItemContent {
  id: FolderId;
  label: string;
}
