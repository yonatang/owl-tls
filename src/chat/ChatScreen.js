import { useContext, useState } from "react"
import { Button, Col, Form, InputGroup, Row } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux";
import { TlsContext } from "../certs/TlsContext";

function ChatScreen(){

    const tls=useContext(TlsContext);
    const dispatch=useDispatch();

    const txMessages = useSelector((state)=>state.messages.txMessages);
    const rxMessages = useSelector((state)=>state.messages.rxMessages);
    const isConnected=useSelector((state)=>state.messages.connected);
    
    const [textToSend,setTextToSend] = useState('');
    const [textRecv, setTextRecv] = useState('');
    const [initAsClient,setInitAsClient] = useState(false);
    const [initAsServer,setInitAsServer] = useState(false);

    const initAChat = (isClient) => {
        tls.connect(isClient)
        if (isClient) {
            setInitAsClient(true);
        } else {
            setInitAsServer(true);
        }
    }
        
    const sendText=function(){
        dispatch(tls.sendMessage(textToSend));
        setTextToSend('');
    }
    const recvText=function(){
        dispatch(tls.receiveMessage(textRecv));
        setTextRecv('');
    }

    return <>
        <Button disabled={initAsClient || initAsServer} onClick={e=>initAChat(true)}>Initiate a chat</Button>
        <Button disabled={initAsClient || initAsServer} onClick={e=>initAChat(false)}>Start a chat</Button>

        <h2>Messages sent</h2>
        {txMessages.map((m,idx)=><li key={idx}>
            [{m.type}] <code style={{userSelect: "all", cursor: "pointer"}}>{m.encrypted}</code> {m.plain}
        </li>)}

        <h2>Messages recieved</h2>
        {rxMessages.map((m,idx)=><li key={idx}>
            [{m.type}] {m.plain} <code>{m.encrypted}</code>
            </li>)}

         <Form.Group as={Row} className="mb-3">
            <Form.Label column sm="2">
                Text to send
            </Form.Label>
            <Col sm="5">
                <InputGroup>
                    <Form.Control
                        disabled={!isConnected}
                        type="text" 
                        value={textToSend} 
                        placeholder="Text to send" 
                        onChange={e=>setTextToSend(e.target.value)}
                        />
                    <Button
                        disabled={!isConnected || (!initAsClient && !initAsServer)}
                        onClick={e=>sendText()}>
                            Send
                    </Button>
                </InputGroup>
            </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3">
            <Form.Label column sm="2">
                Text received
            </Form.Label>
            <Col sm="5">
                <InputGroup>
                    <Form.Control
                        disabled={!initAsClient && !initAsServer}
                        type="text" 
                        value={textRecv} 
                        placeholder="Text that was received" 
                        onChange={e=>setTextRecv(e.target.value)}
                        />
                    <Button
                        disabled={(!initAsClient && !initAsServer)}
                        onClick={e=>recvText()}>
                            Process
                    </Button>
                </InputGroup>
            </Col>
        </Form.Group>
        
    </>
}
export default ChatScreen
