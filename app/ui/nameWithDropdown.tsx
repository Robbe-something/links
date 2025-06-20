import {createClient} from "@/utils/supabase/server";
import DropDownMenuWithIcon from "@/ui/dropDownMenuWithIcon";

export default async function NameWithDropdown() {
    const supabase = await createClient()
    const user = await supabase.auth.getUser()
    const metadata = user?.data?.user?.user_metadata as { first_name: string, last_name: string }
    const {data, error} = await supabase
        .from('user')
        .select(`
        userRole (
          description
        )
        `)
        .eq('id', user?.data.user?.id!);

    return (<div className="flex items-center gap-2">
        <p className="text-lg font-semibold tracking-tighter">{`${metadata.first_name} ${metadata.last_name}`}</p>
            <DropDownMenuWithIcon firstName={metadata.first_name} lastName={metadata.last_name} userType={error ? "unkown" : data[0].userRole.description}/>
        </div>)
}
