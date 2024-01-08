import "bootstrap/dist/css/bootstrap.min.css";
import Image from 'next/image'

export default function Card(props) {
    return (
        <div className="card h-100">
            <div className="card-body d-flex flex-column align-items-center justify-content-end">
                <h5 className="card-title">Name: {props.name}</h5>
                <p className="card-text">City: {props.city}</p>
                <p className="card-text">Phone: {props.phone}</p>
                <p className="card-text">Email: {props.email}</p>
                <p className="card-text">CIF: {props.cif}</p>
                <button onClick={props.onDelete} className="btn btn-danger w-30">
                    Delete
                </button>
            </div>
        </div>
    );
}