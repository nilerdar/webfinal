import { NextResponse } from 'next/server'
import { readFileSync, writeFileSync } from 'fs';

export async function GET() {
    try{
        const users = JSON.parse(readFileSync("data/users.json"))
        return NextResponse.json({users})
    } catch(e){  
        return NextResponse.json({message: "users.json no existen...", status: 400})
    }
}

export async function POST(request) {
    const data = await request.json();
    
    try {
        const users = JSON.parse(readFileSync("data/users.json"));

        writeFileSync("data/users.json", JSON.stringify([...users, data]));

        console.log("Data added successfully.");
    } catch (error) {
        writeFileSync("data/users.json", JSON.stringify([data]));
    }

    return NextResponse.json({message: "users.json actualizado correctamente...", status: 200});
}

export async function PUT(request) {
    const updateData = await request.json();

    try {
        const filePath = 'data/users.json';
        let users = JSON.parse(readFileSync(filePath));

        const index = users.findIndex(user => user.id === updateData.id);

        if (index === -1) {
            return NextResponse.json({ message: "Commerce not found...", status: 404 });
        }

        users[index] = { ...users[index], ...updateData };
        writeFileSync(filePath, JSON.stringify(users));

        return NextResponse.json({ message: "users.json updated successfully...", status: 200 });
    } catch (error) {
        console.error('Error updating data:', error);
        return NextResponse.json({ message: "Error updating users.json...", status: 500, error });
    }
}

export async function DELETE(request) {
    const data = await request.json();
    try {
        const users = JSON.parse(readFileSync("data/users.json"));
        const updatedUsers = users.filter((user) => user.id !== data.id);
        writeFileSync("data/users.json", JSON.stringify(updatedUsers));
        return NextResponse.json({message: "users.json updated correctly...", status: 200});
    } catch(e){  
        console.log(e);
    }
}