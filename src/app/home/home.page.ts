import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { 
  AlertController,
  IonButton, 
  IonCard, 
  IonCardContent, 
  IonCardHeader, 
  IonCardTitle, 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar 
} from '@ionic/angular/standalone';
import { NgIf } from '@angular/common';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { LocationService } from '../services/location';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonCard, IonCardHeader, IonCardTitle, IonCardContent,
    IonButton, NgIf
  ],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss']
})
export class HomePage implements OnInit, OnDestroy {
  latitude = signal<number | null>(null);
  longitude = signal<number | null>(null);
  watchId: string | null = null;
  errorMsg = signal<string | null>(null);

  constructor(
    private loc: LocationService,
    private alertCtrl: AlertController
  ) {}

  async ngOnInit() {
    await this.loc.ensurePermissions();
    await this.obtenerUbicacionActual();
    await this.iniciarSeguimiento();
  }

  async obtenerUbicacionActual() {
    try {
      const pos = await this.loc.getCurrentPosition();
      this.latitude.set(pos.coords.latitude);
      this.longitude.set(pos.coords.longitude);
      this.errorMsg.set(null);
    } catch (e: any) {
      this.errorMsg.set(e?.message ?? 'Error al obtener la ubicación actual');
    }
  }

  async iniciarSeguimiento() {
    try {
      this.watchId = await this.loc.watchPosition((pos) => {
        this.latitude.set(pos.coords.latitude);
        this.longitude.set(pos.coords.longitude);
      }, (err) => {
        this.errorMsg.set(err?.message ?? 'Error en seguimiento de ubicación');
      });
    } catch (e: any) {
      this.errorMsg.set(e?.message ?? 'No se pudo iniciar el seguimiento');
    }
  }

  async detenerSeguimiento() {
    if (this.watchId) {
      await this.loc.clearWatch(this.watchId);
      this.watchId = null;
    }
  }

  // Guarda un archivo .txt con el enlace de la ubicación actual
  async obtenerUbicacionActualtxt() {
    // Si no hay coordenadas disponibles, se intentan obtener
    if (this.latitude() === null || this.longitude() === null) {
      await this.obtenerUbicacionActual();
    }

    const lat = this.latitude();
    const lng = this.longitude();

    if (lat === null || lng === null) {
      this.errorMsg.set('No se pudo obtener la ubicación para guardar el archivo.');
      return;
    }

    // Formato del contenido del archivo de texto
    const contenido = `REPORTE DE UBICACIÓN
----------------------------------------
Fecha: ${new Date().toLocaleString()}
Latitud: ${lat}
Longitud: ${lng}
Enlace: https://www.google.com/maps?q=${lat},${lng}
----------------------------------------`;

    try {
      if (Capacitor.isNativePlatform()) {
        // En celular (Android / iOS): Guardar con @capacitor/filesystem
        try {
          const permStatus = await Filesystem.checkPermissions();
          if (permStatus.publicStorage !== 'granted') {
            await Filesystem.requestPermissions();
          }
        } catch {
          // Permisos gestionados automáticamente en versiones recientes de Android
        }

        const fileName = 'ubicacion_actual.txt';
        let res;
        try {
          res = await Filesystem.writeFile({
            path: fileName,
            data: contenido,
            directory: Directory.Documents,
            encoding: Encoding.UTF8,
            recursive: true
          });
        } catch {
          // Si Documents presenta restricciones de permisos, guardar en directorio de datos de la app
          res = await Filesystem.writeFile({
            path: fileName,
            data: contenido,
            directory: Directory.Data,
            encoding: Encoding.UTF8,
            recursive: true
          });
        }

        this.errorMsg.set(null);

        const alert = await this.alertCtrl.create({
          header: 'Ubicación Guardada',
          subHeader: 'Archivo guardado en el celular',
          message: `El archivo "${fileName}" se guardó exitosamente.\n\nRuta:\n${res.uri}`,
          buttons: ['Aceptar']
        });
        await alert.present();
      } else {
        // En computadora (Navegador web): Descarga automática mediante Blob
        const blob = new Blob([contenido], { type: 'text/plain;charset=utf-8' });
        const enlace = document.createElement('a');
        enlace.href = URL.createObjectURL(blob);
        enlace.download = 'ubicacion_actual.txt';
        enlace.click();
        URL.revokeObjectURL(enlace.href);

        this.errorMsg.set(null);

        const alert = await this.alertCtrl.create({
          header: 'Ubicación Descargada',
          message: 'El archivo "ubicacion_actual.txt" se ha descargado en tu equipo.',
          buttons: ['Aceptar']
        });
        await alert.present();
      }
    } catch (e: any) {
      this.errorMsg.set(e?.message ?? 'Error al guardar el archivo de ubicación');
      const alert = await this.alertCtrl.create({
        header: 'Error al Guardar',
        message: e?.message ?? 'No se pudo generar el archivo en el dispositivo.',
        buttons: ['Aceptar']
      });
      await alert.present();
    }
  }

  ngOnDestroy() {
    if (this.watchId) this.loc.clearWatch(this.watchId);
  }
}