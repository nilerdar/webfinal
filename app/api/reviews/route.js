import { NextResponse } from 'next/server'
import { readFileSync, writeFileSync } from 'fs';

export async function GET() {
    try{
        const reviews = JSON.parse(readFileSync("data/reviews.json"))
        // console.log(reviews[0].find((review) => review.id === "6f58462f-d2d7-4f11-b195-b18e4a472e74").reviews.map((review) => review.comment));
        return NextResponse.json({reviews})
    } catch(e){  
        return NextResponse.json({message: "reviews.json no existen...", status: 400})
    }
}

export async function POST(request) {
    const newData = await request.json();

    try {
        // Read the existing reviews from the file
        const reviewsNestedArray = JSON.parse(readFileSync("data/reviews.json"));

        // Assuming the reviews are in a nested array structure
        let reviewUpdated = false;
        for (const reviewGroup of reviewsNestedArray) {
            const commerceReview = reviewGroup.find(review => review.id === newData.id);
            if (commerceReview) {
                // Append the new review(s) to the existing commerce's reviews
                commerceReview.reviews.push(...newData.reviews);
                reviewUpdated = true;
                break;
            }
        }

        if (!reviewUpdated) {
            // If no matching commerce ID is found, add the new data as a new nested array
            reviewsNestedArray.push([newData]);
        }

        // Write the updated data back to the file
        writeFileSync("data/reviews.json", JSON.stringify(reviewsNestedArray));

        return NextResponse.json({ message: "Review added successfully", status: 200 });
    } catch (error) {
        console.error("Error updating reviews:", error);
        return NextResponse.json({ message: "Error updating reviews", status: 500, error: error.message });
    }
}

export async function PUT(request) {
    const updateData = await request.json();

    try {
        const filePath = 'data/reviews.json';
        let reviews = JSON.parse(readFileSync(filePath));

        const index = reviews.findIndex(review => review.id === updateData.id);

        if (index === -1) {
            return NextResponse.json({ message: "Review not found...", status: 404 });
        }

        reviews[index] = { ...reviews[index], ...updateData };
        writeFileSync(filePath, JSON.stringify(reviews));

        return NextResponse.json({ message: "reviews.json updated successfully...", status: 200 });
    } catch (error) {
        console.error('Error updating data:', error);
        return NextResponse.json({ message: "Error updating reviews.json...", status: 500, error });
    }
}

export async function DELETE(request) {
    const data = await request.json();
    try {
        const reviews = JSON.parse(readFileSync("data/reviews.json"));
        const updatedUsers = reviews.filter((user) => user.id !== data.id);
        writeFileSync("data/reviews.json", JSON.stringify(updatedUsers));
        return NextResponse.json({message: "reviews.json updated correctly...", status: 200});
    } catch(e){  
        console.log(e);
    }
}