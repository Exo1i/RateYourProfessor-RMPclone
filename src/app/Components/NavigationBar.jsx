"use client";
import Image from "next/image";
import { useState } from "react";
export default function NavigationBar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    console.log("Dropdown state before toggle:", isDropdownOpen); // Debugging line
    setIsDropdownOpen(!isDropdownOpen);
    console.log("Dropdown state after toggle:", !isDropdownOpen); // Debugging line
  };
  return (
    <nav className="bg-black fixed w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600 fixed">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-2">
        <a href="#" className="flex items-center space-x-3 rtl:space-x-reverse">
          <Image src="/exo.png" width={80} height={10} alt="EXO" />
        </a>
        <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          <button
            type="button"
            class="text-white  hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-2.5 me-2 m-2 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
          >
            Log In
          </button>
          <button
            type="button"
            class="text-white border border-gray-300 focus:outline-none hover:bg-gray-100 hover:text-black dark:hover:text-white focus:ring-4 focus:ring-gray-100 font-medium rounded-full text-sm px-5 py-2.5 me-2 m-2 dark:text-white dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
          >
            Sign Up
          </button>
          <button
            data-collapse-toggle="navbar-sticky"
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbar-sticky"
            aria-expanded="false"
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
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
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-glasses"
                className="inline mr-3"
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
              } `}
            >
              <ul
                class="bg-black py-2 text-sm text-white"
                aria-labelledby="dropdownLargeButton"
              >
                <li>
                  <a href="#" class="block px-4 py-2 hover:bg-gray-100">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      className="inline mr-2"
                    >
                      <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z" />
                      <path d="M22 10v6" />
                      <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" />
                    </svg>
                    Schools
                  </a>
                </li>
              </ul>
              <div class="py-1">
                <a
                  href="#"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                >
                  Sign out
                </a>
              </div>
            </div>
            <li>
              <form className="flex items-center max-w-sm mx-auto">
                <label for="simple-search" className="sr-only">
                  Search
                </label>
                <div className="relative w-full">
                  <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none"></div>
                  <input
                    type="text"
                    id="simple-search"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:border-gray-600  dark:text-black  rounded-full	"
                    placeholder="Your Professor"
                    required
                  />
                </div>
              </form>
            </li>
            <form className="flex items-center max-w-sm mx-auto">
              <label for="simple-search" className="sr-only">
                Search
              </label>
              <div className="relative w-full">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none"></div>
                <input
                  type="text"
                  id="simple-search"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:border-gray-600  dark:text-black  rounded-full	"
                  placeholder="Your Collage"
                  required
                />
              </div>
            </form>
          </ul>
        </div>
      </div>
    </nav>
  );
}
