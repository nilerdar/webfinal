"use client"
import { useState, useEffect } from 'react';

async function loadUser(id) { // Carga la lista de usuarios y devuelve el usuario con el id especificado
    const res = await fetch('/api/users');
    const data = await res.json();
    const user = data.users.find((user) => user.id === id); // Busca el usuario con el id especificado
    return user;
}

export default function Page({ params }) {
    const [user, setUser] = useState({});
    const [modalData, setModalData] = useState({ show: false, field: '', value: '' }); // Datos del modal

    useEffect(() => {
        const fetchData = async () => {
            const data = await loadUser(params.id); // Carga el usuario con el id especificado
            setUser(data);
        }

        fetchData();
        console.log(user);
    }, []);

    if (user === undefined) { // Si el usuario no existe, muestra un mensaje de error
        return (
            <div className="container-fluid h-100 my-auto">
                <h1 className="text-center mt-5 display-2">Usuario no encontrado</h1>
            </div>
        )
    }

    const handleEditClick = (field, value) => {
        setModalData({ show: true, field, value });
    };

    const updateUserDetails = async (updatedUser) => {
        try {
            // Actualiza el usuario en el fichero json
            await fetch("/api/users", {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: updatedUser.id, 
                    name: updatedUser.name, 
                    email: updatedUser.email, 
                    age: updatedUser.age, 
                    city: updatedUser.city,
                    interest: updatedUser.interest,
                    offer: (updatedUser.offer === 'true') 
                })
            });

            // Actualiza el usuario en el localStorage
            localStorage.setItem('user', JSON.stringify(updatedUser));
            window.location.reload();
            console.log("User updated successfully");
        } catch (error) {
            console.error("Error updating commerce:", error);
        }
    };

    const handleModalSave = (field, updatedValue) => { // Actualiza el campo especificado con el valor especificado
        setUser(currentUser => {
            const updatedUser = { ...currentUser, [field]: updatedValue }; // Actualiza el campo especificado con el valor especificado
            handleModalClose();
            updateUserDetails(updatedUser);
            return updatedUser;
        });
    };

    const handleModalClose = () => {
        setModalData({ show: false, field: '', value: '' });
    };

    const handleDeleteUser = async () => {
        try {
            const requestBody = JSON.stringify({ id: user.id });
            const headers = { 'Content-Type': 'application/json' };

            await fetch('/api/users', { // Elimina el usuario del fichero json
                method: 'DELETE',
                headers: headers,
                body: requestBody
            });

            localStorage.removeItem('user'); // Elimina el usuario del localStorage
            localStorage.removeItem('isLogged'); // Elimina la variable isLogged del localStorage
    
            console.log("User deleted successfully");
            window.location.href = "/";
        } catch (error) {
            console.error("Error deleting commerce:", error);
        }
    };

    return (
        <div className="container-fluid mt-5">
            <h1 className="display-5 text-center">{user.name}</h1>
            <div className="container w-50 mt-5 border rounded">
                <div className="row p-2 align-items-center">
                    <div className="col-10">
                        <p className="m-0 fs-3">Nombre: {user.name}</p>
                    </div>
                    <div className="col-2 align-items-center justify-content-center text-center">
                        <button className="btn btn-success" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => handleEditClick('name', user.name)}>Editar</button>
                    </div>
                </div>
                <div className="row p-2 align-items-center">
                    <div className="col-10">
                        <p className="m-0 fs-3">Email: {user.email}</p>
                    </div>
                    <div className="col-2 align-items-center justify-content-center text-center">
                        <button className="btn btn-success" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => handleEditClick('email', user.email)}>Editar</button>
                    </div>
                </div>
                <div className="row p-2 align-items-center">
                    <div className="col-10">
                        <p className="m-0 fs-3">Edad: {user.age}</p>
                    </div>
                    <div className="col-2 align-items-center justify-content-center text-center">
                        <button className="btn btn-success" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => handleEditClick('age', user.age)}>Editar</button>
                    </div>
                </div>
                <div className="row p-2 align-items-center">
                    <div className="col-10">
                        <p className="m-0 fs-3">Ciudad: {user.city}</p>
                    </div>
                    <div className="col-2 align-items-center justify-content-center text-center">
                        <button className="btn btn-success" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => handleEditClick('city', user.city)}>Editar</button>
                    </div>
                </div>
                <div className="row p-2 align-items-center">
                    <div className="col-10">
                        <p className="m-0 fs-3">Intereses: {user.interest}</p>
                    </div>
                    <div className="col-2 align-items-center justify-content-center text-center">
                        <button className="btn btn-success" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => handleEditClick('interest', user.interest)}>Editar</button>
                    </div>
                </div>
                <div className="row p-2 align-items-center">
                    <div className="col-10">
                        <p className="m-0 fs-3">Estado de las ofertas: {`${user.offer}`}</p>
                    </div>
                    <div className="col-2 align-items-center justify-content-center text-center">
                        <button className="btn btn-success" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => handleEditClick('offer', user.offer)}>Editar</button>
                    </div>
                </div>
            </div>
            <div className="container-fluid mt-5 mx-0 text-center">
                <button className="btn btn-danger" onClick={handleDeleteUser}>Borrar cuenta</button>
            </div>
            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content p-2">
                        <h4 className="text-center mt-1">Editar {modalData.field}</h4>
                        <input
                            className="form-control my-3"
                            type="text"
                            defaultValue={modalData.value}
                            onChange={(e) => setModalData({ ...modalData, value: e.target.value })}
                        />
                        <div className="d-flex justify-content-between">
                            <button className="btn btn-danger m-1" data-bs-dismiss="modal" aria-label="Close" onClick={handleModalClose}>Cerrar</button>
                            <button className="btn btn-success m-1" onClick={() => handleModalSave(modalData.field, modalData.value)}>Guardar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}