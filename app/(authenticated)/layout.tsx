export const experimental_ppr = true

import Navbar from "@/ui/navbar";

export default function DefaultLayout({children}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <header></header>
            <main className="pt-16 h-[100dvh] overflow-y-auto">
                <Navbar/>
                {children}
            </main>
            <footer></footer>
        </>
    )
}