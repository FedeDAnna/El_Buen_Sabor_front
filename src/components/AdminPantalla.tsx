// src/components/AdminLayout.tsx
import React from 'react';
import Sidebar from './Sidebar';
import '../estilos/AdminPantalla.css';


function AdminPantalla({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-layout">
      <Sidebar />
      <main className="content">
        {children}
      </main>
    </div>
  );
}
export default AdminPantalla