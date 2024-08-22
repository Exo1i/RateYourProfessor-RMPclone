"use client";
import Image from "next/image";
import { useState } from "react";
export default function Chat() {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div>
      {isOpen && (
        <div className="fixed bottom-16 mb-8 right-4 w-80 h-96 bg-white shadow-lg rounded-lg p-4">
          {/* content goes here */}
          <p>Chat with bot...</p>
        </div>
      )}

      <button
        onClick={handleClick}
        className="fixed bottom-4 right-4 p-3 bg-black text-white rounded-full shadow-lg hover:bg-gray-600 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="lucide lucide-circle-alert"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" x2="12" y1="8" y2="12" />
          <line x1="12" x2="12.01" y1="16" y2="16" />
        </svg>
      </button>
    </div>
  );
}
