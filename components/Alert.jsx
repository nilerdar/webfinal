import React from 'react';

export default function Alert({ message, type }) {
    return (
        <div className={`alert alert-${type} alert-dismissible`} role="alert">
            <div>{message}</div>
            <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    )
}