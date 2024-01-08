import { NextResponse } from 'next/server'
import { readFileSync, writeFileSync } from 'fs';

export async function GET() {
    try{
        const commerces = JSON.parse(readFileSync("data/commerces.json"));
        return NextResponse.json({commerces});
    } catch(e){  
        return NextResponse.json({message: "commerces.json does not exist...", status: 400, error: e});
    }
}

export async function POST(request) {
    const data = await request.json();

    try {
        const filePath = 'data/commerces.json';
        const commerces = JSON.parse(readFileSync(filePath));

        writeFileSync(filePath, JSON.stringify([...commerces, data]));

        console.log('Data added successfully to commerces.json');
    } catch (error) {
        console.error('Error adding data:', error);
    }

    return NextResponse.json({message: "commerces.json actualizado correctamente...", status: 200});
}

export async function PUT(request) {
    const updateData = await request.json();

    try {
        const filePath = 'data/commerces.json';
        let commerces = JSON.parse(readFileSync(filePath));

        const index = commerces.findIndex(commerce => commerce.id === updateData.id);

        if (index === -1) {
            return NextResponse.json({ message: "Commerce not found...", status: 404 });
        }

        commerces[index] = { ...commerces[index], ...updateData };
        writeFileSync(filePath, JSON.stringify(commerces));

        return NextResponse.json({ message: "commerces.json updated successfully...", status: 200 });
    } catch (error) {
        console.error('Error updating data:', error);
        return NextResponse.json({ message: "Error updating commerces.json...", status: 500, error });
    }
}

export async function DELETE(request) {
    const data = await request.json();
    try {
        const commerces = JSON.parse(readFileSync("data/commerces.json"));
        const updatedCommerces = commerces.filter((commerce) => commerce.id !== data.id);
        writeFileSync("data/commerces.json", JSON.stringify(updatedCommerces));
        return NextResponse.json({message: "commerces.json updated correctly...", status: 200});
    } catch(e){  
        console.log(e);
    }
}