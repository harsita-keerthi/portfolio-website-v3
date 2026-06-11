import type { EducationItem } from "@/types";

export const education: EducationItem[] = [
  {
    id: "university",
    title: "University",
    subtitle: "Program title",
    dateLabel: "",
    gallery: [
      {
        src: "/placeholders/folders/education/university.svg",
        alt: "Abstract placeholder artwork for university education",
      },
    ],
    coursework: ["Coursework 01", "Coursework 02"],
    activities: ["Activity 01"],
    honors: ["Honor 01"],
  },
  {
    id: "additional-program",
    title: "Additional Program",
    dateLabel: "",
    coursework: ["Coursework 01"],
    activities: [],
    honors: [],
  },
  {
    id: "certification",
    title: "Certification",
    dateLabel: "",
    image: "/placeholders/folders/education/certification.svg",
    coursework: [],
    activities: [],
    honors: ["Credential 01"],
  },
];
