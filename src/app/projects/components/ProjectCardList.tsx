"use client";

import { Project } from "@/types/project";
import ProjectCard from "./ProjectCard";
import Title from "@/components/ui/Title";
import SimpleProjectCard from "@/components/SimpleProjectCard";

const ProjectCardList = () => {
  return (
    <div className="w-full h-fit px-64 max-[1025px]:px-4 max-[1285px]:px-40 max-lg:px-0 max-sm:px-4 flex flex-col items-center mt-4 pb-8">
      <Title title="Projects" />
      <SimpleProjectCard />

      <div className="flex w-full flex-col gap-4 lg:flex-row mt-4 px-32 max-lg:px-0 max-sm:px-0 flex-wrap items-center ml-14 max-sm:ml-0 max-lg:ml-0 max-[350px]:mr-5 max-[321px]:mr-10">
        {data.map((project: Project, idx: number) => (
          <ProjectCard
            key={idx}
            logo={project.logo}
            title={project.title}
            description={project.description}
            techStack={project.techStack}
            link={project.link}
            source={project.source}
          />
        ))}
      </div>
    </div>
  );
};

export default ProjectCardList;

const data: Project[] = [
   {
    logo: "/saransh.png",
    title: "Saranslh",
    description:
      "This is an article summarizer web application powered by OpenAI's Chat GPT 4 API. Say goodbye to long hours of reading articles; let Saranslh do the summarizing for you!",
    techStack: ["NextJs","TailwindCss", "TypeScript", "OpenAI"],
    link: "https://saranslh.vercel.app/",
    source: "https://github.com/kuslhhh/saransh",
  },
  {
    logo: "/dochub.png",
    title: "Dochub",
    description:
      "A fully functional note-taking application with features like real-time collaboration, intelligent search, and seamless file sharing. It makes daily note-taking easy and comfortable for all users — a perfect tool to stay organized every day.",
    techStack: ["Next.js", "TypeScript", "Shadcn", "Convex"],
    link: "https://dochulb.vercel.app/",
    source: "https://github.com/kuslhhh/dochub",
  },
  {
    logo: "/urbanalysis.png",
    title: "Urbanalysis",
    description: "Pollution trends in pune",
    techStack: ["Jupitor Notebook","Python", "Pandas", "Seaborn", "matplotlib"],
    // link: "https://",
    source: "https://github.com/kuslhhh/urbanalysis",
  },
  {
    logo: "/npm.png",
    title: "KSH-CLI",
    description: "KSH CLI is a command-line tool designed for Windows users who want to run bash-like commands directly in PowerShell.",
    techStack: ["JavaScript"],
    link: "https://www.npmjs.com/package/ksh-bash",
    source: "https://github.com/kuslhhh/KSH-CLI",
  },

  // {
  //   logo: "/.png",
  //   title: "",
  //   description: "",
  //   techStack: ["","", "", ""],
  //   link: "https://",
  //   source: "https://",
  // },
];
