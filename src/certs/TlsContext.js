import forge from 'node-forge';
import { createContext } from "react";
import { useDispatch } from "react-redux";
import {addPeerCert as sliceAddPeerCert, setCertAndPrivateKey} from "../redux/certsSlice"
import { setLastTxPlainMessage,addTxMessage,messageRxPlain,connectionEstablished, addRxMessage } from "../redux/msgSlice"

const TlsContext = createContext();

export { TlsContext } 

const TlsContextProvider = ({children}) => {
    let tls 
    let connection
    let caStore = forge.pki.createCaStore();
    const dispatch = useDispatch();
    
    const handleTxMessage = (encryptedMessage) => (dispatch,getState) =>{
        let isConnected = getState().messages.connected
        if (isConnected){
          let plainMessage = getState().messages.lastTxPlainMessage;
          dispatch(addTxMessage({encrypted:encryptedMessage,plain:plainMessage,type:"chat"}))
        } else {
          dispatch(addTxMessage({encrypted:encryptedMessage,plain:"",type:"handshake"}))
        }
    }

    const connect = (isClient)=>{
        let conn = forge.tls.createConnection({
            server: !isClient,
            caStore: tls.caStore,
            sessionCache:{},
            cipherSuites: [
                forge.tls.CipherSuites.TLS_RSA_WITH_AES_128_CBC_SHA,
                forge.tls.CipherSuites.TLS_RSA_WITH_AES_256_CBC_SHA],
            virtualHost: 'server',
            verifyClient: true,
            verify: function(c, verified, depth, certs) {
                // setDialogDump(prev=>prev+'certificate w/CN: \"' +
                // certs[0].subject.getField('CN').value +'\", verified: ' + verified + '...\n\n')
                console.log('TLS Client verifying certificate w/CN: \"' + certs[0].subject.getField('CN').value +
                    '\", verified: ' + verified + '...');
                return verified;
            },
            getCertificate: function(c,hint){
              console.log('cert', tls.identity.cert)
                return tls.identity.cert;
            },
            getPrivateKey: function(c, cert) {
              console.log('pk',tls.identity.privateKey)
                return tls.identity.privateKey;
            },
            tlsDataReady: function(c) {
                // send TLS data to server
                let bytes = c.tlsData.getBytes();
                console.log('sending '+btoa(bytes));
                dispatch(handleTxMessage(btoa(bytes)));
            },
            dataReady: function(c) {
                var response = c.data.getBytes();
                dispatch(messageRxPlain(response));
                console.log('received \"' + response + '\"');
            },
            heartbeatReceived: function(c, payload) {
                console.log('Client received heartbeat: ' + payload.getBytes());
            },
            connected: function(c) {
                console.log('Connected!');
                
                dispatch(connectionEstablished());
            },
            closed: function(c) {
                // setDialogDump(prev=>prev+'disconnected\n\n');
                // if(success) {
                //   console.log('PASS');
                // } else {
                //   console.log('FAIL');
                // }
            },
            error: function(c, error) {
                dispatch(addRxMessage({plain:error.message,encrypted:"",type:"error"}));
                console.log('Error: ' + error.message);
            }
        });
        if (isClient){
            conn.handshake();
        }
        tls.connection=conn
    }

    const receiveMessage = (message) =>(dispatch,getState) =>{
      console.log('receiveMessage',message)
      let isConnected = getState().messages.connected
      tls.connection.process(atob(message));

      if (isConnected) {
        let plain = getState().messages.lastRxPlainMessage;
        dispatch(addRxMessage({encrypted:message,plain:plain,type:"chat"}))
      } else {
        dispatch(addRxMessage({encrypted:message,plain:"",type:"handshake"}))
      }
    }

    const sendMessage = (message)=> (dispatch,getState)=> {
        dispatch(setLastTxPlainMessage(message))
        tls.connection.prepare(message);
    }

    const addPeerCert = (certPem)=>{
        console.log('ctx/addpc',certPem);
        let cert=forge.pki.certificateFromPem(certPem);
        let name = cert.issuer.attributes[0].value;
        let fingerprint = forge.pki.getPublicKeyFingerprint(cert.publicKey,{encoding: 'hex', delimiter: ':'});
        tls.caStore.addCertificate(certPem);
        dispatch(sliceAddPeerCert({certPem,name,fingerprint}));
    }
    const generateCertAndPrivateKey = (name) => {
        let {cert,privateKey} = createCert(name,512);
        let fingerprint = forge.pki.getPublicKeyFingerprint(cert.publicKey,{encoding: 'hex', delimiter: ':'});
        let certPem = forge.pki.certificateToPem(cert);
        let privateKeyPem = forge.pki.privateKeyToPem(privateKey);
        tls.identity={name,fingerprint,cert:certPem,privateKey:privateKeyPem}
        dispatch(setCertAndPrivateKey({name,fingerprint,certPem,privateKeyPem}))
    }
    tls = {
        connect,
        sendMessage,
        receiveMessage,
        addPeerCert,
        generateCertAndPrivateKey,

        connection,
        caStore
        
    }
    return <>
    <TlsContext.Provider value={tls}>
        {children}
    </TlsContext.Provider>
    </>
}

export default TlsContextProvider

const createCert = function(cn, bitLength) {
    console.log(
      'Generating '+bitLength+'-bit key-pair and certificate for \"' + cn + '\".');
  
      
    var keys = forge.pki.rsa.generateKeyPair(bitLength);
    console.log('key-pair created.');
    
    var cert = forge.pki.createCertificate();
    cert.serialNumber = '01';
    cert.validity.notBefore = new Date();
    cert.validity.notAfter = new Date();
    cert.validity.notAfter.setFullYear(
      cert.validity.notBefore.getFullYear() + 1);
    var attrs = [{
      name: 'commonName',
      value: cn
    }, {
      name: 'countryName',
      value: 'US'
    }, {
      shortName: 'ST',
      value: 'Virginia'
    }, {
      name: 'localityName',
      value: 'Blacksburg'
    }, {
      name: 'organizationName',
      value: 'Test'
    }, {
      shortName: 'OU',
      value: 'Test'
    }];
    cert.setSubject(attrs);
    cert.setIssuer(attrs);
    cert.setExtensions([{
      name: 'basicConstraints',
      cA: true
    }, {
      name: 'keyUsage',
      keyCertSign: true,
      digitalSignature: true,
      nonRepudiation: true,
      keyEncipherment: true,
      dataEncipherment: true
    }, {
      name: 'subjectAltName',
      altNames: [{
        type: 6, // URI
        value: 'http://myuri.com/webid#me'
      }]
    }]);
    // FIXME: add subjectKeyIdentifier extension
    // FIXME: add authorityKeyIdentifier extension
    cert.publicKey = keys.publicKey;
  
    // self-sign certificate
    cert.sign(keys.privateKey);
  
    // save data
    return {cert, privateKey:keys.privateKey};
  };