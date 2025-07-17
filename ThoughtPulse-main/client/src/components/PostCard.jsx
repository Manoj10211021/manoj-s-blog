import { Link } from "react-router-dom";

export default function PostCard({ post }) {
    return (
        <div className="group relative w-full border border-teal-500  hover:border-2 h-[335px] overflow-hidden rounded-lg sm:w-[250px] transition-all">
            <Link to={`/post/${post.slug}`}>
                <img
                    src={post.image}
                    alt={post.title}
                    className='h-[225px] w-full object-cover group-hover:h-[200px] transition-all duration-300 z-20'
                />
            </Link>
            <div className="p-3 flex flex-col gap-2">
                <p className="text-lg font-semibold line-clamp-1">{post.title}</p>
                {/* add category tags here */}
                <div className="flex flex-wrap gap-2 text-sm italic">
                    {post.category && post.category.slice(0, 2).map((category, index) => (
                        <span
                            key={index}
                            className=" bg-gray-300 dark:bg-gray-600 text-xs font-semibold px-2 py-1 rounded-full"
                        >
                            {category.name || category}
                        </span>
                    ))}
                    {post.category && post.category.length > 2 && (
                        <span className=" bg-gray-300 dark:bg-gray-600 text-xs font-semibold px-2 py-1 rounded-full">
                            +{post.category.length - 2}
                        </span>
                    )}
                </div>
                <Link
                    to={`/post/${post.slug}`}
                    className='z-10 group-hover:bottom-0 absolute bottom-[-200px] left-0 right-0 border border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white transition-all duration-300 text-center py-2 rounded-md !rounded-tl-none m-2'
                >
                    Read article
                </Link>
            </div>
        </div>
    )
}
