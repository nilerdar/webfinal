"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import "bootstrap/dist/css/bootstrap.css";
import Alert from "@/components/Alert";

async function getCommerces() {
    const res = await fetch("/api/adminsCommerces"); // Carga la lista de comercios
    const data = await res.json();
    return data.adminsCommerces;
}

async function checkCredentials(email, cif) {
    const commerces = await getCommerces(); // Espera a que se cargue la lista de comercios
    return commerces.find((commerce) => commerce.email === email && commerce.cif === cif); // Comprueba si existe un comercio con el email y el cif introducidos
}

async function getID(email, cif) {
    const commerces = await getCommerces(); 
    return commerces.find((commerce) => commerce.email === email && commerce.cif === cif).id; // Devuelve el id del comercio con el email y el cif introducidos
}

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [cif, setCif] = useState("");
    const [alerts, setAlerts] = useState([]);
    const router = useRouter();

    const addAlert = (message, type) => {
        setAlerts(prevAlerts => [...prevAlerts, { message, type }]);
    };

    const handleLogin = async () => {
        try {
            const isValid = await checkCredentials(email, cif);
            
            if (isValid) {
                // Redirección a la página principal y guardado de datos en el localStorage
                const id = await getID(email, cif);
                router.push(`/commerces/edit/${id}`);
            } else {
                // Muestra un mensaje de error si las credenciales son incorrectas
                console.error("Incorrect email or password");
                addAlert("Incorrect email or password", "danger");
            }
        } catch (error) {
            // Muestra un mensaje de error si ocurre un error inesperado
            console.error("Error during login:", error);
            addAlert("An unexpected error occurred. Please try again.", "danger");
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleLogin();
        }
    };

    return (
        <div className="container py-5 h-100 my-5">
            <div className="row d-flex justify-content-center align-items-center h-100">
                <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                    <div id="liveAlertPlaceholder" className="text-center">
                        {alerts.map((alert, index) => (
                            <Alert key={index} message={alert.message} type={alert.type} />
                        ))}
                    </div>
                    <div className="card shadow-2-strong">
                        <div className="card-body p-5 text-center">
                            <h3 className="mb-5">Porlta de Comercios</h3>

                            <div className="form-outline mb-4">
                                <label className="form-label" htmlFor="email">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    className="form-control form-control-lg"
                                    placeholder="email..."
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    onKeyDown={handleKeyPress} />
                            </div>

                            <div className="form-outline mb-4">
                                <label className="form-label" htmlFor="passwd">
                                    Contraseña
                                </label>
                                <input
                                    type="password"
                                    id="passwd"
                                    className="form-control form-control-lg"
                                    value={cif}
                                    onChange={(e) => setCif(e.target.value)}
                                    onKeyDown={handleKeyPress}/>
                            </div>

                            <button
                                className="btn btn-success btn-lg btn-block"
                                type="button"
                                onClick={handleLogin}>Entrar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}