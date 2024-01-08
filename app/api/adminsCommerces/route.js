import { NextResponse } from 'next/server'
import { readFileSync, writeFileSync } from 'fs';

export async function GET() {
    try{
        const adminsCommerces = JSON.parse(readFileSync("data/adminsCommerces.json"));
        return NextResponse.json({adminsCommerces});
    } catch(e){  
        return NextResponse.json({message: "adminsCommerces.json does not exist...", status: 400, error: e});
    }
}

export async function POST(request) {
    const data = await request.json();

    try {
        const filePath = 'data/adminsCommerces.json';
        const adminsCommerces = JSON.parse(readFileSync(filePath));

        writeFileSync(filePath, JSON.stringify([...adminsCommerces, data]));

        console.log('Data added successfully to adminsCommerces.json');
    } catch (error) {
        console.error('Error adding data:', error);
    }

    return NextResponse.json({message: "adminsCommerces.json updated correctly...", status: 200});
}

export async function PUT(request) {
    const updateData = await request.json();

    try {
        const filePath = 'data/adminsCommerces.json';
        let adminsCommerces = JSON.parse(readFileSync(filePath));

        const index = adminsCommerces.findIndex(commerce => commerce.id === updateData.id);

        if (index === -1) {
            return NextResponse.json({ message: "Commerce not found...", status: 404 });
        }

        adminsCommerces[index] = { ...adminsCommerces[index], ...updateData };
        writeFileSync(filePath, JSON.stringify(adminsCommerces));

        return NextResponse.json({ message: "adminsCommerces.json updated successfully...", status: 200 });
    } catch (error) {
        console.error('Error updating data:', error);
        return NextResponse.json({ message: "Error updating adminsCommerces.json...", status: 500, error });
    }
}

export async function DELETE(request) {
    const data = await request.json();
    try {
        const adminsCommerces = JSON.parse(readFileSync("data/adminsCommerces.json"));
        const updatedAdminsCommerces = adminsCommerces.filter((commerce) => commerce.id !== data.id);
        writeFileSync("data/adminsCommerces.json", JSON.stringify(updatedAdminsCommerces));
        return NextResponse.json({message: "adminsCommerces.json updated correctly...", status: 200});
    } catch(e){  
        console.log(e);
    }
}