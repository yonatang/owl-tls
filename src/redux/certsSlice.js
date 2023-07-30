import { createSlice } from '@reduxjs/toolkit'

export const certsSlice = createSlice({
    name: 'certs',
    initialState: {
        identity: {},
        cert:JSON.parse(localStorage.getItem('cert') || '""'),
        privateKey:JSON.parse(localStorage.getItem('privateKey') || '""'),
        peerCerts: [],
        certName:JSON.parse(localStorage.getItem('certName') || '""')
    },
    reducers: {
        addPeerCert(state, {payload}) {
            let {cert,fingerprint,name}=payload
            state.peerCerts.push({cert,fingerprint,name})
        },
        setCertAndPrivateKey(state,{payload}) {
            let {name,fingerprint,certPem:cert,privateKeyPem:privateKey} = payload
            state.identity= {name,fingerprint,cert,privateKey}
        }
    }
});

export const { addPeerCert, setCertAndPrivateKey} = certsSlice.actions
export default certsSlice.reducer
