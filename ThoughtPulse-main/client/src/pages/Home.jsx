import React from 'react';
import { Typewriter } from 'react-simple-typewriter';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';

const Home = () => {
    const { theme } = useSelector(state => state.theme);

    return (
        <div className={'relative min-h-screen flex items-center justify-center bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100'}>
            {/* Background Animation */}
            <motion.div
                className="absolute inset-0 "
                animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
                transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
            ></motion.div>

            <div className="relative z-10 flex flex-col items-center justify-center p-2 text-center">
                {/* Header Animation */}
                <motion.h1
                    className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500 mb-6"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                >
                    Welcome to <br />
                    <span className="inline-block">
                        <Typewriter
                            words={['Innovative Ideas', 'Creative Solutions', 'Future Trends', 'Tech Insights']}

                            loop={0}
                            cursor
                            cursorStyle='|'
                            typeSpeed={60}
                            deleteSpeed={40}
                            delaySpeed={1000}
                        />
                    </span>
                </motion.h1>

                {/* Paragraph Animation */}
                <motion.p
                    className="text-lg md:text-xl mb-8 max-w-md mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: 'easeOut', delay: 0.5 }}
                >
                    Discover amazing content and stay updated with our latest posts.
                </motion.p>

                {/* Button Animation */}
                <motion.a
                    href="/blogs"
                    className="inline-block px-6 py-3 bg-teal-500 text-white rounded-full shadow-lg hover:bg-teal-600 transition duration-300 transform hover:scale-110"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, ease: 'easeOut', delay: 1 }}
                >
                    Explore Now
                </motion.a>
            </div>
        </div>
    );
};

export default Home;
