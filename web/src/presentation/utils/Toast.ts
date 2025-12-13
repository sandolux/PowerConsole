// src/presentation/utils/Toast.ts
// Una utilidad simple para mostrar notificaciones.
// En un entorno real de React, se usaría un componente de Toast.
// Para este ejercicio, simula una notificación básica.

type ToastType = 'info' | 'success' | 'warning' | 'error';

interface ToastOptions {
  duration?: number; // Duración en milisegundos, por defecto 3000
  type?: ToastType; // Tipo de mensaje, por defecto 'info'
}

const defaultOptions: ToastOptions = {
  duration: 3000,
  type: 'info',
};

export const Toast = {
  show(message: string, options?: ToastOptions) {
    const opts = { ...defaultOptions, ...options };

    // En un entorno de navegador, podrías manipular el DOM o usar una librería
    // Para CLI o un ejemplo simple, usaremos console.log
    console.log(`[Toast - ${opts.type?.toUpperCase()}] ${message}`);

    // Si estuviéramos en un navegador y quisiéramos algo visual, sería algo así:
    /*
    const toastElement = document.createElement('div');
    toastElement.textContent = message;
    toastElement.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      padding: 10px 20px;
      background-color: ${this.getBackgroundColor(opts.type)};
      color: white;
      border-radius: 5px;
      z-index: 1000;
      opacity: 0;
      transition: opacity 0.5s ease-in-out;
    `;
    document.body.appendChild(toastElement);

    setTimeout(() => {
      toastElement.style.opacity = '1';
    }, 100); // Pequeño retraso para que la transición funcione

    setTimeout(() => {
      toastElement.style.opacity = '0';
      toastElement.addEventListener('transitionend', () => {
        toastElement.remove();
      });
    }, opts.duration);
    */
  },

  info(message: string, duration?: number) {
    this.show(message, { type: 'info', duration });
  },

  success(message: string, duration?: number) {
    this.show(message, { type: 'success', duration });
  },

  warning(message: string, duration?: number) {
    this.show(message, { type: 'warning', duration });
  },

  error(message: string, duration?: number) {
    this.show(message, { type: 'error', duration });
  },

  // Helper para simular colores de fondo si se hiciera visual
  // private getBackgroundColor(type: ToastType | undefined): string {
  //   switch (type) {
  //     case 'success': return '#4CAF50';
  //     case 'error': return '#F44336';
  //     case 'warning': return '#FF9800';
  //     default: return '#555';
  //   }
  // }
};
