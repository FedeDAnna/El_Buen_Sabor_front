// src/components/AdminPantalla.tsx
import React, { useState } from 'react'
import { FaBars, FaTimes } from 'react-icons/fa'
import Sidebar from './Sidebar'
import '../estilos/AdminPantalla.css'

export default function AdminPantalla({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="admin-layout">
      <header className="admin-header">
        <button
          className="admin-hamburger-btn"
          onClick={() => setSidebarOpen(o => !o)}
          aria-label="Toggle menu"
        >
          {sidebarOpen ? <FaTimes size={24}/> : <FaBars size={24}/>}
        </button>
      </header>

      {/* backdrop que cierra sidebar al clickar */}
      <div
        className={`backdrop ${sidebarOpen ? 'open' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="admin-content">
        {children}
      </main>
    </div>
  )
}
