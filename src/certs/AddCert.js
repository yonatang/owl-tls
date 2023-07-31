import { useContext, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { TlsContext } from "./TlsContext";
function AddCert() {
    const tls = useContext(TlsContext)

    const [peerCert, setPeerCert] = useState("");

    const addCert = function () {
        tls.addPeerCert(peerCert);
        setPeerCert('');
    }
    return <>
        <h1>Add cert</h1>
        <Form.Control
            as="textarea"
            type="text"
            value={peerCert}
            onChange={e => setPeerCert(e.target.value)}
        />
        <Button
            variant="primary"
            onClick={e => addCert()}
        >Add</Button>

    </>
}

export default AddCert;