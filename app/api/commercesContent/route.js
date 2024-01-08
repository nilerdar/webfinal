import { NextResponse } from 'next/server'
import { readFileSync, writeFileSync } from 'fs';

export async function GET() {
    try{
        const commercesContent = JSON.parse(readFileSync("data/commercesContent.json"));
        return NextResponse.json({commercesContent});
    } catch(e){  
        return NextResponse.json({message: "commercesContent.json does not exist...", status: 400, error: e});
    }
}

export async function POST(request) {
    const data = await request.json();

    try {
        const filePath = 'data/commercesContent.json';
        const commercesContent = JSON.parse(readFileSync(filePath));

        writeFileSync(filePath, JSON.stringify([...commercesContent, data]));

        console.log('Data added successfully to commercesContent.json');
    } catch (error) {
        console.error('Error adding data:', error);
    }

    return NextResponse.json({message: "commercesContent.json actualizado correctamente...", status: 200});
}

export async function PUT(request) {
    const updateData = await request.json();

    try {
        const filePath = 'data/commercesContent.json';
        let commercesContent = JSON.parse(readFileSync(filePath));

        const index = commercesContent.findIndex(commerce => commerce.id === updateData.id);

        if (index === -1) {
            return NextResponse.json({ message: "Commerce not found...", status: 404 });
        }

        commercesContent[index] = { ...commercesContent[index], ...updateData };
        writeFileSync(filePath, JSON.stringify(commercesContent));

        return NextResponse.json({ message: "commercesContent.json updated successfully...", status: 200 });
    } catch (error) {
        console.error('Error updating data:', error);
        return NextResponse.json({ message: "Error updating commercesContent.json...", status: 500, error });
    }
}

export async function DELETE(request) {
    const data = await request.json();
    try {
        const commercesContent = JSON.parse(readFileSync("data/commercesContent.json"));
        const updatedCommerces = commercesContent.filter((commerce) => commerce.id !== data.id);
        writeFileSync("data/commercesContent.json", JSON.stringify(updatedCommerces));
        return NextResponse.json({message: "commercesContent.json updated correctly...", status: 200});
    } catch(e){  
        console.log(e);
    }
}