"use client"
import "bootstrap/dist/css/bootstrap.css";
import Link from "next/link";
import Alert from "@/components/Alert";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

async function getUsers() {
  const res = await fetch("/api/users");
  const data = await res.json();
  return data.users;
}

async function checkCredentials(email, password) {
  const users = await getUsers(); // Carga la lista de usuarios
  return users.some((user) => user.email === email && user.password === password); // Comprueba si existe un usuario con el email y la contraseña introducidos
}

export default function LoginPage() { 
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState("");
  const [alerts, setAlerts] = useState([]);
  const router = useRouter();

  useEffect(() => {
    // Comprueba si el usuario ya está logueado
    const isLogged = localStorage.getItem("isLogged");
    if (isLogged) {
      // Si ya está logueado, redirige a la página principal
      router.push("/");
    }
  } , []);

  const addAlert = (message, type) => {
    setAlerts(prevAlerts => [...prevAlerts, { message, type }]); // Añade una alerta a la lista de alertas
  };

  const handleLogin = async () => {
    try {
      const isValid = await checkCredentials(email, password);

      if (isValid) {
        // Redirección a la página principal y guardado de datos en el localStorage
        const user = await getUsers().then((users) => users.find((user) => user.email === email));
        localStorage.setItem("isLogged", true);
        localStorage.setItem("user", JSON.stringify(user));
        window.location.reload();
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
    <div className="container py-5 h-100">
      <div className="row d-flex justify-content-center align-items-center h-100">
        <div className="col-12 col-md-8 col-lg-6 col-xl-5">
          <div id="liveAlertPlaceholder" className="text-center">
            {alerts.map((alert, index) => (
              <Alert key={index} message={alert.message} type={alert.type} />
            ))}
          </div>
          <div className="card shadow-2-strong" >
            <div className="card-body p-5 text-center">

              <h3 className="mb-5">Iniciar sesion</h3>

              <div className="form-outline mb-4">
                <label className="form-label" htmlFor="email">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  className="form-control form-control-lg" 
                  placeholder="email..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={handleKeyPress}
                />
              </div>

              <div className="form-outline mb-4">
                <label className="form-label" htmlFor="passwd">Contraseña</label>
                <input 
                  type="password" 
                  id="passwd" 
                  className="form-control form-control-lg"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyPress} 
                />
              </div>

              <button className="btn btn-primary btn-lg btn-block" type="submit" onClick={handleLogin}>Entrar</button>

              <hr className="my-5"/>

              <Link href="/register">Registrate aqui</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
