import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { formatDate } from "@/utils/formatdate";
import { calculateReadingTime } from "@/utils/blogReadingTime";
import { bricolage_grotesque } from "@/utils/fonts";
import BlogPage from "./components/BlogPage";

export const dynamic = "force-dynamic";

interface Props {
  params: { blogid: string };
}

export default async function BlogDetailPage({ params }: Props) {
  const blog = await prisma.blog.findUnique({
    where: { id: params.blogid },
  });

  if (!blog) {
    notFound();
  }

  const readingTime = calculateReadingTime(blog.content);

  return (
    <main className="w-full mt-32 flex flex-col items-center pb-16">
      <div className="px-80 max-[1285px]:px-60 max-lg:px-20 max-sm:px-4 w-full">
        {/* Title */}
        <h1
          className={`text-4xl max-sm:text-2xl font-extrabold dark:text-white text-black ${bricolage_grotesque}`}
        >
          {blog.title}
        </h1>

        {/* Meta */}
        <div className="mt-4 flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
          <span className="font-semibold">{blog.author}</span>
          <span>·</span>
          <span>{formatDate(blog.createdAt.toISOString())}</span>
          <span>·</span>
          <span>{readingTime}</span>
        </div>

        {/* Cover image */}
        {blog.image_public_id && (
          <div className="mt-8 w-full flex justify-center">
            <BlogPage public_id={blog.image_public_id} />
          </div>
        )}

        {/* Content */}
        <div
          className={`prose dark:prose-invert max-w-none mt-10 ${bricolage_grotesque}`}
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </div>
    </main>
  );
}
