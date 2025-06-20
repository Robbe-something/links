export default async function Page({
                                       params
                                   }: {
    params: Promise<{ directory: string[] }>
}) {
    const {directory} = await params
    return (
        <ul>
            {directory.map(d => <li key={d}>{d}</li>)}
        </ul>
    )
}