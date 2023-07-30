import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import forge from 'node-forge/lib/forge'
import { FormCheck } from 'react-bootstrap'
import certsReducer from './certsSlice'
import messagesReducer from './msgSlice'
// import certsReducer from certsSlice
export default configureStore({
  reducer: {
    certs:certsReducer,
    messages:messagesReducer,
  },
  middleware: getDefaultMiddleware=> getDefaultMiddleware({
    thunk:{
      extraArgument: {
        forge:forge,
        caStore:forge.pki.createCaStore()
      }
    }
  })
})