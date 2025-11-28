'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Droplets,
  Mountain,
  Activity,
  AlertTriangle,
  Building2,
  Users,
  FileText,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  BarChart3,
} from 'lucide-react';
import { useSnackbar } from '@/components/SnackbarProvider';

interface SidebarProps {
  userRole?: string;
}

export default function Sidebar({ userRole = 'user' }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { showSnackbar } = useSnackbar();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    showSnackbar({ message: 'Sesión cerrada correctamente', variant: 'success' });
    router.push('/');
  };

  const menuItems = [
    {
      name: 'Dashboard',
      icon: LayoutDashboard,
      href: '/dashboard',
      roles: ['admin', 'user', 'investigador'],
    },
    {
      name: 'Ríos',
      icon: Droplets,
      href: '/dashboard/rios',
      roles: ['admin', 'user', 'investigador'],
    },
    {
      name: 'Minas',
      icon: Mountain,
      href: '/dashboard/minas',
      roles: ['admin', 'user', 'investigador'],
    },
    {
      name: 'Mediciones',
      icon: Activity,
      href: '/dashboard/mediciones',
      roles: ['admin', 'user', 'investigador'],
    },
    {
      name: 'Anomalías',
      icon: AlertTriangle,
      href: '/dashboard/anomalias',
      roles: ['admin', 'user', 'investigador'],
    },
    {
      name: 'Instituciones',
      icon: Building2,
      href: '/dashboard/instituciones',
      roles: ['admin'],
    },
    {
      name: 'Usuarios',
      icon: Users,
      href: '/dashboard/usuarios',
      roles: ['admin'],
    },
    {
      name: 'Reportes',
      icon: FileText,
      href: '/dashboard/reportes',
      roles: ['admin', 'investigador'],
    },
    {
      name: 'Análisis',
      icon: BarChart3,
      href: '/dashboard/analisis',
      roles: ['admin', 'investigador'],
    },
  ];

  const filteredMenuItems = menuItems.filter((item) =>
    item.roles.includes(userRole)
  );

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-gradient-to-b from-[#0B63C5] via-[#0C89D6] to-[#041A3B] text-white shadow-2xl transition-all duration-300 z-40 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Logo (acts as collapse button) */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex items-center space-x-3 focus:outline-none group"
          aria-label={isCollapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
        >
          <div className="w-10 h-10 bg-white/15 backdrop-blur-sm rounded-xl flex items-center justify-center p-2 group-hover:bg-white/20 transition-colors">
            <img src="/icon.png" alt="AquaSentinel" className="w-full h-full object-contain" />
          </div>
          {!isCollapsed && (
            <div className="text-left">
              <h2 className="font-bold font-display text-lg tracking-wide">AquaSentinel</h2>
              <p className="text-xs text-white/70">Monitoreo Hídrico</p>
            </div>
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {filteredMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all duration-200 group ${
                isActive
                  ? 'bg-white text-[#0B63C5] shadow-lg'
                  : 'text-white/75 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon
                size={20}
                className={isActive ? 'text-[#0B63C5]' : 'text-white/75 group-hover:text-white'}
              />
              {!isCollapsed && (
                <span className="font-semibold text-sm tracking-wide">{item.name}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="border-t border-white/10 px-3 py-3 space-y-1">
        <Link
          href="/dashboard/configuracion"
          className="flex items-center space-x-3 px-4 py-2.5 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-all duration-200"
        >
          <Settings size={20} />
          {!isCollapsed && <span className="font-semibold text-sm tracking-wide">Configuración</span>}
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-white/80 hover:bg-red-500/15 hover:text-red-200 transition-all duration-200"
        >
          <LogOut size={20} />
          {!isCollapsed && <span className="font-semibold text-sm tracking-wide">Cerrar Sesión</span>}
        </button>
      </div>
    </aside>
  );
}
