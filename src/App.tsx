/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { GlobalFiltersProvider } from './contexts/GlobalFiltersContext';

// Lazy loaded components
const Dashboard = lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })));
const Trucks = lazy(() => import('./pages/admin/Trucks').then(m => ({ default: m.Trucks })));
const Harvest = lazy(() => import('./pages/Harvest').then(m => ({ default: m.Harvest })));
const HarvestDetail = lazy(() => import('./pages/HarvestDetail').then(m => ({ default: m.HarvestDetail })));
const Fuel = lazy(() => import('./pages/Fuel').then(m => ({ default: m.Fuel })));
const Stock = lazy(() => import('./pages/Stock').then(m => ({ default: m.Stock })));
const Settings = lazy(() => import('./pages/Settings').then(m => ({ default: m.Settings })));
const Safras = lazy(() => import('./pages/admin/Safras').then(m => ({ default: m.Safras })));
const Talhoes = lazy(() => import('./pages/admin/Talhoes').then(m => ({ default: m.Talhoes })));
const Crops = lazy(() => import('./pages/admin/Crops').then(m => ({ default: m.Crops })));
const Users = lazy(() => import('./pages/admin/Users').then(m => ({ default: m.Users })));
const Profile = lazy(() => import('./pages/Profile').then(m => ({ default: m.Profile })));
const Machines = lazy(() => import('./pages/admin/Machines').then(m => ({ default: m.Machines })));
const Financial = lazy(() => import('./pages/Financial').then(m => ({ default: m.Financial })));
const FinancialDetail = lazy(() => import('./pages/FinancialDetail').then(m => ({ default: m.FinancialDetail })));
const Activities = lazy(() => import('./pages/Activities').then(m => ({ default: m.Activities })));
const ActivityDetail = lazy(() => import('./pages/ActivityDetail').then(m => ({ default: m.ActivityDetail })));
const StockDetail = lazy(() => import('./pages/StockDetail').then(m => ({ default: m.StockDetail })));
const FuelDetail = lazy(() => import('./pages/FuelDetail').then(m => ({ default: m.FuelDetail })));
const MachineDetail = lazy(() => import('./pages/MachineDetail').then(m => ({ default: m.MachineDetail })));
const TruckDetail = lazy(() => import('./pages/TruckDetail').then(m => ({ default: m.TruckDetail })));

// Loading component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
  </div>
);

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <GlobalFiltersProvider>
      <Router>
        <Layout onLogout={() => setIsAuthenticated(false)}>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/harvest" element={<Harvest />} />
              <Route path="/harvest/:id" element={<HarvestDetail />} />
              <Route path="/fuel" element={<Fuel />} />
              <Route path="/fuel/:id" element={<FuelDetail />} />
              <Route path="/stock" element={<Stock />} />
              <Route path="/stock/:id" element={<StockDetail />} />
              <Route path="/financial" element={<Financial />} />
              <Route path="/financial/:id" element={<FinancialDetail />} />
              <Route path="/activities" element={<Activities />} />
              <Route path="/activities/:id" element={<ActivityDetail />} />
              
              <Route path="/admin/safras" element={<Safras />} />
              <Route path="/admin/talhoes" element={<Talhoes />} />
              <Route path="/admin/machines" element={<Machines />} />
              <Route path="/admin/machines/:id" element={<MachineDetail />} />
              <Route path="/admin/trucks" element={<Trucks />} />
              <Route path="/admin/trucks/:id" element={<TruckDetail />} />
              <Route path="/admin/crops" element={<Crops />} />
              <Route path="/admin/users" element={<Users />} />
              
              <Route path="/settings" element={<Settings />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </Suspense>
        </Layout>
      </Router>
    </GlobalFiltersProvider>
  );
}
