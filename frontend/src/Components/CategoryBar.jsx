import React from 'react';

// ✅ MUST DEFINE THIS OUTSIDE THE COMPONENT
const CATEGORIES = [
  "All", 
  "Technology", 
  "Science", 
  "Motivation", 
  "Data Structures", 
  "APIs", 
  "Music"
];

export default function CategoryBar({ activeCategory, setActiveCategory }) {
  return (
    <div className="sticky top-0  bg-white dark:bg-[#0f0f0f] px-4 py-3 flex gap-3 overflow-x-auto no-scrollbar scroll-smooth">
      {CATEGORIES.map((category) => (
        <button
          key={category}
          onClick={() => setActiveCategory(category)}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${
            activeCategory === category 
              ? "bg-black text-white dark:bg-white dark:text-black" 
              : "bg-[#f2f2f2] text-black dark:bg-[#272727] dark:text-white hover:bg-[#e5e5e5]"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}