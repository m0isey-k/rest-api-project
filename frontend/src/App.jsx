import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import page_routes from './Layouts/page_routes';
import DefaultLayout from './Layouts/DefaultLayout';
import AuthLayout from './Layouts/AuthLayout';


function App() {
  return (
    <>
      <Router>
        <Routes>
      {page_routes.map(({ path, page: Page, layout, protected: isProtected }, index) => {
          const Layout = (() => {
            switch (layout) {
              case 'default':
                return DefaultLayout;
              case 'auth':
                return AuthLayout;
              default:
                return layout || React.Fragment;
            }
          })();
          const Element = (
            <Layout>
              <Page />
            </Layout>
          );
          return (
            <Route
              key={index}
              path={path}
              element={isProtected ? Element : Element}
            />
          );
        })}
      </Routes>
    </Router>
    </>
  )
}

export default App
