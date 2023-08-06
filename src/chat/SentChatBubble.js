import { useState } from "react";
import { Button, ToastContainer } from "react-bootstrap";
import { useSelector } from "react-redux"
import ReactTimeAgo from "react-time-ago";
import AutoHideAlert from "../AutoHideAlert";


export default function SentChatBubble({ message }) {
    const { timestamp, plain, encrypted, category } = message
    const [showAlert, setShowAlert] = useState(false);
    const [collapsed, setCollapsed] = useState(false)
    const [collapsedOnce, setCollapsedOnce] = useState(false)
    const yourName = useSelector(state => state.messages.yourName)

    const handleOnClick = () => {
        setCollapsedOnce(true)
        navigator.clipboard.writeText(encrypted).then(
            () => {
                setCollapsed(true)
                setShowAlert(true)
            }
        );
    }
    const handleShow = () => setCollapsed(false)
    const handleHide = () => setCollapsed(true)

    const encrpytedPart = collapsed ?
        <span><Button variant='link' onClick={handleShow}>Show encrypted</Button></span>
        :
        <span>
            {collapsedOnce && <><Button variant='link' onClick={handleHide}>Hide</Button>&nbsp;</>}
            <span>[{category}] <code style={{ userSelect: "all", cursor: "pointer" }} onClick={handleOnClick}>{encrypted}</code></span>
        </span>
    return <>
        <p style={{ textAlign: "left" }}>
            <ReactTimeAgo date={timestamp} />({yourName})<br />
            {encrpytedPart}
            <AutoHideAlert
                show={showAlert}
                onClose={() => setShowAlert(false)}
                delay={2000}>Copied to clipboard</AutoHideAlert>
            <br />{plain}
        </p>
    </>
}