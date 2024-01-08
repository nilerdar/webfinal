"use client"
import "bootstrap/dist/css/bootstrap.css";
import { v4 as uuidv4 } from "uuid";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [user, setUser] = useState({ name: "", email: "", password: "", age: 0, ciudad: "", interest: "", offer: false, id: "" });
  const router = useRouter();

  const handleAddUser = async () => {
    user.id = uuidv4(); // genera un id único para el usuario

    fetch("/api/users", { // añade el usuario a la lista de usuarios
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user)
    })
        .then((res) => res.json())
        .then((data) => console.log(data))

    setUser({ name: "", email: "", password: "", age: 0, ciudad: "", interest: "Food", offer: false, id: "" }); // limpia los campos del formulario
    router.push("/");
  };

  return (
    <div className="container py-5 h-80">
      <div className="row d-flex justify-content-center align-items-center h-100">
        <div className="col-12 col-md-8 col-lg-6 col-xl-5">
          <div className="card shadow-2-strong" style={{ borderRadius: "1rem" }}>
            <div className="card-body p-4 text-center">

              <h3 className="mb-3">Registrate</h3>

              <div className="form-outline mb-2">
                <label className="form-label" htmlFor="name">Nombre</label>
                <input 
                  type="text" 
                  id="name" 
                  className="form-control" 
                  placeholder=""
                  value={user.name}
                  onChange={(e) =>
                    setUser({ ...user, name: e.target.value })
                  }
                />
              </div>

              <div className="form-outline mb-2">
                <label className="form-label" htmlFor="email">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  className="form-control" 
                  placeholder=""
                  value={user.email}
                  onChange={(e) =>
                    setUser({ ...user, email: e.target.value })
                  }
                />
              </div>

              <div className="form-outline mb-2">
                <label className="form-label" htmlFor="passwd">Contraseña</label>
                <input 
                  type="password" 
                  id="passwd" 
                  className="form-control"
                  value={user.password}
                  onChange={(e) =>
                    setUser({ ...user, password: e.target.value })
                  } 
                />
              </div>

              <div className="form-outline mb-2">
                <label className="form-label" htmlFor="edad">Edad</label>
                <input 
                  type="number" 
                  id="edad" 
                  className="form-control"
                  value={user.age}
                  onChange={(e) =>
                    setUser({ ...user, age: e.target.value })
                  }
                />
              </div>

              <div className="form-outline mb-2">
                <label className="form-label" htmlFor="ciudad">Ciudad</label>
                <input 
                  type="text" 
                  id="ciudad" 
                  className="form-control"
                  value={user.ciudad}
                  onChange={(e) =>
                    setUser({ ...user, ciudad: e.target.value })
                  }
                />
              </div>

              <div className="form-outline mb-4">
                <label className="form-label" htmlFor="intereses">Intereses</label>
                <select className="form-select form-control" id="intereses" aria-label="Selecciona un interés" value={user.interest} onChange={(e) => setUser({ ...user, interest: e.target.value })}>
                  <option value="Intereses">Intereses</option>
                  <option value="Comida">Comida</option>
                  <option value="Tecnología">Tecnología</option>
                  <option value="Deportes">Deportes</option>
                  <option value="Arte">Arte</option>
                  <option value="Música">Música</option>
                  <option value="Cine">Cine</option>
                  <option value="Libros">Libros</option>
                  <option value="Viajes">Viajes</option>
                  <option value="Bares">Bares</option>
                  <option value="Restaurantes">Restaurantes</option>
                </select>
              </div>


              <div className="form-outline mb-2">
                <input 
                  type="checkbox" 
                  className="form-check-input mr-1" 
                  id="ofertas"
                  value={user.offer}
                  onChange={(e) =>
                    setUser({ ...user, offer: e.target.checked })
                    // console.log(e.target.checked)
                  }
                />
                <label className="form-label" htmlFor="ofertas">Recibir ofertas?</label>
              </div>

              <button className="btn btn-primary btn-lg btn-block mt-4" type="submit" onClick={handleAddUser}>Registrarse</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
