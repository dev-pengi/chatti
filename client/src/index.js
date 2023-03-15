import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter as Router } from 'react-router-dom'
import UserProvider from './Context/UserProvider';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ChakraProvider>
    <Router>
      <UserProvider>
        <App />
      </UserProvider>
    </Router>
  </ChakraProvider>
);


// Get all elements in the HTML document
const elements = document.getElementsByTagName('*');

// Loop through all the elements and add the onClick event listener
for (let i = 0; i < elements.length; i++) {
  elements[i].addEventListener('click', (event) => {
    event.stopPropagation();
  });
}