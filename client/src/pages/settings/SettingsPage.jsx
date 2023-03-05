import { Link, Routes, Route, useLocation } from "react-router-dom";
import Account from "./Account";
import Privacy from "./Privacy";
import './settings.css'
import { UserState } from "../../Context/UserProvider";
import { FaUser, FaWrench } from 'react-icons/fa'

const SettingsPage = () => {
  const { user } = UserState();
  const location = useLocation();

  useEffect(() => {
    if (user === null) return navigate('/')
  }, [user])

  return (
    <>
      {user && <div className="settings relative">
        <div className="settings-nav">
          <ul>
            <li>
              <h3 className="category">Account</h3>
              <div className="links">
                <Link to={"/settings"} className={`${(location.pathname === '/settings' || location.pathname === '/settings/account') ? 'active' : ''}`}>
                  <FaUser className="nav-icon" />
                  <p>Account</p>
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
            <Route path="/" element={<Account />} />
            <Route path="/account" element={<Privacy />} />
            {/* <Route path="/privacy" element={<Privacy />} /> */}
          </Routes>
        </div>
      </div >}
    </>
  );
}



export default SettingsPage;
