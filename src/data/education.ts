import type { EducationItem } from "@/types";

export const education: EducationItem[] = [
  {
    id: "university",
    title: "San Jose State University",
    subtitle: "BS in Computer Science",
    dateLabel: "2022-2026",
    gallery: [
      {
        src: "/placeholders/folders/education/towerlawn.jpg",
        alt: "Tower Lawn at SJSU",
      },
    ],
    coursework: ["Data Structures and Algorithms", "Objected Oriented Programming", 
        "Database Management Systems", "Operating Systems", "Artificial Intelligence", 
        "Computer Architecture", "Information Security"],
    activities: ["Girls Who Code SJSU", "MESA", "Society of Women Engineers", 
        "Project Engineering Success", "Her Campus SJSU"],
    honors: ["President's Scholar", "Dean's Scholar", "Magna Cum Laude Honors"],
  },
  {
    id: "additional-program",
    title: "Georgia Tech",
    subtitle: "MS in Computer Science",
    dateLabel: "2026-2028",
    coursework: ["Graduate Algorithms", "Software Engineering Processes"],
    activities: [],
    honors: [],
  },
  {
    id: "certification",
    title: "Cornell Tech",
    subtitle: "Machine Learning Foundations",
    dateLabel: "2024",
    image: "/placeholders/folders/education/cornell-certificate.png",
    coursework: ["Supervised Learning", "Unsupervised Learning", "Neural Networks", "Statistical Learning"],
    activities: [],
    honors: [],
  },
];
