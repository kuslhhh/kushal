// app/blogs/page.tsx
import { getAllBlogs } from "../../../lib/getBlog";

export const dynamic = "force-dynamic"; // This ensures it's always run server-side

// eslint-disable-next-line @next/next/no-async-client-component
export default async function BlogsPage() {
  const blogs = await getAllBlogs();

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">All Blogs</h1>

      {blogs.length === 0 ? (
        <p className="text-gray-500">No blogs found.</p>
      ) : (
        <div className="space-y-6">
          {blogs.map((blog) => (
            <div
              key={blog.id}
              className="border border-gray-300 dark:border-gray-700 rounded-xl p-4 shadow-sm"
            >
              <h2 className="text-2xl font-semibold">{blog.title}</h2>
              <p className="mt-2 text-gray-700 dark:text-gray-300">
                {blog.content}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                {new Date(blog.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
