import { useEffect } from "react"
import { Alert } from "react-bootstrap";

export default function AutoHideAlert({ children, onClose, show, delay }) {
    useEffect(() => {
        if (show) {
            const tid = setTimeout(() => onClose(), delay)
            return () => clearTimeout(tid)
        }
    }, [show]);
    return <Alert
        className='d-inline-block'
        variant="success"
        style={{ maxWidth: "200px" }}
        show={show}>{children}</Alert>
}