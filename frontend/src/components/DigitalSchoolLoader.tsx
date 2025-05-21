import React from "react";
import { motion } from "framer-motion";

const DigitalSchoolLoader = () => {
  const letters = "Digital School".split("");
  const colors = [
    "#3B82F6", // blue-500
    "#10B981", // emerald-500
    "#F59E0B", // amber-500
    "#6366F1", // indigo-500
    "#EC4899", // pink-500
    "#14B8A6", // teal-500
    "#F97316", // orange-500
    "#8B5CF6", // violet-500
  ];

  const containerVariants = {
    start: {
      transition: {
        staggerChildren: 0.1,
      },
    },
    end: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const letterVariants = {
    start: {
      y: 0,
      opacity: 0,
    },
    end: {
      y: [0, -20, 0],
      opacity: 1,
      transition: {
        y: {
          repeat: Infinity,
          repeatType: "reverse",
          duration: 1.5,
          ease: "easeInOut",
        },
        opacity: {
          duration: 0.5,
        },
      },
    },
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
      <motion.div
        className="flex mb-8"
        variants={containerVariants}
        initial="start"
        animate="end"
      >
        {letters.map((letter, index) => (
          <motion.span
            key={index}
            className="text-4xl md:text-6xl font-bold"
            style={{ color: colors[index % colors.length] }}
            variants={letterVariants}
          >
            {letter === " " ? "\u00A0" : letter}
          </motion.span>
        ))}
      </motion.div>
      
      <div className="relative w-64 h-2 bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-purple-600"
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />
      </div>
      
      <p className="mt-8 text-gray-400 text-lg">
        Loading your learning experience...
      </p>
    </div>
  );
};

export default DigitalSchoolLoader;