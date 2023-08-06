import { createSlice } from "@reduxjs/toolkit";

export const messagesSlice = createSlice({
    name: 'messages',
    initialState: {
        lastTxPlainMessage: "",
        lastRxPlainMessage: "",
        txMsgCounter: 0,
        rxMsgCounter: 0,
        connected: false,
        messages: [],
    },
    reducers: {
        addTxMessage(state, { payload }) {
            state.messages.push({ ...payload, timestamp: Date.now(), sentMessage: true })
            state.txMsgCounter++
        },
        setLastTxPlainMessage(state, { payload }) {
            state.lastTxPlainMessage = payload;
        },
        addRxMessage: function (state, { payload }) {
            state.messages.push({ ...payload, timestamp: Date.now(), sentMessage: false })
            state.rxMsgCounter++
        },
        messageRxPlain: function (state, { payload }) {
            state.lastRxPlainMessage = payload;
        },
        connectionEstablished: function (state) {
            state.connected = true
        }
    }
})
export const { addRxMessage,
    setLastTxPlainMessage,
    addTxMessage,
    messageRxPlain,
    connectionEstablished } = messagesSlice.actions
export default messagesSlice.reducer