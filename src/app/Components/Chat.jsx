"use client";
import React, {useCallback, useEffect, useRef, useState} from "react";
import {MessageCircle, User} from "lucide-react";
import Image from "next/image";
import {processTutorRequest} from "@/app/Components/processTutorRequest";

export default function Chat() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([{role: "assistant", content: "Hello! How can I help you today?"}]);
    const [inputMessage, setInputMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const handleClick = useCallback(() => setIsOpen(prev => !prev), []);

    const addMessage = useCallback((role, content) => {
        setMessages(prev => [...prev, {role, content}]);
    }, []);

    const sendMessage = useCallback(async (e) => {
        e.preventDefault();
        if (!inputMessage.trim() || isLoading) return;

        setIsLoading(true);
        const userMessage = inputMessage.trim();
        addMessage("user", userMessage);
        setInputMessage("");

        try {
            const data = await processTutorRequest({
                messages: [...messages, {role: "user", content: userMessage}]
            });

            if (data && data.text) {
                addMessage("assistant", data.text);

            } else {
                throw new Error("Invalid response from processTutorRequest");
            }
        } catch (error) {
            console.error("Error sending message:", error);
            addMessage("assistant", "Sorry, there was an error processing your request.");
        } finally {
            setIsLoading(false);
        }
    }, [inputMessage, isLoading, messages, addMessage]);


    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({behavior: "smooth"});
    }, [messages]);

    const renderMessage = useCallback(({role, content}, index) => (
        <div key={index}
             className={`flex gap-3 my-4 text-gray-600 text-sm flex-1 ${role === "user" ? "justify-end" : ""}`}>
            {role === "assistant" && (
                <span className="relative flex shrink-0 overflow-hidden rounded-full w-8 h-8">
                    <div className="rounded-full bg-gray-100 border p-1">
                        <Image src="/sparkles.svg" alt="Sparkles Icon" width={20} height={20} />
                    </div>
                </span>
            )}
            <p className="leading-relaxed">
                <span className="block font-bold text-gray-700">{role === "user" ? "You" : "AI"}</span>
                {content}
            </p>
            {role === "user" && (
                <span className="relative flex shrink-0 overflow-hidden rounded-full w-8 h-8">
                    <div className="rounded-full bg-gray-100 border p-1">
                        <User size={20} />
                    </div>
                </span>
            )}
        </div>
    ), []);

    return (
        <>
            <button
                className="fixed bottom-4 right-4 inline-flex items-center justify-center text-sm font-medium disabled:pointer-events-none disabled:opacity-50 border rounded-full w-16 h-16 bg-black hover:bg-gray-700 m-0 cursor-pointer border-gray-200 bg-none p-0 normal-case leading-5 hover:text-gray-900"
                type="button"
                aria-haspopup="dialog"
                aria-expanded={isOpen}
                onClick={handleClick}
            >
                <MessageCircle color="white" size={40} />
            </button>

            {isOpen && (
                <div
                    className="fixed bottom-[calc(4rem+1.5rem)] drop-shadow-2xl right-0 mr-4 bg-white p-6 rounded-lg border border-[#e5e7eb] w-[440px] h-[634px] flex flex-col">
                    <div className="flex flex-col space-y-1.5 pb-6">
                        <h2 className="font-semibold text-lg tracking-tight">Tutor-rific AI Assistant</h2>
                        <p className="text-sm text-[#6b7280] leading-3">Powered by TogetherAi and PineCone &ensp;🥳
                                                                        🎉</p>
                    </div>

                    <div className="flex-grow overflow-y-auto pr-4">
                        {messages.map(renderMessage)}
                        <span ref={messagesEndRef} />
                    </div>

                    <form onSubmit={sendMessage} className="flex items-center pt-4">
                        <div className="flex items-center justify-center w-full space-x-2">
                            <input
                                className="flex h-10 w-full rounded-md border border-[#e5e7eb] px-3 py-2 text-sm placeholder-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#9ca3af] disabled:cursor-not-allowed disabled:opacity-50 text-[#030712] focus-visible:ring-offset-2"
                                placeholder="Type your message"
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                disabled={isLoading}
                            />
                            <button
                                className="inline-flex items-center justify-center rounded-md text-sm font-medium text-[#f9fafb] disabled:pointer-events-none disabled:opacity-50 bg-black hover:bg-[#111827E6] h-10 px-4 py-2"
                                type="submit"
                                disabled={isLoading}
                            >
                                Send
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
}