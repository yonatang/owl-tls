import './App.css';
import { Provider } from 'react-redux'
import MyCertForm from './certs/MyCert'
import store from './redux/store'
import AddCert from './certs/AddCert';
import PeerCerts from './certs/PeerCerts';
import ChatScreen from './chat/ChatScreen';
import TlsContextProvider from './certs/TlsContext';

export default function App() {
  return (
    <Provider store={store}>
      <TlsContextProvider>
        <MyCertForm></MyCertForm>
        <AddCert></AddCert>
        <PeerCerts></PeerCerts>

        <ChatScreen></ChatScreen>
      </TlsContextProvider>
    </Provider>);
}


