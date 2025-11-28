'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Droplets, BarChart3, MapPin, Settings, LogOut, User } from 'lucide-react';
import Image from 'next/image';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: BarChart3 },
    { href: '/rios', label: 'Ríos', icon: Droplets },
    { href: '/minas', label: 'Minas', icon: MapPin },
    { href: '/mantenimiento', label: 'Mantenimiento', icon: Settings },
  ];

  return (
    <nav className="bg-primary text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <Image src="/logo.png" alt="AquaSentinel" width={40} height={40} className="rounded" />
              <span className="text-xl font-bold">AquaSentinel</span>
            </Link>
            
            <div className="hidden md:flex space-x-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary-dark text-white'
                        : 'text-white/80 hover:bg-primary-dark hover:text-white'
                    }`}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-white/80 hover:bg-primary-dark hover:text-white transition-colors">
              <User size={18} />
              <span className="hidden md:inline">Perfil</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-white/80 hover:bg-secondary hover:text-white transition-colors"
            >
              <LogOut size={18} />
              <span className="hidden md:inline">Salir</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
