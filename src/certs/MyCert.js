import Button from 'react-bootstrap/Button';
import { generalizedTimeToDate } from 'node-forge/lib/asn1';
import { useContext, useState } from 'react';
import Form from 'react-bootstrap/Form';
import { useDispatch, useSelector } from 'react-redux';
import { generateCertAndPrivateKey } from '../redux/certsSlice';
import { TlsContext } from './TlsContext';

function MyCertForm(){
    const dispatch = useDispatch()
    const tls=useContext(TlsContext)
    const {name:certName,fingerprint,cert}=useSelector((state)=>state.certs.identity);

    // const certName = useSelector((state) => state.certs.certName)
    // const cert = useSelector((state) => state.certs.cert)
    // const pk = useSelector((state)=>state.certs.privateKey)

    const [formName, setFormName] = useState(certName||"");

    const generateCert = function(){
        tls.generateCertAndPrivateKey(formName);
        console.log(formName)
        // dispatch(generateCertAndPrivateKey(formName))
    }
    const handleFormNameChange=(e)=>setFormName(e.target.value)
    const isDisabled = !formName
    return <>
        <h1>Cert details</h1>
        Name: {certName}, Cert fingerprint: {fingerprint}
        <pre style={{userSelect: "all", cursor: "pointer"}}>{cert}</pre>
        <h1>Generate cert</h1>
            <Form.Control 
                type="text" 
                value={formName}
                onChange={handleFormNameChange}
            />
            <Button 
                disabled={isDisabled}
            variant="primary"
                onClick={e=>generateCert()}
            >Generate!</Button>
    </>
}

export default MyCertForm