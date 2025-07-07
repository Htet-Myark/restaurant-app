// client/src/Router.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TablePage from './Pages/TablePage';
import AdminDashboard from './Pages/AdminDashboard';

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/table/:tableId" element={<TablePage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="*" element={<div style={{ padding: 20 }}>404 - Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
