import { createSlice } from "@reduxjs/toolkit";

export const messagesSlice = createSlice({
    name: 'messages',
    initialState: {
        lastTxPlainMessage: "",
        lastRxPlainMessage: "",
        txMessages: [],
        rxMessages: [],
        connected: false,
        messages: [],
    },
    reducers: {
        addTxMessage(state, { payload }) {
            state.messages.push({ ...payload, timestamp: Date.now(), sentMessage: true })
        },
        setLastTxPlainMessage(state, { payload }) {
            state.lastTxPlainMessage = payload;
        },
        addRxMessage: function (state, { payload }) {
            state.messages.push({ ...payload, timestamp: Date.now(), sentMessage: false })
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