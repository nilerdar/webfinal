"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

async function loadCommerce(id) {
    try {
        const res = await fetch('/api/commercesContent');
        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || 'Error fetching commerces');
        }

        const commerce = data.commercesContent.find(commerce => commerce.id === id);
        return commerce;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export default function Page({ params }) {
    const [commerce, setCommerce] = useState({});
    const [modalData, setModalData] = useState({ show: false, field: '', value: '' });
    const [filteredUsers, setFilteredUsers] = useState([]);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            const data = await loadCommerce(params.id);
            setCommerce(data);
        }

        fetchData();
    }, []);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('/api/users');
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.message || 'Error fetching users');
                }
                filterUsers(data.users, commerce);
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchUsers();
    }, [commerce]);

    const handleEditClick = (field, value) => {
        setModalData({ show: true, field, value });
    };

    const updateCommerceDetails = async (updatedCommerce) => {
        try {
            // Update adminsCommerces
            await fetch("/api/adminsCommerces", {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: updatedCommerce.id, city: updatedCommerce.city, name: updatedCommerce.name })
            });

            // Update commerces
            await fetch("/api/commerces", {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: updatedCommerce.id, city: updatedCommerce.city, name: updatedCommerce.name })
            });

            // Update commercesContent
            await fetch("/api/commercesContent", {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: updatedCommerce.id, 
                    city: updatedCommerce.city, 
                    activity: updatedCommerce.activity, 
                    name: updatedCommerce.name, 
                    summary: updatedCommerce.summary 
                })
            });

            console.log("Commerce updated successfully");
        } catch (error) {
            console.error("Error updating commerce:", error);
        }
    };

    const handleModalSave = (field, updatedValue) => {
        setCommerce(currentCommerce => {
            const updatedCommerce = { ...currentCommerce, [field]: updatedValue };
            handleModalClose();
            updateCommerceDetails(updatedCommerce);
            return updatedCommerce;
        });
    };

    const handleModalClose = () => {
        setModalData({ show: false, field: '', value: '' });
    };

    const handleDeleteCommerce = async () => {
        try {
            // Prepare the request body
            const requestBody = JSON.stringify({ id: commerce.id });
    
            // Headers for the request
            const headers = { 'Content-Type': 'application/json' };
    
            // Delete from adminsCommerces
            await fetch('/api/adminsCommerces', {
                method: 'DELETE',
                headers: headers,
                body: requestBody
            });
    
            await fetch('/api/commerces', {
                method: 'DELETE',
                headers: headers,
                body: requestBody
            });

            await fetch('/api/commercesContent', {
                method: 'DELETE',
                headers: headers,
                body: requestBody
            });
    
            console.log("Commerce deleted successfully");
            // Redirect or update UI as needed
            router.push('/commerces');
        } catch (error) {
            console.error("Error deleting commerce:", error);
        }
    };

    const filterUsers = (users, commerce) => {
        const matchingUsers = users.filter(user => 
            user.offer === true &&
            user.city === commerce.city &&
            user.interest === commerce.activity
        );
        setFilteredUsers(matchingUsers);
    };

    return (
        <>
            {(commerce === undefined) ?
                <div className="container-fluid h-100 my-auto">
                    <h1 className="text-center mt-5 display-2">Comercio no encontrado</h1>
                </div>
            :
                <div className="container-fluid mt-5">
                    <h1 className="display-5 text-center">{commerce.name}</h1>
                    <div className="container w-50 mt-5 border rounded">
                        <div className="row p-2 align-items-center">
                            <div className="col-10">
                                <p className="m-0 fs-3">Ciudad: {commerce.ciudad}</p>
                            </div>
                            <div className="col-2 align-items-center justify-content-center text-center">
                                <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => handleEditClick('city', commerce.city)}>Editar</button>
                            </div>
                        </div>
                        <hr className="m-0"/>
                        <div className="row p-2 align-items-center">
                            <div className="col-10">
                                <p className="m-0 fs-3">Actividad: {commerce.activity}</p>
                            </div>
                            <div className="col-2 align-items-center justify-content-center text-center">
                                <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => handleEditClick('activity', commerce.activity)}>Editar</button>
                            </div>
                        </div>
                        <hr className="m-0"/>
                        <div className="row p-2 align-items-center">
                            <div className="col-10">
                                <p className="m-0 fs-3">Nombre: {commerce.name}</p>
                            </div>
                            <div className="col-2 align-items-center justify-content-center text-center">
                                <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => handleEditClick('name', commerce.name)}>Editar</button>
                            </div>
                        </div>
                        <hr className="m-0"/>
                        <div className="row p-2 align-items-center">
                            <div className="col-10">
                                <p className="m-0 fs-3">Descripcion: {commerce.summary}</p>
                            </div>
                            <div className="col-2 align-items-center justify-content-center text-center">
                                <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => handleEditClick('summary', commerce.summary)}>Editar</button>
                            </div>
                        </div>
                    </div>
                    <div className="container-fluid mt-5">
                        <h1 className="display-6 text-center">Usuarios interesados en {commerce.ciudad}:</h1>
                        <div className="container w-50 mt-5 border rounded">
                            {filteredUsers.map(user => (
                                <div className="row" key={user.id}>
                                    <div className="col">
                                        <p className="m-0 fs-3">{user.email}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="container-fluid mt-5 mx-0 text-center">
                        <button className="btn btn-danger" onClick={handleDeleteCommerce}>Borrar comercio</button>
                    </div>
                    <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content p-2">
                                <h4 className="text-center text-dark textmt-1">Editar {modalData.field}</h4>
                                <input
                                    className="form-control my-3"
                                    type="text"
                                    defaultValue={modalData.value}
                                    onChange={(e) => setModalData({ ...modalData, value: e.target.value })}
                                />
                                <div className="d-flex justify-content-between">
                                    <button className="btn btn-danger m-1" data-bs-dismiss="modal" aria-label="Close" onClick={handleModalClose}>Cerrar</button>
                                    <button className="btn btn-primary m-1" onClick={() => handleModalSave(modalData.field, modalData.value)}>Guardar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}