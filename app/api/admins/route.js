import { NextResponse } from 'next/server'
import { readFileSync } from 'fs';

export async function GET() {
    try{
        const admins = JSON.parse(readFileSync("data/admins.json"))
        return NextResponse.json({admins})
    } catch(e){  
        return NextResponse.json({message: "admins.json no existen...", status: 400})
    }
}