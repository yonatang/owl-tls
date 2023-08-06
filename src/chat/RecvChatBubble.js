import { useState } from "react"
import { Button } from "react-bootstrap"
import { useSelector } from "react-redux"
import ReactTimeAgo from 'react-time-ago'


export default function RecvChatBubble({ message }) {
    const { timestamp, plain, encrypted, category } = message
    const [collapsed, setCollapsed] = useState(true)
    const peerName = useSelector(state=>state.messages.peerName)

    const handleShow = () => setCollapsed(false)
    const handleHide = () => setCollapsed(true)

    const encrpytedPart = collapsed ?
        <span><Button variant="link" onClick={handleShow}>Show encrypted</Button></span>
        :
        <span><code>{encrypted}</code> [{category}] <Button variant='link' onClick={handleHide}>Hide</Button></span>

    return <>
        <p style={{ textAlign: "right" }}>
            <ReactTimeAgo date={timestamp} /> ({peerName})<br />
            {plain}<br />
            {encrpytedPart}
        </p>
    </>
}