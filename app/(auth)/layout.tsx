export default function DefaultLayout({children}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <header></header>
            <main className="flex min-h-screen items-center justify-center">
                {children}
            </main>
            <footer></footer>
        </>
    )
}