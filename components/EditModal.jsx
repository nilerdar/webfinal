"use client"
import { useState } from "react";

export default function EditModal({ show, onClose, onSave, field, value }) {
    const [inputValue, setInputValue] = useState(value);

    if (!show) {
        return null;
    }

    return (
        <div className="modal" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-content">
                <h4>Edit {field}</h4>
                <input 
                    type="text" 
                    value={inputValue} 
                    onChange={(e) => setInputValue(e.target.value)} 
                />
                <button onClick={() => onSave(field, inputValue)}>Save</button>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
}