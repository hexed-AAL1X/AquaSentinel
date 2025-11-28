export interface Usuario {
  Id: string;
  Nombre: string;
  Email?: string;
  Constrasenia?: string;
  Institucion: string;
  created_at?: string;
  updated_at?: string;
}

export interface Rio {
  Id: string;
  Nombre_del_rio: string;
  Estado: string;
  Latitud?: number | null;
  Longitud?: number | null;
  Descripcion?: string | null;
  Longitud_km?: number | null;
  Cuenca?: string | null;
  NivelRiesgo?: string | null;
  Departamento?: string;
  Coordenadas?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Mina {
  Id: string;
  Nombre: string;
  Nombre_de_la_mina?: string;
  Nivel_de_polucion?: number;
  Ubicacion?: string;
  Tipo_de_minerales?: string;
  Impacto_ambiental?: string;
  Coordenadas?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Institucion {
  Id: string;
  Nombre_Instituccion: string;
  Suid0_permisos: boolean;
  Suido_permisos?: boolean;
  CodigoRegistro?: string;
  EmailContacto?: string;
  Telefono?: string;
  Pais?: string;
  Ciudad?: string;
  Razon?: string;
  created_at?: string;
  updated_at?: string;
}

export interface LecturaSensor {
  Id: string;
  Lectura_obtenida: number;
  Fecha_de_lectura: string;
  created_at?: string;
  updated_at?: string;
}

export interface PromedioLecturas {
  Id: string;
  Promedio_de_lecturas_obtenidas: number;
  Rio_asignado: string;
  Fecha_de_promedio: string;
  created_at?: string;
  updated_at?: string;
}

export interface EstadoDiario {
  Id: string;
  Rio_asignado: string;
  Promedio_de_lecturas_obtenidas_en_un_dia: number;
  Fecha_de_lecturas: string;
  created_at?: string;
  updated_at?: string;
}

export interface EstadoSemanal {
  Id: string;
  Rio_asignado: string;
  Promedio_de_promedios: number;
  Fecha_de_lecturas: string;
  created_at?: string;
  updated_at?: string;
}

export interface GrupoMinas {
  Id: string;
  Rio_cercano: string;
  created_at?: string;
  updated_at?: string;
}

export interface Mantenimiento {
  Id: string;
  Sensores_activos: number;
  Sensores_inactivos: number;
  Sensores_rotos?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any;
}

export interface LoginRequest {
  Id: string;
  Contrasenia: string;
}

export interface LoginResponse {
  token: string;
  user: Usuario;
}
