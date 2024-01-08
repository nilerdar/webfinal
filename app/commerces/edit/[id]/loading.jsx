import "bootstrap/dist/css/bootstrap.css";

export default function LoadingPage() {
    return (
        <div className="text-center mt-auto">
            <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    )
}