import { useSelector } from "react-redux";

function PeerCerts() {
    const peerCerts = useSelector((state) => state.certs.peerCerts)
    return <>
    <h1>Peer certs:</h1>
        {peerCerts.map((cert,idx) => 
          <li key={idx} title={cert.cert}>{cert.name} ({cert.fingerprint})</li>  
        )}
    </>
}
export default PeerCerts;