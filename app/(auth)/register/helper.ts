"use server";

import {redirect} from "next/navigation";

export async function test() {
    console.log("test")
    redirect('/start')
}