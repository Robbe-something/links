import {Metadata} from "next";

export async function generateMetadata(
    {params}: { params: Promise<{ directory: string }> }
): Promise<Metadata> {
    const {directory} = await params
    return {
        title: `Links - ${decodeURIComponent(directory)}`
    }
}

export default async function Page({
                                       params
                                   }: {
    params: Promise<{ directory: string }>
}) {
    const {directory} = await params
    return (
        <p>{decodeURIComponent(directory)}</p>
    )
}