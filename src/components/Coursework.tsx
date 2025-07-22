"use client";

import { MagicCard } from "./ui/magic-card";
import Image from "next/image";
import { Link } from "@radix-ui/themes";
import { I_Coursework } from "@/types/project";
import { inter, bricolage_grotesque } from "@/utils/fonts";
import Title from "./ui/Title";
import { useDarkMode } from "@/hooks/useDarkMode";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Coursework = () => {
  const { isDarkMode } = useDarkMode();
  return (
    <div className="w-1/2 max-lg:w-full max-lg:px-20 max-sm:w-full max-sm:px-5 flex flex-col items-center mt-4 pb-8">
      <Title title="Coursework" />

      <span className="mt-2"></span>
      {data.map((course, idx) => (
        <MagicCard
          key={idx}
          className="cursor-pointer dark:shadow-2xl h-fit mt-2 !bg-transparent border-none"
          gradientColor={`${
            isDarkMode ? "#262626" : "rgba(197, 241, 241, 0.4)"
          }`}
        >
          <div className="flex !justify-between w-[50vw] max-lg:w-full max-sm:w-full px-5 max-sm:px-0 py-3">
            <div className="w-full flex">
              <div className="w-24 h-12 flex justify-center">
                <Link href={course.course_link} target="_blank">
                  <Image
                    src={course.course_company_logo}
                    alt="100xdevs"
                    width={50}
                    height={50}
                    className="rounded-full"
                  />
                </Link>
              </div>
              <div className="w-full">
                <Accordion type="single" collapsible>
                  <AccordionItem value="item-1">
                    <div
                      className={`max-lg:w-[68vw] w-full flex justify-between max-[350px]:justify-start ${bricolage_grotesque}`}
                    >
                      <AccordionTrigger>
                        <h2 className="text-base max-sm:text-[15px] font-semibold text-start">
                          {course.course_title}
                        </h2>
                      </AccordionTrigger>
                      <span className="text-xs max-sm:text-[10px] max-sm:hidden pr-1">
                        {course.duration}
                      </span>
                    </div>
                    <p className={`text-sm max-sm:text-xs ${inter}`}>
                      {course.course_company_name}{" "}
                    </p>
                    <AccordionContent className="mt-2 max-sm:text-[11px]">
                      {course.description}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          </div>
        </MagicCard>
      ))}
    </div>
  );
};

export default Coursework;

const data: I_Coursework[] = [
  {
    course_link: "https://app.100xdevs.com/",
    course_company_logo: "/100xdevs.jpeg",
    course_title: "Full Stack + DevOps + Web3",
    duration: "Aug 2024 - March 2025",
    course_company_name: "100xdevs",
    description:
      "In this cohort, I expanded my Full Stack Development skills by diving into DevOps and Web3 technologies. Led by Harkirat Singh, the course covered CI/CD, cloud infrastructure. It provided hands-on experience with advanced tools and techniques, enhancing my proficiency in modern development practices.",
  },
  {
    course_link: "https://www.fullstackgurupune.com//",
    course_company_logo: "/fullstack.png",
    course_title: "Data Science",
    duration: "May 2025",
    course_company_name: "Fullstack Guru",
    description:
      "In this cohort, I deepened my Data Science expertise by mastering end-to-end workflows — from data wrangling to model deployment. I gained hands-on experience with tools like Pandas, NumPy, Scikit-learn, and visualization libraries, sharpening my ability to extract insights and build predictive models in production-ready environments.",
  },
];
