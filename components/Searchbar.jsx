"use client"
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useState } from 'react';
import { useEffect } from 'react';

export default function Searchbar({ onChange }) {
    const [searchTerm, setSearchTerm] = useState("");

    const filtered = () => {
        onChange(searchTerm);
    };

    useEffect(() => {
        filtered();
    }, [searchTerm]);

    return (
        <div className="container-fluid mx-auto">
            <div className="row">
                <div className="col-lg-6 col-md-8 col-sm-10 mx-auto"> 
                    <div className="input-group mb-3">
                        <form className="w-100">
                            <input 
                                type="text" 
                                className="form-control" 
                                id="basic-url" placeholder="Buscar..." 
                                aria-describedby="basic-addon3" 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)} 
                            />
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )    
}