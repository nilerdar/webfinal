"use client"
import "bootstrap/dist/css/bootstrap.css";
import Searchbar from "@/components/Searchbar";
import { useState, useEffect } from "react";
import "@/app/styles/main.css";
import CommerceCard from "@/components/CommerceCard";
import Link from "next/link";
import { useRouter } from "next/navigation";

async function getCommerces() {
    const res = await fetch("/api/commerces");
    const data = await res.json();
    return data.commerces;
}

export default function CommercesPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [commerces, setCommerces] = useState([]);
    const router = useRouter();

    const handleClick = (id) => {
        router.push(`/commerces/${id}`);
    };

    useEffect(() => {
        const fetchData = async () => {
            const data = await getCommerces();
            setCommerces(data);
        }

        fetchData();
    }, []);

    const filteredCommerces = commerces.filter(
        (commerce) =>
            (commerce.name && commerce.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (commerce.email && commerce.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (commerce.phone && commerce.phone.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleEdit = () => {
        router.push("/commerces/login")
    };

    return (
        <div className="container-fluid mt-5">
            <h1 className="text-center display-1 mb-5">Commerces</h1>
            
            <Searchbar onChange={(value) => setSearchTerm(value)} />

            <div className="container text-center mt-5">
                <div className="row row-cols-1 row-cols-md-3 g-2 card-group">
                    {filteredCommerces.map((commerce) => (
                        <CommerceCard key={commerce.id} commerce={commerce} onClick={handleClick}/>
                    ))}
                </div>
            </div>
        </div>
    )
}