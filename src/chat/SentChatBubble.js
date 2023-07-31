import { useState } from "react";
import { Button, ToastContainer } from "react-bootstrap";
import ReactTimeAgo from "react-time-ago";
import ClipboardToast from "../ClipboardToast";


export default function SentChatBubble({ message }) {
    const { timestamp, plain, encrypted, category } = message
    const [showToast, setShowToast] = useState(false);
    const [showFailedToast, setShowFailedToast] = useState(false);
    const [collapsed, setCollapsed] = useState(false)
    const [collapsedOnce, setCollapsedOnce] = useState(false)
    const handleOnClick = () => {
        setCollapsedOnce(true)
        navigator.clipboard.writeText(encrypted).then(
            () => {
                setCollapsed(true)
                setShowToast(true)
            },
            () => showFailedToast(true)
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
        <ClipboardToast showFailed={showFailedToast} showSuccess={showToast} setShowFailed={setShowFailedToast} setShowSuccess={setShowToast} />

        <p style={{ textAlign: "left" }}>
            <ReactTimeAgo date={timestamp} /><br />
            {encrpytedPart}
            <br />{plain}
        </p>
    </>
}