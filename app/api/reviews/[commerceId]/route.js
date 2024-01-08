import { readFileSync, writeFileSync } from 'fs';
import { NextResponse } from 'next/server';

export async function GET({ params }) {
    try {
        const reviews = JSON.parse(readFileSync("data/reviews.json"));
        const commerceReviews = reviews.find((review) => review.id === params.commerceId).reviews;
        return NextResponse.json({ reviews: commerceReviews });
    } catch (e) {
        return NextResponse.json({ message: "Error in getting reviews", status: 500, error: e.message });
    }
}

export async function POST({ params, req }) {
    try {
        // Assuming req has a body method to get JSON data
        const newReview = await req.body();
        const commerceId = params.commerceId;

        // Read existing reviews
        const reviewsData = JSON.parse(readFileSync("data/reviews.json"));

        // Find reviews for the specific commerceId
        const commerceReviews = reviewsData.find((review) => review.id === commerceId).reviews || [];

        // Add the new review
        commerceReviews.push(newReview);

        // Update the reviews list for the specific commerceId
        reviewsData.find((review) => review.id === commerceId) = commerceReviews;

        // Write updated reviews back to the file
        writeFileSync("data/reviews.json", JSON.stringify(reviewsData));

        return NextResponse.json({ message: "Review added successfully", status: 200 });
    } catch (e) {
        return NextResponse.json({ message: "Error in adding review", status: 500, error: e.message });
    }
}