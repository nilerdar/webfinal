"use client"
import Image from 'next/image'
import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import { useRouter } from "next/navigation";
import "../app/styles/dk.css"


export default function Navbar({ metadata }) {
    const [isLogged, setIsLogged] = useState(false);
    const [user, setUser] = useState({});
    const router = useRouter();

    useEffect(() => {
        // Use localStorage only in the client-side
        const storedUser = localStorage.getItem("user");
        const storedIsLogged = localStorage.getItem("isLogged");

        setUser(storedUser ? JSON.parse(storedUser) : {});
        setIsLogged(storedIsLogged || false);
    }, []);

    const handleLogout = (e) => {
        e.preventDefault();

        // Perform logout logic and update isLogged state
        // For example, clear localStorage and update state
        localStorage.removeItem('user');
        localStorage.removeItem('isLogged');
        setUser({});
        setIsLogged(false);
        window.location.href = "/";
    };

    const handleSearch = (e) => {
        e.preventDefault();
        // Perform search logic
    };

    return (
        <nav className="navbar p-3 border-bottom bg-light sticky-top ">
            <div className="container-fluid justify-content-lg-between justify-content-center ">
                <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
                    <div className="text-end">
                        {isLogged ? (
                            <>
                                <Link href="#" className="d-block link-body-emphasis text-decoration-none" data-bs-toggle="dropdown" aria-expanded="false">
                                    <Image src="/images/default_pfp.png" alt="Not signed in" width="32" height="32" className="rounded-circle" />
                                </Link>
                                <p className="text-body mb-0">{user.name}</p>
                                <ul className="dropdown-menu text-small">
                                    <li><Link href={`/${user.id}`} className="dropdown-item">Profile</Link></li>
                                    <li><hr className="dropdown-divider" /></li>
                                    <li><Link href="#" className="dropdown-item" onClick={handleLogout}>Log out</Link></li>
                                </ul>
                            </>
                        ) : (
                            <>
                                <Link href="#" className="d-block link-body-emphasis text-decoration-none" data-bs-toggle="dropdown" aria-expanded="false">
                                    <Image src="/images/default_pfp.png" alt="Not signed in" width="32" height="32" className="rounded-circle" />
                                </Link>
                                <ul className="dropdown-menu dropdown-menu-start text-small">
                                    <li><Link href="/login" className="dropdown-item">Iniciar sesios</Link></li>
                                    <li><Link href="/register" className="dropdown-item">Registrarse</Link></li>
                                </ul>
                            </>
                        )}
                    </div>
                </div>
                <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
                    <Link href="/" className="d-flex align-items-center mb-2 mb-lg-0 link-body-emphasis text-decoration-none">
                        {metadata.title}
                    </Link>

                    <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
                        <li><Link href="/commerces" className="nav-link px-2 link-body-emphasis">Comercios</Link></li>
                            
                        <li><Link href="/commerces/login" className="nav-link px-2 link-body-emphasis">Edita tu comercio</Link></li>

                        <li><Link href="/admin" className="nav-link px-2 link-body-emphasis">Admin</Link></li>
                    </ul>
                    
                </div>
            </div>
        </nav>
    )
}