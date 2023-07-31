import { Toast, ToastContainer } from 'react-bootstrap';

export default function ClipboardToast({showSuccess,setShowSuccess,showFailed,setShowFailed}){
    return <ToastContainer
            style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
            }}>
            <Toast
                className="bg-success"
                show={showSuccess}
                onClose={() => setShowSuccess(false)}
                autohide delay={3000}>
                <Toast.Header>Clipboard</Toast.Header>
                <Toast.Body>Copied to clipboard</Toast.Body>
            </Toast>
            <Toast
                className="bg-warning"
                show={showFailed}
                onClose={() => setShowFailed(false)} >
                <Toast.Header>Clipboard</Toast.Header>
                <Toast.Body>Failed to copy to clipboard</Toast.Body>
            </Toast>
        </ToastContainer>
}