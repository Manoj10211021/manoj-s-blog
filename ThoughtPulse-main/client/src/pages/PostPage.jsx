import { Button, Spinner } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import CommentSection from '../components/CommentSection';
import PostCard from '../components/PostCard';

export default function PostPage() {
    const { postSlug } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [post, setPost] = useState(null);
    const [recentPosts, setRecentPosts] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/post/getposts?slug=${postSlug}`);
                const data = await res.json();
                if (!res.ok) {
                    setError(true);
                    setLoading(false);
                    return;
                }
                setPost(data.posts[0]);
                setLoading(false);
            } catch (err) {
                setError(true);
                setLoading(false);
            }
        };
        fetchPost();
    }, [postSlug]);

    useEffect(() => {
        try {
            const fetchRecentPosts = async () => {
                const res = await fetch(`/api/post/getposts?limit=3`);
                const data = await res.json()
                if (res.ok) {
                    setRecentPosts(data.posts)
                }
            }
            fetchRecentPosts()

        } catch (err) {
            console.log(err.message)
        }

    }, [])
    // console.log(recentPosts)

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Spinner size="xl" />
            </div>
        );
    }
    const duration = (post.content.length / 238).toFixed(0)
    return (
        <main className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto min-h-screen flex flex-col">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-center mb-6">
                {post && post.title}
            </h1>
            <div className="flex flex-wrap justify-center gap-3 mb-6">
                {post && post.category.map((item, index) => (
                    <Link
                        key={index}
                        to={`/search?category=${item}`}
                        className="inline-block"
                    >
                        <span className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-100 px-4 py-2 rounded-full text-sm font-semibold hover:bg-gray-300 dark:hover:bg-gray-600">
                            {item}
                        </span>
                    </Link>
                ))}
            </div>
            {post && (
                <img
                    src={post.image}
                    alt={post.title}
                    className="mt-6 max-h-[400px] sm:max-h-[600px] w-full object-cover rounded-lg"
                />
            )}
            <div className="flex flex-col sm:flex-row sm:justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs mb-6">
                <span className="text-sm text-gray-600 dark:text-gray-300">
                    {post && new Date(post.createdAt).toLocaleDateString()}
                </span>
                <span className="text-sm italic text-gray-600 dark:text-gray-300">
                    {post && (duration === "0" ? 1 : duration)} mins read
                </span>
            </div>
            <div
                className='p-4 max-w-4xl mx-auto w-full post-content'
                dangerouslySetInnerHTML={{ __html: post && post.content }}
            ></div>
            <CommentSection postId={post._id} />
            <div className="flex flex-col justify-center items-center mb-5">
                <h1 className='text-xl mt-5'>Recent articles</h1>
                <div className="flex flex-wrap gap-4 mt-5 justify-center">
                    {
                        recentPosts &&
                        recentPosts.map((post) =>
                            <PostCard
                                key={post._id}
                                post={post}
                            />

                        )
                    }
                </div>
            </div>
        </main>
    );
}
