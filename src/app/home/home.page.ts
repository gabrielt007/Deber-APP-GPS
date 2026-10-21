import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { NgIf } from '@angular/common';
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

  constructor(private loc: LocationService) {}

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

    // Crear y descargar el archivo .txt de forma sencilla
    const blob = new Blob([contenido], { type: 'text/plain;charset=utf-8' });
    const enlace = document.createElement('a');
    enlace.href = URL.createObjectURL(blob);
    enlace.download = 'ubicacion_actual.txt';
    enlace.click();
    URL.revokeObjectURL(enlace.href);
  }

  ngOnDestroy() {
    if (this.watchId) this.loc.clearWatch(this.watchId);
  }
}