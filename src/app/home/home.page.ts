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
  IonToolbar,
  IonIcon,
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
    IonButton, IonIcon, NgIf
  ],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss']
})
export class HomePage implements OnInit, OnDestroy {
  latitude = signal<number | null>(null);
  longitude = signal<number | null>(null);
  watchId: string | null = null;
  errorMsg = signal<string | null>(null);

  // Cooordenadas
  readonly DESTINO_LAT = -0.0753388; 
  readonly DESTINO_LNG = -78.4450883;

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

  async mostrarRutaDestino() {
    if (this.latitude() === null || this.longitude() === null) {
      await this.obtenerUbicacionActual();
      if (this.latitude() === null || this.longitude() === null) {
        this.errorMsg.set('No se pudo obtener la ubicación actual para trazar la ruta.');
        return;
      }
    }

    const latActual = this.latitude();
    const lngActual = this.longitude();
    const urlRuta = `https://www.google.com/maps/dir/?api=1&origin=${latActual},${lngActual}&destination=${this.DESTINO_LAT},${this.DESTINO_LNG}`;

    window.open(urlRuta, '_system');
  }

  async obtenerUbicacionActualtxt() {
    if (this.latitude() === null || this.longitude() === null) {
      await this.obtenerUbicacionActual();
    }

    const lat = this.latitude();
    const lng = this.longitude();

    if (lat === null || lng === null) {
      this.errorMsg.set('No se pudo obtener la ubicación para guardar el archivo.');
      return;
    }

    const contenido = `REPORTE DE UBICACIÓN
----------------------------------------
Fecha: ${new Date().toLocaleString()}
Latitud: ${lat}
Longitud: ${lng}
Enlace: https://www.google.com/maps?q=${lat},${lng}
----------------------------------------`;

    await this.ejecutarGuardadoArchivo('ubicacion_actual.txt', contenido);
  }

  async guardarRutaDestinoTxt() {
    if (this.latitude() === null || this.longitude() === null) {
      await this.obtenerUbicacionActual();
      if (this.latitude() === null || this.longitude() === null) {
        this.errorMsg.set('No se pudo obtener la ubicación para guardar la ruta.');
        return;
      }
    }

    const latActual = this.latitude();
    const lngActual = this.longitude();
    const urlRuta = `https://www.google.com/maps/dir/?api=1&origin=${latActual},${lngActual}&destination=${this.DESTINO_LAT},${this.DESTINO_LNG}`;

    const contenido = `REPORTE DE RUTA
----------------------------------------
Fecha: ${new Date().toLocaleString()}
Origen (Actual): Lat: ${latActual}, Lng: ${lngActual}
Destino: Lat: ${this.DESTINO_LAT}, Lng: ${this.DESTINO_LNG}
Enlace a la ruta: 
${urlRuta}
----------------------------------------`;

    await this.ejecutarGuardadoArchivo('ruta_destino.txt', contenido);
  }

  private async ejecutarGuardadoArchivo(fileName: string, contenido: string) {
    try {
      if (Capacitor.isNativePlatform()) {
        try {
          const permStatus = await Filesystem.checkPermissions();
          if (permStatus.publicStorage !== 'granted') {
            await Filesystem.requestPermissions();
          }
        } catch {}

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
          header: 'Archivo Guardado',
          subHeader: 'Guardado en el celular',
          message: `El archivo "${fileName}" se guardó exitosamente.\n\nRuta:\n${res.uri}`,
          buttons: ['Aceptar']
        });
        await alert.present();

      } else {
        const blob = new Blob([contenido], { type: 'text/plain;charset=utf-8' });
        const enlace = document.createElement('a');
        enlace.href = URL.createObjectURL(blob);
        enlace.download = fileName;
        enlace.click();
        URL.revokeObjectURL(enlace.href);

        this.errorMsg.set(null);
        const alert = await this.alertCtrl.create({
          header: 'Archivo Descargado',
          message: `El archivo "${fileName}" se ha descargado en tu equipo.`,
          buttons: ['Aceptar']
        });
        await alert.present();
      }
    } catch (e: any) {
      this.errorMsg.set(e?.message ?? 'Error al guardar el archivo');
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