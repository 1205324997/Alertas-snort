import { Component } from '@angular/core';

@Component({
  selector: 'app-mensaje',
  templateUrl: './mensaje.component.html',
  styleUrls: ['./mensaje.component.css'],
})
export class MensajeComponent {
  // Datos de los mensajes
  mensaje = [
    { name: 'Mensaje 1', content: 'Este es el contenido del mensaje 1' },
    { name: 'Mensaje 2', content: 'Este es el contenido del mensaje 2' },
    { name: 'Mensaje 3', content: 'Este es el contenido del mensaje 3' },
    { name: 'Mensaje 4', content: 'Este es el contenido del mensaje 4' },
    { name: 'Mensaje 5', content: 'Este es el contenido del mensaje 5' },
    { name: 'Mensaje 6', content: 'Este es el contenido del mensaje 6' },
    { name: 'Mensaje 7', content: 'Este es el contenido del mensaje 7' },
    { name: 'Mensaje 8', content: 'Este es el contenido del mensaje 8' },
    { name: 'Mensaje 9', content: 'Este es el contenido del mensaje 9' },
    { name: 'Mensaje 10', content: 'Este es el contenido del mensaje 10' },
  ];

  // Variable que controla si los mensajes se deben mostrar
  showMensajes = false;

  // Función para alternar la visibilidad de los mensajes
  toggleMensajes(): void {
    this.showMensajes = !this.showMensajes;
  }
}
