// app/blogs/page.tsx

export const dynamic = "force-dynamic";

import React from "react";

type Blog = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
};

async function getBlogs(): Promise<Blog[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/blogs`, {
      cache: "no-store", // ensure fresh data
    });

    const data = await res.json();
    return data?.message || [];
  } catch (error) {
    console.error("Error while fetching the blogs:", error);
    return [];
  }
}

export default async function BlogPage() {
  const blogs = await getBlogs();

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">📝 All Blogs</h1>
      {blogs.length === 0 ? (
        <p className="text-gray-500">No blogs found.</p>
      ) : (
        <ul className="space-y-6">
          {blogs.map((blog) => (
            <li
              key={blog.id}
              className="border border-gray-200 dark:border-gray-700 p-5 rounded-xl shadow-md"
            >
              <h2 className="text-xl font-semibold mb-1">{blog.title}</h2>
              <p className="text-sm text-gray-500 mb-3">
                {new Date(blog.createdAt).toLocaleDateString()}
              </p>
              <p>{blog.content}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
