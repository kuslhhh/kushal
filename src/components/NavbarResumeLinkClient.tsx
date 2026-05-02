"use client";

import { Link, Tooltip } from "@radix-ui/themes";
import { FileIcon } from "@radix-ui/react-icons";

export default function NavbarResumeLinkClient({ href }: { href: string }) {
    // Always link to the /resume viewer page, not directly to the file
    void href; // kept as prop for future use (e.g. prefetch hint)
    return (
        <Link href="/resume" underline="none">
            <Tooltip content="Resume">
                <div className="hover:px-3 max-sm:hover:px-2 py-2.5 dark:hover:bg-[#262626] hover:bg-[#F4F4F5] rounded-full transition-all duration-300">
                    <FileIcon className="w-[19px] h-[19px] max-sm:h-[15px] max-sm:w-[15px] text-black dark:text-white" />
                </div>
            </Tooltip>
        </Link>
    );
}
