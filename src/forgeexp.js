import forge from 'node-forge';
// function to create certificate
var createCert = function(cn, data) {
    console.log(
      'Generating 512-bit key-pair and certificate for \"' + cn + '\".');
  
      
    // var keys = forge.pki.ed25519.generateKeyPair(); 
    var keys = forge.pki.rsa.generateKeyPair(1024);
    console.log('key-pair created.');
    // console.log(keys)
    // console.log(forge.pki.ed25519.generateKeyPair())
    
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
    console.log(cert);
  
    // save data
    data[cn] = {
      cert: forge.pki.certificateToPem(cert),
      privateKey: forge.pki.privateKeyToPem(keys.privateKey)
    };
  
    console.log('certificate created for \"' + cn + '\": \n' + data[cn].cert);
  };
  
  var end = {};
  var data = {};
  
  // create certificate for server and client
  createCert('server', data);
  createCert('client', data);
  
  var success = false;
  
  // create TLS client
  end.client = forge.tls.createConnection({
    server: false,
    caStore: [data.server.cert],
    sessionCache: {},
    // supported cipher suites in order of preference
    cipherSuites: [
      // forge.tls.CipherSuites.TL
      forge.tls.CipherSuites.TLS_RSA_WITH_AES_128_CBC_SHA,
      forge.tls.CipherSuites.TLS_RSA_WITH_AES_256_CBC_SHA],
    virtualHost: 'server',
    verify: function(c, verified, depth, certs) {
      console.log(
        'TLS Client verifying certificate w/CN: \"' +
        certs[0].subject.getField('CN').value +
        '\", verified: ' + verified + '...');
      return verified;
    },
    connected: function(c) {
      console.log('Client connected...');
  
      // send message to server
      setTimeout(function() {
        // c.prepareHeartbeatRequest('heartbeat');
        c.prepare('Hello Server');
        c.prepare('Hello Server 2');
      }, 1);
    },
    getCertificate: function(c, hint) {
      console.log('Client getting certificate ...');
      return data.client.cert;
    },
    getPrivateKey: function(c, cert) {
      return data.client.privateKey;
    },
    tlsDataReady: function(c) {
      // send TLS data to server
      let bytes = c.tlsData.getBytes();
      console.log('client sending '+btoa(bytes));
      end.server.process(bytes);
    },
    dataReady: function(c) {
      var response = c.data.getBytes();
      console.log('Client received \"' + response + '\"');
      success = (response === 'Hello Client');
      // c.close();
    },
    heartbeatReceived: function(c, payload) {
      console.log('Client received heartbeat: ' + payload.getBytes());
    },
    closed: function(c) {
      console.log('Client disconnected.');
      if(success) {
        console.log('PASS');
      } else {
        console.log('FAIL');
      }
    },
    error: function(c, error) {
      console.log('Client error: ' + error.message);
    }
  });
  
  // create TLS server
  end.server = forge.tls.createConnection({
    server: true,
    caStore: [data.client.cert],
    sessionCache: {},
    // supported cipher suites in order of preference
    cipherSuites: [
      forge.tls.CipherSuites.TLS_RSA_WITH_AES_128_CBC_SHA,
      forge.tls.CipherSuites.TLS_RSA_WITH_AES_256_CBC_SHA],
    connected: function(c) {
      console.log('Server connected');
      setTimeout(function(){
        c.prepare('True from server! True from server! True from server!');
      },5)
      // c.prepareHeartbeatRequest('heartbeat');
    },
    verifyClient: true,
    verify: function(c, verified, depth, certs) {
      console.log(
        'Server verifying certificate w/CN: \"' +
        certs[0].subject.getField('CN').value +
        '\", verified: ' + verified + '...');
      return verified;
    },
    getCertificate: function(c, hint) {
      console.log('Server getting certificate for \"' + hint[0] + '\"...');
      return data.server.cert;
    },
    getPrivateKey: function(c, cert) {
      return data.server.privateKey;
    },
    tlsDataReady: function(c) {
      // send TLS data to client
      let bytes = c.tlsData.getBytes();
      console.log('server sending '+btoa(bytes));
      end.client.process(bytes);
    },
    dataReady: function(c) {
      console.log('Server received \"' + c.data.getBytes() + '\"');
  
      // send response
      c.prepare('Hello Client');
      // c.close();
    },
    heartbeatReceived: function(c, payload) {
      console.log('Server received heartbeat: ' + payload.getBytes());
    },
    closed: function(c) {
      console.log('Server disconnected.');
    },
    error: function(c, error) {
      console.log('Server error: ' + error.message);
    }
  });
  
  console.log('created TLS client and server, doing handshake...');
  end.client.handshake();
  
//   console.log(forge.pki);
//   var keys = forge.pki.rsa.generateKeyPair(512);
//   console.log(keys);
//   // If you want to start measuring performance in your app, pass a function
//   // to log results (for example: reportWebVitals(console.log))
//   // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//   reportWebVitals();
  