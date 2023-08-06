import { useState } from "react"
import { Button } from "react-bootstrap"
import ReactTimeAgo from 'react-time-ago'


export default function RecvChatBubble({ message }) {
    const { timestamp, plain, encrypted, category } = message
    const [collapsed, setCollapsed] = useState(true)

    const handleShow = () => setCollapsed(false)
    const handleHide = () => setCollapsed(true)

    const encrpytedPart = collapsed ?
        <span><Button variant="link" onClick={handleShow}>Show encrypted</Button></span>
        :
        <span><code>{encrypted}</code> [{category}] <Button variant='link' onClick={handleHide}>Hide</Button></span>

    return <>
        <p style={{ textAlign: "right" }}>
            <ReactTimeAgo date={timestamp} /><br />
            {plain}<br />
            {encrpytedPart}
        </p>
    </>
}