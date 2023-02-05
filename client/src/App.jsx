
import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom'
import Home from "./pages/home/Home";
import Chat from "./pages/chat/Chat";
import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SettingsPage from './pages/settings/SettingsPage';
import Header from './components/Header/Header';
import { ChatState } from './Context/ChatProvider';
import { useState } from 'react';

function App() {
  const location = useLocation()
  const { user } = ChatState()
  const [showHeader, setShowHeader] = useState(false);

  useEffect(() => {
    if (location.pathname !== '/' && user) setShowHeader(true);
    else setShowHeader(false);
  }, [location.pathname, user])

  return (
    <>
      {(showHeader) && (
        <Header />
      )}
      <div className={`app ${showHeader ? 'isHeader' : ''}`}>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/chats/*' element={<Chat />} />
          <Route path='/settings/*' element={<SettingsPage />} />
        </Routes>
      </div>
      <ToastContainer
        position="top-right"
        hideProgressBar={false}
        closeOnClick={false}
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  );
}
export default App;
