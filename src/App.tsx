import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";
import Login from "@/pages/Login";
import AdminDashboard from "@/pages/AdminDashboard";
import ClientDashboard from "@/pages/ClientDashboard";
import CalendarPage from "@/pages/CalendarPage";
import SettingsPage from "@/pages/SettingsPage";
import ClientsPage from "@/pages/ClientsPage";
import RequestsPage from "@/pages/RequestsPage";
import NotFound from "@/pages/NotFound";
import HelpCenterPage from "@/pages/HelpCenterPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              
              <Route path="/" element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }>
                <Route index element={<Navigate to="/admin" replace />} />
                
                {/* Admin Routes */}
                <Route path="/admin" element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/admin/clients" element={
                  <ProtectedRoute requiredRole="admin">
                    <ClientsPage />
                  </ProtectedRoute>
                } />
                <Route path="/admin/requests" element={
                  <ProtectedRoute requiredRole="admin">
                    <RequestsPage />
                  </ProtectedRoute>
                } />
                <Route path="/admin/calendar" element={
                  <ProtectedRoute requiredRole="admin">
                    <CalendarPage />
                  </ProtectedRoute>
                } />
                <Route path="/admin/settings" element={
                  <ProtectedRoute requiredRole="admin">
                    <SettingsPage />
                  </ProtectedRoute>
                } />
                
                {/* Help Center Route */}
                <Route path="/help" element={<HelpCenterPage />} />
                
                {/* Client Routes */}
                <Route path="/client" element={
                  <ProtectedRoute requiredRole="client">
                    <ClientDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/client/requests" element={
                  <ProtectedRoute requiredRole="client">
                    <RequestsPage />
                  </ProtectedRoute>
                } />
                <Route path="/client/clients" element={
                  <ProtectedRoute requiredRole="client">
                    <ClientsPage />
                  </ProtectedRoute>
                } />
                <Route path="/client/calendar" element={
                  <ProtectedRoute requiredRole="client">
                    <CalendarPage />
                  </ProtectedRoute>
                } />
                <Route path="/client/settings" element={
                  <ProtectedRoute requiredRole="client">
                    <SettingsPage />
                  </ProtectedRoute>
                } />
              </Route>
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
