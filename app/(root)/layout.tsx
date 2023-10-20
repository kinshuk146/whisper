import { ClerkProvider } from "@clerk/nextjs"
import { Inter } from "next/font/google"
import '../globals.css'
import TopBar from "@/components/shared/TopBar"
import RightSideBar from "@/components/shared/RightSideBar"
import LeftSideBar from "@/components/shared/LeftSideBar"
import BottomBar from "@/components/shared/BottomBar"
export const metadata = {
    title: "Whisper",
    description: "A social media application"
}

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <ClerkProvider>
            <html lang="en">
                <body className={`${inter.className} `}>
                    <TopBar />
                    <main className="flex flex-row">
                        <LeftSideBar />
                        <section className="main-container bg-dark-1">
                            <div className="w-full max-w-4xl">
                                {children}
                            </div>
                        </section>
                        {/* <RightSideBar/> */}
                    </main>
                    <BottomBar />
                </body>
            </html>
        </ClerkProvider>
    )
}