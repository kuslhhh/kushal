import { Blog } from '@/types/project'
import BlogCard from './BlogCard'
import { prisma } from '@/lib/prisma'

async function getBlogs(): Promise<Blog[]> {
    try {
        const blogs = await prisma.blog.findMany({
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                title: true,
                content: true,
                createdAt: true,
                author: true,
                image_public_id: true,
            },
        });
        // Convert Date to string for the client component
        return blogs.map((b) => ({
            ...b,
            createdAt: b.createdAt.toISOString(),
        }));
    } catch (error) {
        console.error(`Error while fetching the blogs: ${error}`);
        return [];
    }
}

async function BlogList() {
    const blogs = await getBlogs();

    if (blogs.length === 0) {
        return (
            <div className='w-full flex justify-center mt-10'>
                <p className='text-gray-500'>No blogs yet. Check back soon!</p>
            </div>
        );
    }

    return (
        <div className='w-full px-64 max-[1025px]:px-0 max-[1285px]:px-0 max-sm:px-2 flex flex-col gap-6 items-center mt-4 pb-8 max-sm:overflow-hidden'>
            {blogs.map((blog: Blog, idx: number) => (
                <BlogCard
                    key={idx}
                    title={blog.title}
                    createdAt={blog.createdAt}
                    content={blog.content}
                    id={blog.id}
                    author={blog.author}
                />
            ))}
        </div>
    )
}

export default BlogList