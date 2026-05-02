"use client";
import React, { useState } from "react";
import { I_About } from "@/types/project";
import { bricolage_grotesque } from "@/utils/fonts";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { Badge, Separator } from "@radix-ui/themes";
import Title from "@/components/ui/Title";

const About = () => {
  const [isMore, setIsMore] = useState<boolean>(false);
  return (
    <div className="w-full px-64 max-[1285px]:px-52 max-lg:px-4 max-sm:px-5 flex flex-col items-center mt-4 pb-8">
      <Title title="The Evolution of My Tech Journey" />

      <div className="w-full pl-36 pr-28 max-sm:px-2">
        {data.slice(0, 3).map((item, idx) => (
          <div key={idx}>
            <h1
              className={`text-2xl max-sm:text-xl mt-8 font-medium ${bricolage_grotesque}`}
            >
              {item.year}
            </h1>
            <div className="flex pl-2 mt-4">
              <div className={`w-full flex flex-col gap-3`}>
                {item.events.map((event, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center gap-2 ${bricolage_grotesque}`}
                  >
                    <span>
                      <Separator
                        orientation="horizontal"
                        size="1"
                        className="w-8 bg-black dark:bg-gray-400"
                      />
                    </span>
                    <span className="text-[15px] max-sm:text-sm dark:text-[#dfdede]">
                      {event}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

        <div
          className={`flex justify-center mt-5 ${isMore ? "hidden" : "block"}`}
        >
          <Badge
            color="gray"
            variant="solid"
            highContrast
            onClick={() => setIsMore(true)}
            className={`text-xs max-sm:text-[10px] w-20 flex items-center text-center dark:hover:bg-gray-300 py-1 px-2 cursor-pointer hover:bg-gray-800 ${bricolage_grotesque}`}
          >
            <span>See More</span>
            <span className="!ml-[-3px] mt-[1px]">
              <ChevronDownIcon className="h-3 w-3 dark:!text-black !text-white  shrink-0 text-muted-foreground transition-transform duration-200" />
            </span>
          </Badge>
        </div>

        {isMore &&
          data.slice(3).map((item, idx) => (
            <div key={idx}>
              <h1
                className={`text-2xl mt-8 font-medium ${bricolage_grotesque}`}
              >
                {item.year}
              </h1>
              <div className="flex pl-2 mt-4">
                <div
                  className={`w-full flex flex-col gap-3 ${bricolage_grotesque}`}
                >
                  {item.events.map((event, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center gap-2 ${bricolage_grotesque}`}
                    >
                      <span>
                        <Separator
                          orientation="horizontal"
                          size="1"
                          className="w-8 bg-black dark:bg-gray-400"
                        />
                      </span>
                      <span className="text-[15px] dark:text-[#dfdede]">
                        {event}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}

        <div
          className={`flex justify-center mt-5 ${isMore ? "block" : "hidden"}`}
        >
          <Badge
            color="gray"
            variant="solid"
            highContrast
            onClick={() => setIsMore(false)}
            className={`text-xs max-sm:text-[10px] w-20 flex items-center text-center dark:hover:bg-gray-300 py-1 px-2 cursor-pointer hover:bg-gray-800 ${bricolage_grotesque}`}
          >
            <span>See Less</span>
            <span className="!ml-[-3px] mt-[1px]">
              <ChevronDownIcon className="rotate-180 h-3 w-3 dark:!text-black !text-white shrink-0 text-muted-foreground transition-transform duration-200" />
            </span>
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default About;

const data: I_About[] = [
  // {
  //   year: 2025,
  //   events: [
  //     "Building something impactful this year—pushing boundaries with innovative projects. 🚀",
  //   ],
  // },
  // {
  //   year: 2024,
  //   events: [
  //     "Dove deep into Web Development, mastered cutting-edge technologies, and built over 20 full-stack projects. 💻",
  //     "Started my journey in Web3 development, creating decentralized applications and exploring blockchain ecosystems. ⛓",
  //     "Optimized developer workflows using TurboRepo for scalable monorepos and faster builds. ⚙️",
  //     "Built real-time apps using WebSockets, enhancing user experience with instant collaboration features. 🔄",
  //     "Focused on delivering polished UIs with Tailwind CSS and shadcn/ui, combining design and performance. 🎨",
  //     "Implemented secure authentication and database management using NextAuth and modern backend stacks. 🔐",
  //   ],
  // },
  // {
  //   year: 2021,
  //   events: [
  //     "Started my BE in Computer Engineering with no prior programming background—quickly found passion in code. 🚀",
  //     "Bought my first laptop and self-taught C programming and web development—laying the foundation for everything. 💡",
  //     "Faced and overcame early challenges through consistent self-learning and problem-solving. 🔧",
  //     "Created my first dynamic web projects—turning concepts into real, functional apps. 🌐",
  //   ],
  // },
  // {
  //   year: 2020,
  //   events: [
  //     "Lockdown paused classroom learning—but sparked my self-learning journey through online resources and coding tutorials. 🌍",
  //     "Began exploring HTML, CSS, and JavaScript—my entry point into web development. 🧑‍💻",
  //   ],
  // },
  // {
  //   year: 2019,
  //   events: [
  //     "Completed 10th grade with 80%, and became increasingly curious about technology and digital systems. 📘",
  //     "Started experimenting with software tools, leading to my first exposure to how apps are built. 🛠️",
  //   ],
  // },
  // {
  //   year: 2017,
  //   events: [
  //     "Loved taking things apart to understand how they work—early signs of the engineer mindset. 🔍",
  //     "Built a DIY brake light system for my bicycle using basic electronics—my first real hands-on project. 🔧",
  //   ],
  // },
  // {
  //   year: 2015,
  //   events: [
  //     "Visited a cyber cafe and used a computer for the first time—it felt like magic. 💻",
  //     "Initially saw it as a gaming device, but that moment sparked a deeper interest that would later turn into a career. ✨",
  //   ],
  // },
  // {
  //   year: 2012,
  //   events: [
  //     "Started showing interest in problem-solving and logical thinking—often curious about how machines and systems work. 🤔",
  //   ],
  // },
  {
    year: 2003,
    events: [
      "Hello World in Jadhav Family 👶🏼🍼",
    ],
  },
];
