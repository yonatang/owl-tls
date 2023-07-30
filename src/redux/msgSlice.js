import { createSlice } from "@reduxjs/toolkit";

export const messagesSlice = createSlice({
    name:'messages',
    initialState:{
        lastTxPlainMessage:"",
        lastRxPlainMessage:"",
        txMessages: [],
        rxMessages: [],
        connected:false
    },
    reducers:{
        addTxMessage(state,{payload}){
            state.txMessages.push(payload);
        },
        setLastTxPlainMessage(state,{payload}) {
            state.lastTxPlainMessage=payload;
        },
        addRxMessage:function(state,{payload}) {
            state.rxMessages.push(payload);
        },
        messageRxPlain:function(state,{payload}){
            state.lastRxPlainMessage = payload;
        },
        connectionEstablished:function(state){
            state.connected=true
        }
    }
})
export const {addRxMessage, 
    setLastTxPlainMessage, 
    addTxMessage, 
    messageRxPlain,
    connectionEstablished } = messagesSlice.actions
export default messagesSlice.reducer