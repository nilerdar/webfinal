import "@/app/styles/main.css";

export default function CommerceCard({ commerce, onClick }) {
    return (
        <div className="col">
            <div className="card h-100 bg-secondary-hover" onClick={() => onClick(commerce.id)}>
                <div className="card-body">
                    <h5 className="card-title">{commerce.name}</h5>
                </div>
                <div className="card-body justify-content-between">
                    <a href={`mailto:${commerce.email}`} className="card-link">{commerce.email}</a>
                    <a href={`tel:${commerce.phone}`} className="card-link">{commerce.phone}</a>
                </div>
            </div>
        </div>
    );
}