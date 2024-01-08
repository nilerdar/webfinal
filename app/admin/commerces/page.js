"use client"
import 'bootstrap/dist/css/bootstrap.min.css';
import Searchbar from "@/components/Searchbar"
import Card from "@/components/Card"
import { v4 as uuidv4 } from 'uuid';
import { useEffect, useState } from "react"

async function getAdminsCommerces() {
    const res = await fetch("/api/adminsCommerces");
    const data = await res.json();
    return data.adminsCommerces;
}

export default function CommercesPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [newCommerce, setNewCommerce] = useState({ name: "", cif: "", ciudad: "", email: "", phone: "", id : "" });
    const [cardsData, setCardsData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const data = await getAdminsCommerces();
            setCardsData(data);
        }

        fetchData();
    }, []);

    const filteredNotes = cardsData.filter(
        (card) =>
            (card.name && card.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (card.ciudad && card.ciudad.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (card.email && card.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (card.phone && card.phone.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (card.cif && card.cif.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleModalOpen = () => {
        setShowModal(true);
    };
    
    const handleModalClose = () => {
        setShowModal(false);
    };
    
    const handleAddCommerce = async () => {
        newCommerce.id = uuidv4(); // genera un id único para el comercio
        const updatedCardsData = [...cardsData, newCommerce];
        setCardsData(updatedCardsData);
        
        fetch("/api/adminsCommerces", {// añade el comercio a la lista de comercios de admin
            method: "POST",
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(newCommerce)
        })
            .then((res) => res.json())
            .then((data) => console.log(data))

        const cleanCommerce = { name: newCommerce.name, ciudad: newCommerce.ciudad, email: newCommerce.email, phone: newCommerce.phone, id: newCommerce.id }; // elimina los campos que no son necesarios
        fetch("/api/commerces", { // añade el comercio a la lista de comercios general
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(cleanCommerce)
        })
            .then((res) => res.json())
            .then((data) => console.log(data))

        const cleanCommerceContent = { name: newCommerce.name, ciudad: newCommerce.ciudad, id: newCommerce.id, summary: "", activity: "", numberOfReviews: 0, rating: 0 ,reviews: [] };
        fetch("/api/commercesContent", { // añade el comercio a la lista de comercios para el contenido
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(cleanCommerceContent)
        })
            .then((res) => res.json())
            .then((data) => console.log(data))
        // Limpia los campos del formulario
        setNewCommerce({ name: "", cif: "", ciudad: "", email: "", phone: "" });
        newCommerce.id = "";
        setShowModal(false);

        window.location.reload();
    };

    const handleDeleteCommerce = async (id) => {
        const updatedCardsData = cardsData.filter((card) => card.id !== id); // Elimina el comercio de la lista de comercios con el id especificado
        setCardsData(updatedCardsData); // Actualiza la lista de comercios

        fetch("/api/adminsCommerces", { // Elimina el comercio de la lista de comercios de admin
            method: "DELETE",
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id })
        })
            .then((res) => res.json())
            .then((data) => console.log(data))

        fetch("/api/commerces", { // Elimina el comercio de la lista de comercios general
            method: "DELETE",
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id })
        })
            .then((res) => res.json())
            .then((data) => console.log(data))
    }

    return (
        <div className="container-fluid py-5 h-100">
            <h1 className="text-center display-5 my-5">Portal de administracion de comercios</h1>

            <Searchbar onChange={(value) => setSearchTerm(value)} />

            <button className="btn btn-success my-2 d-flex mx-auto" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={handleModalOpen}>Registrar Comercio</button>

            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <div className="modal-title h4 fs-5">Registrar Comercio</div>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form className="">
                                <div>
                                    <label className="form-label" htmlFor="name">Nombre</label>
                                    <input 
                                        placeholder="Introduzca name"
                                        id="name" 
                                        className="form-control" 
                                        type="text" 
                                        value={newCommerce.name}
                                        onChange={(e) =>
                                            setNewCommerce({ ...newCommerce, name: e.target.value })
                                        }
                                    />
                                </div>
                    
                                <div>
                                    <label className="form-label" htmlFor="cif">CIF</label>
                                    <input 
                                        placeholder="Introduzca CIF" 
                                        id="cif" 
                                        className="form-control" 
                                        type="text" 
                                        value={newCommerce.cif}
                                        onChange={(e) =>
                                            setNewCommerce({ ...newCommerce, cif: e.target.value })
                                        }
                                    />
                                </div>

                                <div>
                                    <label className="form-label" htmlFor="ciudad">Ciudad</label>
                                    <input 
                                        placeholder="Introduzca ciudad" 
                                        id="ciudad" 
                                        className="form-control" 
                                        type="text" 
                                        value={newCommerce.ciudad}
                                        onChange={(e) =>
                                            setNewCommerce({ ...newCommerce, ciudad: e.target.value })
                                        }
                                    />
                                </div>

                                <div>
                                    <label className="form-label" htmlFor="email">Email</label>
                                    <input 
                                        placeholder="Introduzca email" 
                                        id="email" 
                                        className="form-control" 
                                        type="text" 
                                        value={newCommerce.email}
                                        onChange={(e) =>
                                            setNewCommerce({ ...newCommerce, email: e.target.value })
                                        }
                                    />
                                </div>

                                <div>
                                    <label className="form-label" htmlFor="phone">Contacto</label>
                                    <input 
                                        placeholder="Introduzca el contacto" 
                                        id="phone" 
                                        className="form-control" 
                                        type="text" 
                                        value={newCommerce.phone}
                                        onChange={(e) =>
                                            setNewCommerce({ ...newCommerce, phone: e.target.value })
                                        }
                                    />
                                </div>

                            </form>
                        </div>

                        <div className="modal-footer">
                            <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Cerrar</button>
                            <button type="button" className="btn btn-success" onClick={handleAddCommerce}>Guardar</button>
                        </div>
                    </div>
                </div>
            </div>

            <hr className="my-5" />

            <div className="container-fluid text-center mt-5">
                <div className="row card-group justify-content-center">
                    {filteredNotes.map((card, index) => (
                        <div key={index} className="col-sm-4 col-12 col-lg-2 m-1 m-lg-2">
                            <Card
                                name={card.name}
                                ciudad={card.ciudad}
                                email={card.email}
                                phone={card.phone}
                                cif={card.cif}
                                onDelete={() => handleDeleteCommerce(card.id)}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}