"use client"
import { useState, useEffect } from 'react';

async function loadCommerce(id) {
    const res = await fetch('/api/commercesContent');
    const data = await res.json();
    const commerce = data.commercesContent.find((commerce) => commerce.id === id);
    return commerce;
}

async function loadReviews(id) {
    const res = await fetch('/api/reviews');
    const data = await res.json();

    // Iterate through the outer array to find the inner array containing the matching ID
    for (const reviewGroup of data.reviews) {
        const reviewObject = reviewGroup.find(review => review.id === id);
        if (reviewObject) {
            return reviewObject.reviews; // Return the reviews if a matching ID is found
        }
    }

    return []; // Return an empty array if no matching ID is found
}

export default function Page({ params }) {
    const [commerce, setCommerce] = useState({});
    const [reviews, setReviews] = useState([]);
    const [isLogged, setIsLogged] = useState(false);
    const [user, setUser] = useState({});
    const [modalData, setModalData] = useState({ show: false, field: '', comment: '', rating: '' });
    const [review, setReview] = useState({ comment: '', rating: '' });

    useEffect(() => {
        const fetchData = async () => {
            const data = await loadCommerce(params.id);
            const data2 = await loadReviews(params.id);
            setCommerce(data);
            setReviews(data2);
        }

        fetchData();

        const storedUser = localStorage.getItem('user');
        const storedIsLogged = localStorage.getItem('isLogged');
        setUser(storedUser ? JSON.parse(storedUser) : {});
        setIsLogged(storedIsLogged || false);
    }, []);

    const updateReview = async (userId, name, comment, rating) => {
        console.log(reviews);
        try {
            const reviewData = {
                id: params.id, // Assuming this is the commerce ID
                reviews: [{
                    userId: userId,
                    name: name,
                    comment: comment,
                    rating: rating
                }]
            };
    
            const response = await fetch("/api/reviews", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(reviewData)
            });
    
            const data = await response.json();
    
            if (response.ok) {
                console.log("Review updated successfully");
            } else {
                console.log("Failed to update review:", data.message);
            }
        } catch (error) {
            console.error("Error updating review:", error);
        }
    };    

    const handleModalSave = (comment, rating) => {
        const newReview = {
            id: user.id,
            name: user.name,
            comment: comment,
            rating: rating
        };
        updateReview(user.id, user.name, comment, rating);

        // Check if reviews is an array before spreading
        if (Array.isArray(reviews)) {
            setReviews([...reviews, newReview]);
        } else {
            setReviews([newReview]); // If reviews is not an array, start a new one
        }

        handleModalClose();
    };

    const handleModalClose = () => {
        setModalData({ show: false, field: '', value: '' });
    };

    if (commerce === undefined) {
        return (
            <div className="container-fluid h-100 my-auto">
                <h1 className="text-center mt-5 display-2">Commerce not found</h1>
            </div>
        )
    }

    return (
        <div className="container-fluid h-100 text-center">
            <h1 className="mt-5 display-2">{commerce.name}</h1>
            <h1 className="mt-5 text-white display-5">{commerce.summary}</h1>
            <div className="container w-50 mt-5 border rounded">
                <p className="mt-1 fs-3">Ciudad: {commerce.ciudad}</p>
                <p className="mt-1 fs-3">Actividad: {commerce.activity}</p>
            </div>
            <h1 className="mt-5 display-5">Reseñas:</h1>
            { isLogged === 'true' ?
                <button className="btn btn-primary mt-1" data-bs-toggle="modal" data-bs-target="#exampleModal">Añadir reseña</button>
            :
                <p className="mt-1 fs-3">Debes inicar sesion</p>
            }
            <div className="container-fluid mt-5 border rounded">
                {reviews.map((review, index) => (
                    <div key={index} className="row text-start">
                        <div className="col-10">
                            <p className="mt-1 fs-3">Usuario: {review.name}</p>
                            <p className="mt-1 fs-3">Reseña: {review.comment}</p>
                        </div>
                        <div className="col-2 align-self-center">
                            <p className="mt-1 fs-3">Rating: {review.rating}</p>
                        </div>
                        <hr />
                    </div>
                ))}
            </div>
            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content p-2">
                        <h4 className="text-center mt-1 text-dark">Añadir reseña</h4>
                        <label className="form-label mt-3 text-dark" htmlFor="comment">Reseña</label>
                        <input
                            className="form-control mb-3"
                            id="comment"
                            type="text"
                            defaultValue={modalData.comment}
                            onChange={(e) => setModalData({ ...modalData, comment: e.target.value })}/>
                        <label className="form-label mt-3 text-dark" htmlFor="rating">Rating</label>
                        <input
                            className="form-control mb-3"
                            id="rating"
                            type="text"
                            defaultValue={modalData.rating}
                            onChange={(e) => setModalData({ ...modalData, rating: e.target.value })}/>
                        <div className="d-flex justify-content-between">
                            <button className="btn btn-danger m-1" data-bs-dismiss="modal" aria-label="Close" onClick={handleModalClose}>Cerrar</button>
                            <button className="btn btn-success m-1" onClick={() => handleModalSave(modalData.comment, modalData.rating)}>Guardar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}