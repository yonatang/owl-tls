import Button from 'react-bootstrap/Button';
import { useContext, useState } from 'react';
import Form from 'react-bootstrap/Form';
import { useSelector } from 'react-redux';
import { TlsContext } from './TlsContext';
// import ClipboardToast from '../ClipboardToast';
// import { Alert } from 'react-bootstrap';
import AutoHideAlert from '../AutoHideAlert';

function MyCertForm() {
    const tls = useContext(TlsContext)
    const [collapsed, setCollapsed] = useState(false);
    const { name: certName, fingerprint, cert } = useSelector((state) => state.certs.identity);

    const [formName, setFormName] = useState(certName || "");

    const generateCert = function () {
        tls.generateCertAndPrivateKey(formName);
    }
    const handleFormNameChange = (e) => setFormName(e.target.value)

    const handleCertTextClick = () => {
        navigator.clipboard.writeText(cert).then(() => setShowAlert(true))
        setCollapsed(true)
    }
    const handleShow = () => setCollapsed(false)
    const handleHide = () => setCollapsed(true)
    const isDisabled = !formName
    const [showAlert, setShowAlert] = useState(false)

    return <>
        <h1>Cert details</h1>
        Name: {certName}, Cert fingerprint: {fingerprint}
        {collapsed ?
            <><br /><Button variant='link' onClick={handleShow}>Show cert</Button>
                <AutoHideAlert
                    show={showAlert}
                    onClose={() => setShowAlert(false)}
                    delay={2000}>Copied to clipboard</AutoHideAlert>
            </>
            :
            <><pre
                onClick={handleCertTextClick}
                style={{ userSelect: "all", cursor: "pointer" }}
            >{cert}</pre><Button variant='link' onClick={handleHide}>Hide</Button></>
        }

        <h1>Generate cert</h1>
        <Form.Control
            type="text"
            value={formName}
            onChange={handleFormNameChange}
        />
        <Button
            disabled={isDisabled}
            variant="primary"
            onClick={e => generateCert()}
        >Generate!</Button>
    </>
}

export default MyCertForm