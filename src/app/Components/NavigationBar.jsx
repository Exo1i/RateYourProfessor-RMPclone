"use client";
import Image from "next/image";
import {useState} from "react";
import {SignedOut, SignInButton, SignUpButton} from "@clerk/nextjs";
import {searchRPM} from "@/app/Components/searchRPM";

export default function NavigationBar() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleSearch = async (event) => {
        event.preventDefault();
        const results = await searchRPM(searchTerm); // Assuming departmentID is not provided
        setSearchResults(results);
        console.log("Search results: ", results);
    };

    return (
        <nav className="bg-black fixed w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600 fixed">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-2">
                <a href="#" className="flex items-center space-x-3 rtl:space-x-reverse">
                    <Image src="/exo.png" width={80} height={10} alt="EXO" />
                </a>
                <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
                    <SignedOut>
                        <SignInButton>
                            <button
                                type="button"
                                className="text-white  hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-2.5 me-2 m-2 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
                            >
                                Log In
                            </button>
                        </SignInButton>
                        <SignUpButton>
                            <button
                                type="button"
                                className="text-white border border-gray-300 focus:outline-none hover:bg-gray-100 hover:text-black dark:hover:text-white focus:ring-4 focus:ring-gray-100 font-medium rounded-full text-sm px-5 py-2.5 me-2 m-2 dark:text-white dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                            >
                                Sign Up
                            </button>
                        </SignUpButton>
                    </SignedOut>
                </div>
                <div
                    className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
                    id="navbar-sticky"
                >
                    <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg  md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 ">
                        <button
                            id="dropdownNavbarLink"
                            data-dropdown-toggle="dropdownNavbar"
                            onClick={toggleDropdown}
                            className="flex items-center justify-between w-full py-2 px-3 text-white rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 md:w-auto dark:text-white md:dark:hover:text-blue-500 dark:focus:text-white dark:border-gray-700 dark:hover:bg-gray-700 md:dark:hover:bg-transparent"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="inline mr-3 lucide lucide-glasses"
                            >
                                <circle cx="6" cy="15" r="4" />
                                <circle cx="18" cy="15" r="4" />
                                <path d="M14 15a2 2 0 0 0-2-2 2 2 0 0 0-2 2" />
                                <path d="M2.5 13 5 7c.7-1.3 1.4-2 3-2" />
                                <path d="M21.5 13 19 7c-.7-1.3-1.5-2-3-2" />
                            </svg>
                            Professors{" "}
                            <svg
                                className="w-2.5 h-2.5 ms-2.5"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 10 6"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="m1 1 4 4 4-4"
                                />
                            </svg>
                        </button>
                        <div
                            id="dropdownNavbar"
                            className={`absolute top-full z-10 font-normal bg-white divide-gray-100 shadow w-44 dark:bg-gray-700 dark:divide-gray-600 ${
                                isDropdownOpen ? "block" : "hidden"
                            }`}
                        >
                            <ul
                                className="bg-black py-2 text-sm text-white"
                                aria-labelledby="dropdownLargeButton"
                            >
                                <li>
                                    <a href="#" className="block px-4 py-2 hover:bg-gray-100">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="inline mr-2"
                                        >
                                            <path
                                                d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z" />
                                            <path d="M22 10v6" />
                                            <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" />
                                        </svg>
                                        Schools
                                    </a>
                                </li>
                            </ul>
                            <div className="py-1">
                                <a
                                    href="#"
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                                >
                                    Sign out
                                </a>
                            </div>
                        </div>
                        <li>
                            <form className="flex items-center max-w-sm mx-auto" onSubmit={handleSearch}>
                                <label htmlFor="simple-search" className="sr-only">Search</label>
                                <div className="relative w-full">
                                    <input
                                        type="text"
                                        id="simple-search"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:border-gray-600 dark:text-black rounded-full"
                                        placeholder="Your Professor"
                                        required
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </form>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}
