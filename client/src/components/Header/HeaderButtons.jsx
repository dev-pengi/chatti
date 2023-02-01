import { FaBell, FaUser, FaFileUpload } from "react-icons/fa";
import { BsFillGearFill } from 'react-icons/bs'
import { useEffect } from "react";
import tippy from 'tippy.js';
import EmptyMenu from '../Menu/EmptyMenu'
import { ChatState } from "../../Context/ChatProvider";
import { useNavigate } from "react-router-dom";

const HeaderButtons = () => {
    const navigate = useNavigate()
    const buttons = [
        "#notifications",
        "#user",
        "#settings",
    ]
    useEffect(() => {
        const buttonsTooltipConfig = {
            placement: 'bottom',
            animation: 'fade',
            arrow: false,
        }
        const notificationTip = tippy('#notifications', {
            content: "Notification",
            ...buttonsTooltipConfig,
        });
        const userTip = tippy('#user', {
            content: "Profile",
            ...buttonsTooltipConfig,
        });
        const settingsTip = tippy('#settings', {
            content: "Settings",
            ...buttonsTooltipConfig,
        });
    }, [])

    const NotificationMenu = () => {
        const NotificationButton = ({ onClick }) => {
            return (
                <button id='notifications' onClick={onClick} className='btn circle ghost'>
                    <FaBell />
                </button>
            )
        }
        return (
            <EmptyMenu Button={NotificationButton}>
                <h3 style={{ textAlign: "center", fontSize: "19px", fontWeight: "600", margin: "0 40px" }}>There is no notifications!</h3>
            </EmptyMenu>
        )
    }

    return (
        <div className="header-buttons">
            <NotificationMenu />
            <button id='user' className='btn circle ghost'>
                <FaUser />
            </button>
            <button id='settings' onClick={() => navigate('/settings')} className='btn circle ghost'>
                <BsFillGearFill />
            </button>
        </div>
    )
}

export default HeaderButtons;
