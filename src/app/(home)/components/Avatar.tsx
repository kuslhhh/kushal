"use client";
import React from "react";
import { Link, Avatar as Picture } from "@radix-ui/themes";

const Avatar = () => {
  return (
    <Link
      href="https://x.com/intent/follow?screen_name=Kuslhhh18"
      target="_blank"
    >
      <Picture src="/space.jpeg" fallback="K" size="7" radius="small" />
    </Link>
  );
};

export default Avatar;
