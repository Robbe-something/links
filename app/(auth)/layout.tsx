export default function DefaultLayout({children}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <header>hjk</header>
            <main>{children}</main>
            <footer></footer>
        </>
    )
}