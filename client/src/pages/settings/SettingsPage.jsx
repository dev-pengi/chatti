import { Link, Routes, Route, useLocation } from "react-router-dom";
import Profile from "./Profile";
import Privacy from "./Privacy";
import './settings.css'
import { ChatState } from "../../Context/ChatProvider";
import { FaUser, FaWrench } from 'react-icons/fa'

const SettingsPage = () => {
  const { user } = ChatState();
  const location = useLocation();


  return (
    <>
      {user && <div className="settings relative">
        <div className="settings-nav">
          <ul>
            <li>
              <h3 className="category">Account</h3>
              <div className="links">
                <Link to={"/settings"} className={`${(location.pathname === '/settings' || location.pathname === '/settings/profile') ? 'active' : ''}`}>
                  <FaUser className="nav-icon" />
                  <p>Profile</p>
                </Link>
                {/* <Link to={"/settings/privacy"} className={`${location.pathname === '/settings/privacy' ? 'active' : ''}`}>
                  <FaWrench className="nav-icon" />
                  <p>Privacy</p>
                </Link> */}
              </div>
            </li>
          </ul>
        </div>
        <div className="settings-body">
          <Routes>
            <Route path="/" element={<Profile />} />
            <Route path="/profile" element={<Profile />} />
            {/* <Route path="/privacy" element={<Privacy />} /> */}
          </Routes>
        </div>
      </div >}
    </>
  );
}



export default SettingsPage;
