import React from 'react';
import Header from './Header';
import Footer from './Footer';

type Props = {
  children: React.ReactNode;
};

const Layout = ({ children }: Props) => {
  return (
    <div className="layout">
      <Header />
      <div className="main-content">
        
        <div className="page-content">{children}</div>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
