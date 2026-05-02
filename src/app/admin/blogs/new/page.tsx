import CreateBlog from "@/app/blogs/add/components/CreateBlog";

export default function NewBlogPage() {
    return (
        <div className="max-w-4xl">
            <h1 className="text-3xl font-bold dark:text-white text-black mb-8">
                New Blog Post
            </h1>
            <CreateBlog />
        </div>
    );
}
