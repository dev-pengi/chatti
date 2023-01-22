import { Button } from '@chakra-ui/react';
import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom'
import Home from "./pages/home/Home";
import Chat from "./pages/chat/Chat";
import './App.css';

function App() {

  return (
    <div className="app">
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/chat' element={<Chat />} />
      </Routes>
    </div>
  );
}
export default App;
