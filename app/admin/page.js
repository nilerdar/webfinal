"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import "bootstrap/dist/css/bootstrap.css";
import Alert from "@/components/Alert";

async function getAdmins() {
    const res = await fetch("/api/admins");
    const data = await res.json();
    return data.admins;
}

async function checkCredentials(email, password) {
    const admins = await getAdmins();   // Carga la lista de administradores
    return admins.some((admin) => admin.email === email && admin.password === password); // Comprueba si existe un administrador con el email y la contraseña introducidos
}

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [alerts, setAlerts] = useState([]);
    const router = useRouter();

    const addAlert = (message, type) => {
        setAlerts(prevAlerts => [...prevAlerts, { message, type }]);
    };

    const handleLogin = async () => {
        try {
            const isValid = await checkCredentials(email, password);
    
            if (isValid) {
                // Redirección a la página principal y guardado de datos en el localStorage
                router.push("/admin/commerces");
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
                    <div className="card shadow-2-strong" style={{ borderRadius: "1rem" }}>
                        <div className="card-body p-5 text-center">
                            <h3 className="mb-5">Portal de administrador</h3>

                            <div className="form-outline mb-4">
                                <label className="form-label" htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    className="form-control form-control-lg"
                                    placeholder=""
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    onKeyDown={handleKeyPress}/>
                            </div>

                            <div className="form-outline mb-4">
                                <label className="form-label" htmlFor="passwd">Contraseña</label>
                                <input
                                    type="password"
                                    id="passwd"
                                    className="form-control form-control-lg"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onKeyDown={handleKeyPress}/>
                            </div>

                            <button
                                className="btn btn-primary btn-lg btn-block"
                                type="button"
                                onClick={handleLogin}>Entrar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
