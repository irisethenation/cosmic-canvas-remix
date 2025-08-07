import { createRoot } from 'react-dom/client'
import AdminApp from './AdminApp.tsx'
import PublicApp from './PublicApp.tsx'
import './index.css'

const mode = import.meta.env.VITE_MODE || 'public';

createRoot(document.getElementById("root")!).render(
  mode === 'admin' ? <AdminApp /> : <PublicApp />
);
