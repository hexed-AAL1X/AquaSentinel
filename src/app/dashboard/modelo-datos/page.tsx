'use client';

import { useEffect } from 'react';
import Script from 'next/script';
import { motion } from 'framer-motion';

const ERD_DIAGRAM = `erDiagram
  Instituciones {
    char36 Id PK
    varchar Nombre_Instituccion
    tinyint Suido_permisos
    varchar CodigoRegistro
    varchar EmailContacto
    varchar Telefono
    varchar Pais
    varchar Ciudad
    varchar Razon
  }

  Usuarios {
    char36 Id PK
    varchar Nombre
    varchar Email
    varchar Constrasenia
    varchar Institucion
  }

  AuthProviders {
    tinyint Id PK
    varchar Nombre
    varchar Descripcion
    tinyint Activo
  }

  UsuariosAuth {
    varchar Id PK
    char36 UsuarioId FK
    tinyint ProviderId FK
    varchar ExternalUserId
    tinyint EsPrincipal
  }

  PasswordResets {
    varchar Id PK
    char36 UsuarioId FK
    varchar Token
    datetime ExpiresAt
    datetime UsedAt
  }

  Rios {
    char36 Id PK
    varchar Nombre_del_rio
    varchar Estado
    decimal Latitud
    decimal Longitud
    text Descripcion
    decimal Longitud_km
    varchar Cuenca
    varchar NivelRiesgo
  }

  Minas {
    varchar Id PK
    varchar Nombre
    float Nivel_de_polucion
    timestamp created_at
    timestamp updated_at
  }

  GrupoMinasCercanas {
    varchar Id PK
    varchar Rio_cercano FK
    timestamp created_at
    timestamp updated_at
  }

  LecturaDeSensorUnitario {
    varchar Id PK
    float Lectura_obtenida
    datetime Fecha_de_lectura
    timestamp created_at
    timestamp updated_at
  }

  PromedioDeLecturasEnRios {
    varchar Id PK
    float Promedio_de_lecturas_obtenidas
    varchar Rio_asignado FK
    datetime Fecha_de_promedio
    timestamp created_at
    timestamp updated_at
  }

  EstadosDiariosDeLosRios {
    varchar Id PK
    varchar Rio_asignado FK
    float Promedio_de_lecturas_obtenidas_en_un_dia
    date Fecha_de_lecturas
    timestamp created_at
    timestamp updated_at
  }

  EstadosSemanalesDeLosRios {
    varchar Id PK
    varchar Rio_asignado FK
    float Promedio_de_promedios
    date Fecha_de_lecturas
    timestamp created_at
    timestamp updated_at
  }

  MantenimientoNos {
    varchar Id PK
    int Sensores_activos
    int Sensores_inactivos
    text Sensores_rotos
  }

  Sensores {
    char36 Id PK
    varchar Nombre
    varchar Tipo
    char36 Rio_asignado FK
    char36 Institucion FK
    decimal Latitud
    decimal Longitud
    varchar Estado
  }

  Mantenimientos {
    varchar Id PK
    char36 SensorId FK
    varchar Tipo
    text Descripcion
    varchar Estado
    datetime FechaProgramada
    datetime FechaRealizada
  }

  UmbralesAlarma {
    char36 Id PK
    char36 SensorId FK
    varchar Parametro
    float ValorMinimoAlarma
    float ValorMaximoAlarma
    varchar Unidad
    tinyint Activo
    varchar UsuarioCreacion
    datetime FechaCreacion
    varchar UsuarioModificacion
    datetime FechaModificacion
  }

  Notificaciones {
    char36 Id PK
    char36 UsuarioId FK
    char36 SensorId FK
    char36 RioId FK
    char36 UmbralId FK
    varchar Tipo
    varchar Titulo
    text Mensaje
    varchar Nivel
    varchar Canal
    tinyint Leida
    datetime FechaLectura
    varchar UsuarioCreacion
    datetime FechaCreacion
    varchar UsuarioModificacion
    datetime FechaModificacion
  }

  PreferenciasNotificacionUsuario {
    char36 UsuarioId PK,FK
    tinyint RecibirEmail
    tinyint RecibirSms
    tinyint RecibirWeb
    varchar UsuarioCreacion
    datetime FechaCreacion
    varchar UsuarioModificacion
    datetime FechaModificacion
  }

  Instituciones ||--o{ Usuarios : tiene
  Instituciones ||--o{ Sensores : tiene

  Usuarios ||--o{ UsuariosAuth : tiene
  AuthProviders ||--o{ UsuariosAuth : provee
  Usuarios ||--o{ PasswordResets : genera
  Usuarios ||--|| PreferenciasNotificacionUsuario : configura

  Rios ||--o{ Sensores : monitorea
  Rios ||--o{ PromedioDeLecturasEnRios : promedios
  Rios ||--o{ EstadosDiariosDeLosRios : diarios
  Rios ||--o{ EstadosSemanalesDeLosRios : semanales
  Rios ||--o{ GrupoMinasCercanas : grupos

  Sensores ||--o{ Mantenimientos : recibe
  Sensores ||--o{ UmbralesAlarma : umbrales
  Sensores ||--o{ Notificaciones : notifica

  Usuarios ||--o{ Notificaciones : recibe
  Rios ||--o{ Notificaciones : asociadas
  UmbralesAlarma ||--o{ Notificaciones : dispara
`;

export default function ModeloDatosPage() {
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).mermaid) {
      (window as any).mermaid.initialize({ startOnLoad: true, theme: 'neutral' });
      (window as any).mermaid.init(undefined, '.mermaid');
    }
  }, []);

  return (
    <div className="space-y-6">
      <Script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js" strategy="afterInteractive" />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#020617] via-[#0f172a] to-[#2563eb] text-white shadow-2xl border border-white/10 px-6 py-6 md:px-10 md:py-8">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <p className="uppercase tracking-[0.35em] text-xs text-sky-200/80 mb-1">
                Modelo de datos
              </p>
              <h1 className="text-2xl md:text-3xl xl:text-4xl font-bold font-display">
                Esquema de la base de datos
              </h1>
              <p className="text-xs md:text-sm text-sky-100/80 mt-1 max-w-xl">
                Visualización del diagrama ERD actual utilizado por el backend.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-2xl shadow-xl border border-neutral-light p-4 md:p-6 overflow-auto"
      >
        <div className="mermaid min-w-[600px] text-sm">
          {ERD_DIAGRAM}
        </div>
      </motion.div>
    </div>
  );
}
