import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import page_routes from './Pages/page_routes';


function App() {
  return (
    <>
      <Router>
        <Routes>
      {page_routes.map(({ path, page: Page, protected: isProtected }, index) => {
          return (
            <Route
              key={index}
              path={path}
              element={isProtected ? <Page /> : <Page />} //TEST
            />
          );
        })}
      </Routes>
    </Router>
    </>
  )
}

export default App
