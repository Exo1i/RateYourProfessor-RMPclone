"use client";
import Image from "next/image";
export default function Cards() {
  return (
    <div className="grid grid-cols-1  gap-4 mt-20 mx-4  md:grid-cols-3">
      <div className="grid gap-4 ">
        <div className="p-10">
          <div className="flex flex-col ">
            <div className="flex flex-row">
              <h1 className=" mb-2 text-9xl font-bold ">4.95</h1>
              <h2 className=" mt-5 text-3xl text-gray-400 ">/5</h2>
            </div>
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
              Meet our professor Ahmed Hamdy
            </h5>
            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
              He is one of the biggest instructors at cairo faculty of
              engineering
            </p>
          </div>
          <div className="flex items-center mb-2">
            <svg
              className="w-4 h-4 text-black-300 me-1"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 22 20"
            >
              <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
            </svg>
            <svg
              className="w-4 h-4 text-black-300 me-1"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 22 20"
            >
              <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
            </svg>
            <svg
              className="w-4 h-4 text-black-300 me-1"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 22 20"
            >
              <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
            </svg>
            <svg
              className="w-4 h-4 text-black-300 me-1"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 22 20"
            >
              <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
            </svg>
            <svg
              className="w-4 h-4 text-gray-300 me-1 dark:text-gray-500"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 22 20"
            >
              <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
            </svg>
            <p class="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400">
              4.95
            </p>
            <p class="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400">
              out of
            </p>
            <p class="ms-1 text-sm font-medium text-gray-500 dark:text-gray-400">
              5
            </p>
          </div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            1,745 global ratings
          </p>

          <article className="mt-5">
            <div class="flex items-center mb-4">
              <img
                class="w-10 h-10 me-4 rounded-full"
                src="https://images.unsplash.com/photo-1593985887762-955dccf2b71e?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt=""
              />
              <div class="font-medium ">
                <p>
                  Jese Leos{" "}
                  <time
                    datetime="2014-08-16 19:00"
                    class="block text-sm text-gray-500"
                  >
                    Joined on August 2014
                  </time>
                </p>
              </div>
            </div>
            <div class="flex items-center mb-1 space-x-1 rtl:space-x-reverse">
              <svg
                class="w-4 h-4 text-black-300"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 22 20"
              >
                <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
              </svg>
              <svg
                class="w-4 h-4 text-black-300"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 22 20"
              >
                <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
              </svg>
              <svg
                class="w-4 h-4 text-black-300"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 22 20"
              >
                <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
              </svg>
              <svg
                class="w-4 h-4 text-black-300"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 22 20"
              >
                <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
              </svg>
              <svg
                class="w-4 h-4 text-gray-300 dark:text-gray-500"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 22 20"
              >
                <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
              </svg>
              <h3 class="ms-2 text-sm font-semibold text-gray-900 dark:text-white">
                Thinking to buy another one!
              </h3>
            </div>
            <footer class="mb-5 text-sm text-gray-500 ">
              <p>
                Reviewed in the United Kingdom on{" "}
                <time datetime="2017-03-03 19:00">March 3, 2017</time>
              </p>
            </footer>
            <p class="mb-2 text-gray-500">
              I did not like his course but his explaination to the consepts is
              great
            </p>
            <p class="mb-3 text-gray-500 ">Also great course materials</p>
            <a
              href="#"
              class="block mb-5 text-sm font-medium text-blue-600 hover:underline dark:text-blue-500"
            >
              Read more
            </a>
            <aside>
              <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                19 people found this helpful
              </p>
              <div class="flex items-center mt-3">
                <a
                  href="#"
                  class="px-2 py-1.5 text-xs font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                >
                  Helpful
                </a>
                <a
                  href="#"
                  class="ps-4 text-sm font-medium text-blue-600 hover:underline dark:text-blue-500 border-gray-200 ms-4 border-s md:mb-0 dark:border-gray-600"
                >
                  Report abuse
                </a>
              </div>
            </aside>
          </article>
        </div>
      </div>

      <div className="grid gap-4">
        <div>
          <Image src="/hamdy.jpg" width={1000} height={1000} alt="prof" />
        </div>
      </div>
      <div class="grid gap-4 p-20">
        <div>
          <img
            class="h-auto max-w-full rounded-lg"
            src="https://scontent.fcai17-1.fna.fbcdn.net/v/t39.30808-6/455111183_881850273988905_2445855491496218593_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=127cfc&_nc_ohc=HYuQvGVHHbEQ7kNvgE-rfTI&_nc_ht=scontent.fcai17-1.fna&oh=00_AYCmRI2Lrk-elGo9zk2OsEYQaZM5uuADwBQlegUj0RBIbg&oe=66CD706E"
            alt=""
          />
        </div>
        <div>
          <img
            class="h-auto max-w-full rounded-lg"
            src="https://scontent.fcai17-1.fna.fbcdn.net/v/t39.30808-6/453509382_873851208122145_7792483622368155872_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=127cfc&_nc_ohc=9ax_Dtkh8VgQ7kNvgHqxdQs&_nc_ht=scontent.fcai17-1.fna&oh=00_AYDCrJQA3y_ggwIFPzuuKKQK09S6C3gx_UUM0BEu10a-yg&oe=66CD889C"
            alt=""
          />
        </div>
        <div>
          <img
            class="h-auto max-w-full rounded-lg"
            src="https://scontent.fcai17-1.fna.fbcdn.net/v/t39.30808-6/453597444_873850271455572_107033621698619417_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=127cfc&_nc_ohc=pN-xJpDN3BsQ7kNvgEV4uQW&_nc_ht=scontent.fcai17-1.fna&oh=00_AYD5lm3ynQN096Gk2Aitj6m6wSs0WS1YAKoW1ryRAaY-Kw&oe=66CD6751"
            alt=""
          />
        </div>
      </div>
    </div>
  );
}
