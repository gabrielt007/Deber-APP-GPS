# 📍 MiUbicacionAPP — Aplicación Móvil con Ionic, Angular y Capacitor

<p align="center">
  <strong>ESCUELA POLITÉCNICA NACIONAL</strong><br>
  <strong>Desarrollo de Aplicaciones Móviles (DAM) — 5to Semestre</strong><br>
  <em>Proyecto: DAM-DEBER-GRPL-Toaquiza-Chulde</em>
</p>

---

## 👥 Autores
- **Gabriel Toaquiza**
- **Jossue Chulde**

**Docente:** Ing. Juan Pablo Zaldumbide  
**Institución:** Escuela Politécnica Nacional (EPN)  
**Repositorio:** [https://github.com/gabrielt007/Deber-APP-GPS.git](https://github.com/gabrielt007/Deber-APP-GPS.git)

---

## 📖 Descripción del Proyecto

**MiUbicacionAPP** es una aplicación móvil híbrida desarrollada con **Ionic Framework**, **Angular 20** y **Capacitor 7**. Su objetivo principal es capturar, visualizar y gestionar la ubicación geográfica del usuario en tiempo real haciendo uso del sensor GPS y las capacidades nativas de Android mediante `@capacitor/geolocation`.

La aplicación permite consultar las coordenadas actuales (latitud y longitud), iniciar o detener el seguimiento continuo en tiempo real, abrir la ubicación directamente en Google Maps y exportar un reporte estructurado en formato de texto plano (`.txt`).

---

## ✨ Características Principales

- 📌 **Obtención de Coordenadas Actuales:** Lectura bajo demanda de la latitud y longitud actuales con alta precisión (`enableHighAccuracy: true`).
- 🗺️ **Visualización en Google Maps:** Generación dinámica de un hipervínculo para abrir la posición exacta en Google Maps.
- 📡 **Seguimiento en Tiempo Real (Watch Position):** Monitoreo activo de la posición del usuario a medida que se desplaza, con botones para iniciar y detener el servicio.
- 💾 **Exportación de Reporte (`.txt`):** Generación y descarga automática de un archivo de texto con fecha, hora, coordenadas y enlace a mapas.
- 🛡️ **Manejo Dinámico de Permisos:** Verificación y solicitud interactiva de permisos de ubicación en tiempo de ejecución.
- 📱 **Soporte Android Nativo:** Proyecto sincronizado con Capacitor para compilación y despliegue en dispositivos Android físicos o emuladores.

---

## 🛠️ Tecnologías y Versiones

| Herramienta / Librería | Versión | Propósito |
| :--- | :--- | :--- |
| **Angular** | `^20.0.0` | Framework web reactivo con componentes standalone y Signals |
| **Ionic Angular** | `^8.0.0` | Componentes de interfaz móvil (Cards, Botones, Toolbars) |
| **Capacitor Core / CLI** | `7.4.3` | Puente entre el entorno web y el sistema operativo nativo |
| **@capacitor/android** | `7.4.3` | Plataforma nativa Android para Capacitor |
| **@capacitor/geolocation** | `^7.1.5` | Acceso a API de GPS y proveedores de ubicación |
| **@capacitor/filesystem** | `^7.1.9` | Manejo y lectura/escritura de archivos en almacenamiento |
| **@capacitor/haptics** | `7.0.2` | Respuestas táctiles y vibración del dispositivo |
| **TypeScript** | `~5.8.0` | Lenguaje de programación tipado |

---

## 🔒 Permisos Configurados en Android (`AndroidManifest.xml`)

La aplicación cuenta con todos los permisos declarados y comentados en el archivo:  
`android/app/src/main/AndroidManifest.xml`:

```xml
<!-- ================================================================= -->
<!-- PERMISOS DE LA APLICACIÓN                                         -->
<!-- ================================================================= -->

<!-- Acceso a Internet: Requerido para comunicación de red, visualización de mapas (Google Maps) y navegación -->
<uses-permission android:name="android.permission.INTERNET" />

<!-- Estado de red: Permite a la app comprobar si el dispositivo tiene conexión a Internet (Wi-Fi / Datos móviles) -->
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

<!-- Ubicación aproximada: Permite acceder a la ubicación estimada mediante celdas de telefonía y Wi-Fi -->
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />

<!-- Ubicación precisa: Permite acceder a la ubicación exacta mediante el sensor GPS satelital del dispositivo -->
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />

<!-- Declaración del hardware GPS: Indica al sistema que la app utiliza el sensor GPS para la geolocalización -->
<uses-feature android:name="android.hardware.location.gps" android:required="false" />

<!-- Almacenamiento (Lectura): Permite leer archivos del almacenamiento del dispositivo -->
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />

<!-- Almacenamiento (Escritura): Permite crear y guardar reportes o archivos (ej. ubicacion_actual.txt) -->
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />

<!-- Vibración: Permite emitir respuestas hápticas y vibración al interactuar con la app (@capacitor/haptics) -->
<uses-permission android:name="android.permission.VIBRATE" />
```

---

## 📂 Estructura del Proyecto

```text
MiUbicacionAPP_ionic/
├── android/                             # Proyecto nativo de Android Studio
│   └── app/src/main/
│       ├── AndroidManifest.xml         # Permisos y configuración de la app
│       └── java/                       # Código fuente nativo (MainActivity)
├── src/
│   ├── app/
│   │   ├── home/
│   │   │   ├── home.page.ts            # Lógica: señales, obtención, seguimiento y exportación
│   │   │   ├── home.page.html          # Interfaz de usuario con componentes Ionic
│   │   │   └── home.page.scss          # Estilos de la página principal
│   │   ├── services/
│   │   │   └── location.ts             # Servicio centralizado de Capacitor Geolocation
│   │   ├── app.component.ts            # Componente raíz
│   │   └── app.routes.ts               # Enrutamiento de la aplicación
│   ├── index.html                      # Punto de entrada HTML
│   └── main.ts                         # Bootstrap de Angular
├── capacitor.config.ts                 # Configuración de Capacitor
├── ionic.config.json                   # Configuración de Ionic CLI
├── angular.json                        # Configuración del compilador Angular
├── package.json                        # Definición de scripts y dependencias
└── README.md                           # Documentación del proyecto
```

---

## 🚀 Requisitos Previos

Asegúrate de contar con las siguientes herramientas instaladas en tu sistema:
- **Node.js**: Versión LTS compatible con Angular 20 (v18.x o superior).
- **NPM**: Gestor de paquetes incluido con Node.js.
- **Ionic CLI** *(Opcional pero recomendado)*:
  ```bash
  npm install -g @ionic/cli
  ```
- **Android Studio** (con SDK de Android y plataforma configurada para compilar en Android).
- **Dispositivo físico o emulador** con servicios de ubicación GPS habilitados.

---

## 💻 Instalación y Ejecución

### 1. Clonar el repositorio
```bash
git clone https://github.com/gabrielt007/Deber-APP-GPS.git
cd Deber-APP-GPS/MiUbicacionAPP_ionic
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Ejecutar en el navegador
Puedes correr el servidor de desarrollo local mediante:
```bash
npm start
```
O con el CLI de Ionic:
```bash
ionic serve
```
La aplicación estará disponible en `http://localhost:4200` o `http://localhost:8100`.

---

## 📱 Compilación y Despliegue en Android

Para compilar la aplicación para Android mediante Capacitor:

### 1. Compilar el código web
```bash
npm run build
```

### 2. Sincronizar con el proyecto Android
```bash
npx cap sync android
# o alternativamente:
ionic capacitor sync android
```

### 3. Abrir el proyecto en Android Studio
```bash
npx cap open android
# o alternativamente:
ionic capacitor open android
```

### 4. Generar el APK
Dentro de **Android Studio**:
1. Conecta tu teléfono mediante depuración USB o inicia un emulador de Android.
2. Ve al menú superior: **Build > Build Bundle(s) / APK(s) > Build APK(s)**.
3. El APK generado estará listo para instalar en tu dispositivo.

---

## 📋 Formato del Archivo Exportado (`ubicacion_actual.txt`)

Al presionar el botón **"Guardar Ubicación Actual"**, la aplicación genera y descarga un reporte con el siguiente formato:

```text
REPORTE DE UBICACIÓN
----------------------------------------
Fecha: 21/10/2026, 13:00:00
Latitud: -0.210345
Longitud: -78.489123
Enlace: https://www.google.com/maps?q=-0.210345,-78.489123
----------------------------------------
```

---

## ❓ Solución de Problemas Frecuentes

| Problema | Causa Posible | Solución |
| :--- | :--- | :--- |
| **Error: "Location services are not enabled"** | El GPS del dispositivo o emulador está apagado. | Encender el GPS o la ubicación en los ajustes rápidos de Android. |
| **Error de permisos en navegador** | Permiso bloqueado o sitio no seguro. | Permitir el acceso a la ubicación en el icono de candado del navegador (funciona en `localhost`). |
| **Android no refleja los cambios web** | Los archivos compilados no se han sincronizado. | Ejecutar `npm run build` y luego `ionic capacitor sync android`. |
| **Ubicación no varía en emulador** | El emulador no tiene rutas configuradas. | En la ventana del emulador, abrir el panel lateral de opciones (`...`), ir a **Location** y enviar coordenadas manuales o simular una ruta. |

---

## 📜 Licencia y Uso Académico

Este proyecto fue desarrollado exclusivamente con fines académicos como parte de las actividades prácticas de la asignatura **Desarrollo de Aplicaciones Móviles (DAM)** en la **Escuela Politécnica Nacional (EPN)**.
