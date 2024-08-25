import {Inter} from "next/font/google";
import "./globals.css";
import {ClerkProvider} from "@clerk/nextjs";

const inter = Inter({subsets: ["latin"]});

export const metadata = {
    title: "Tutor-rific: Rate Your Professors",
    description: "Rate your professors and see what others have to say about them. Tutor-rific is a platform where students can rate their professors and see what others have to say about them.",
};

export default function RootLayout({children}) {
    return (<ClerkProvider>
            <html lang="en">
                <body className={inter.className}>{children}</body>
            </html>
        </ClerkProvider>);
}
