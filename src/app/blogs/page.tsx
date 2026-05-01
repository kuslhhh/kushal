// app/blogs/page.tsx
import React, { Suspense } from "react";
import BlogList from "./components/BlogList";
import BlogSkeleton from "./components/BlogSkeleton";
import ClientWrapper from "./components/ClientWrapper";
import Title from "@/components/ui/Title";

export const dynamic = "force-dynamic";

export default function BlogPage() {
  return (
    <ClientWrapper>
      <div className="w-full flex flex-col items-center">
        <Title title="Blogs" />
        <Suspense fallback={<BlogSkeleton />}>
          <BlogList />
        </Suspense>
      </div>
    </ClientWrapper>
  );
}
