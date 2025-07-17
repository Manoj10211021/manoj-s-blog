import { Button, Select, TextInput } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PostCard from '../components/PostCard';

export default function Blogs() {
    const [sidebarData, setSidebarData] = useState({ searchTerm: '', sort: 'desc', category: '' });
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showMore, setShowMore] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();

    const categorytags = [
        'Algorithms', 'Data Structures', 'Machine Learning', 'Artificial Intelligence', 'Web Development',
        'Cybersecurity', 'Database Systems', 'Operating Systems', 'Computer Networks', 'Software Engineering',
        'Cloud Computing', 'Big Data', 'Blockchain', 'Computer Vision', 'Natural Language Processing'
    ];

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm') || '';
        const sortFromUrl = urlParams.get('sort') || 'desc';
        const categoryFromUrl = urlParams.get('category') || '';

        setSidebarData({
            searchTerm: searchTermFromUrl,
            sort: sortFromUrl,
            category: categoryFromUrl,
        });

        const fetchPosts = async () => {
            setLoading(true);
            const searchQuery = urlParams.toString();
            const res = await fetch(`/api/post/getposts?${searchQuery}`);
            if (res.ok) {
                const data = await res.json();
                setPosts(data.posts);
                setShowMore(data.posts.length === 12);
            }
            setLoading(false);
        };
        fetchPosts();
    }, [location.search]);

    const updateUrlParams = (newData) => {
        const urlParams = new URLSearchParams(newData);
        navigate(`/blogs?${urlParams.toString()}`);
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        const newSidebarData = { ...sidebarData, [id]: value };
        setSidebarData(newSidebarData);
        updateUrlParams(newSidebarData);
    };

    const handleClearFilters = () => {
        setSidebarData({ searchTerm: '', sort: 'desc', category: '' });
        updateUrlParams('');
    };

    const handleShowMore = async () => {
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('startIndex', posts.length);
        const searchQuery = urlParams.toString();
        const res = await fetch(`/api/post/getposts?${searchQuery}`);
        if (res.ok) {
            const data = await res.json();
            setPosts((prevPosts) => [...prevPosts, ...data.posts]);
            setShowMore(data.posts.length === 12);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">

            <div className="flex flex-col md:flex-row container mx-auto py-3">
                {/* Sidebar */}
                <div className="flex-1md:w-0.5/4 md:min-h-screen p-5 bg-white dark:bg-gray-800 border rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold mb-4 border-b border-gray-300 dark:border-gray-600">
                        Filters
                    </h2>
                    <form className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <label htmlFor="searchTerm" className="font-semibold text-gray-700 dark:text-gray-300">
                                Search Term:
                            </label>
                            <TextInput
                                id="searchTerm"
                                placeholder="Search..."
                                value={sidebarData.searchTerm}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="sort" className="font-semibold text-gray-700 dark:text-gray-300">
                                Sort:
                            </label>
                            <Select id="sort" value={sidebarData.sort} onChange={handleChange}>
                                <option value="desc">Latest</option>
                                <option value="asc">Oldest</option>
                            </Select>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="category" className="font-semibold text-gray-700 dark:text-gray-300">
                                Category:
                            </label>
                            <Select
                                id="category"
                                value={sidebarData.category}
                                onChange={handleChange}
                            >
                                <option value="">Choose Tags</option>
                                {categorytags.map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </Select>
                        </div>
                        <Button gradientDuoTone="purpleToPink" onClick={handleClearFilters}>
                            Clear Filters
                        </Button>
                    </form>
                </div>

                {/* Posts Section */}
                <div className="flex-4 md:w-3/4 p-5 bg-white dark:bg-gray-800 border rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold mb-4 border-b border-gray-300 dark:border-gray-600">
                        Post Results:
                    </h2>
                    <div className="flex flex-wrap gap-4">
                        {loading && <p className="text-xl text-gray-500 dark:text-gray-400">Loading...</p>}
                        {!loading && posts.length === 0 && (
                            <p className="text-xl text-gray-500 dark:text-gray-400">No posts found.</p>
                        )}
                        {!loading && posts.map((post) => (
                            <PostCard key={post._id} post={post} />
                        ))}
                        {showMore && (
                            <button
                                onClick={handleShowMore}
                                className="text-teal-500 text-lg hover:underline w-full mt-4"
                            >
                                Show More
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
