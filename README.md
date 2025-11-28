# AquaSentinel Frontend

Sistema de monitoreo de calidad de agua en ríos - Interfaz de usuario.

## 🚀 Tecnologías

- **Next.js 14** - Framework React con App Router
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos utilitarios
- **Axios** - Cliente HTTP
- **Lucide React** - Iconos
- **Recharts** - Gráficos (opcional)

## 🎨 Paleta de Colores

| Tipo | Color | Código HEX | Uso |
|------|-------|-----------|-----|
| Primario | Azul río | `#0077B6` | Fondo principal, encabezados |
| Secundario | Naranja alerta | `#FF6B35` | Botones, alertas, notificaciones |
| Complementario | Verde selva | `#2A9D8F` | Indicadores "ok" / datos normales |
| Neutro claro | Gris claro | `#E5E5E5` | Fondos de paneles, tarjetas |
| Neutro oscuro | Gris oscuro | `#333333` | Texto principal, íconos |

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Copiar archivo de entorno
cp .env.local.example .env.local

# Editar .env.local con la URL de tu API
# NEXT_PUBLIC_API_URL=http://tu-servidor/api
```

## 🏃 Ejecución

```bash
# Modo desarrollo
npm run dev

# Compilar para producción
npm run build

# Ejecutar en producción
npm start
```

El servidor se iniciará en [http://localhost:3000](http://localhost:3000)

## 📁 Estructura del Proyecto

```
frontend/
├── src/
│   ├── app/                    # App Router de Next.js
│   │   ├── dashboard/         # Página principal
│   │   ├── login/             # Autenticación
│   │   ├── rios/              # Gestión de ríos
│   │   ├── minas/             # Gestión de minas
│   │   ├── mantenimiento/     # Estado de sensores
│   │   ├── layout.tsx         # Layout principal
│   │   ├── page.tsx           # Página de inicio
│   │   └── globals.css        # Estilos globales
│   ├── components/            # Componentes reutilizables
│   │   ├── Navbar.tsx         # Barra de navegación
│   │   ├── Card.tsx           # Tarjeta genérica
│   │   ├── StatCard.tsx       # Tarjeta de estadísticas
│   │   └── AlertBadge.tsx     # Badge de alertas
│   ├── lib/                   # Utilidades
│   │   └── api.ts             # Cliente API con Axios
│   └── types/                 # Definiciones TypeScript
│       └── index.ts           # Tipos de datos
├── public/                    # Archivos estáticos
│   └── logo.png              # Logo del proyecto
├── tailwind.config.ts        # Configuración Tailwind
├── tsconfig.json             # Configuración TypeScript
├── next.config.js            # Configuración Next.js
└── package.json              # Dependencias
```

## 🔐 Autenticación

El sistema utiliza JWT para autenticación. El token se almacena en `localStorage` y se envía automáticamente en cada petición mediante interceptores de Axios.

## 📡 Conexión con la API

La aplicación se conecta a la API REST del backend. Asegúrate de:

1. Configurar la URL de la API en `.env.local`
2. Que el servidor API esté corriendo
3. Que CORS esté configurado correctamente en el backend

## 🎯 Funcionalidades

- ✅ Dashboard con estadísticas en tiempo real
- ✅ Gestión de ríos monitoreados
- ✅ Registro de minas y niveles de contaminación
- ✅ Estado de mantenimiento de sensores
- ✅ Sistema de autenticación
- ✅ Alertas visuales por nivel de contaminación
- ✅ Interfaz responsive

## 🔧 Configuración Adicional

### Variables de Entorno

```env
NEXT_PUBLIC_API_URL=http://localhost/api
```

### Personalización de Colores

Los colores están definidos en `tailwind.config.ts` y pueden ser modificados según necesidad:

```typescript
colors: {
  primary: '#0077B6',
  secondary: '#FF6B35',
  accent: '#2A9D8F',
  // ...
}
```

## 📱 Páginas Disponibles

- `/` - Redirección al dashboard
- `/login` - Inicio de sesión
- `/dashboard` - Panel principal con estadísticas
- `/rios` - Lista y gestión de ríos
- `/minas` - Lista y gestión de minas
- `/mantenimiento` - Estado de sensores

## 🐛 Solución de Problemas

### Error de conexión con la API

Verifica que:
- La URL de la API en `.env.local` sea correcta
- El servidor backend esté corriendo
- No haya problemas de CORS

### Errores de TypeScript

```bash
# Limpiar cache y reinstalar
rm -rf .next node_modules
npm install
```

## 📄 Licencia

Proyecto académico - Sistema de Monitoreo de Ríos
