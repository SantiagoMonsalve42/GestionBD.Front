import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { MessageService } from 'primeng/api';

interface ApiErrorResponse {
  statusCode: number;
  message: string;
  details: string | null;
  traceId: string;
  timestamp: string;
  errors: { [key: string]: string[] } | null;
}

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const messageService = inject(MessageService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      
      // Handle 400 Bad Request errors with validation messages
      if (error.status === 400 && error.error) {
        const apiError = error.error as ApiErrorResponse;
        
        // Check if errors object exists and has validation messages
        if (apiError.errors && typeof apiError.errors === 'object') {
          // Iterate through each error key and show all messages
          Object.keys(apiError.errors).forEach(key => {
            const messages = apiError.errors![key];
            if (Array.isArray(messages)) {
              messages.forEach(message => {
                messageService.add({
                  severity: 'error',
                  summary: 'Error de validación',
                  detail: message,
                  life: 5000
                });
              });
            }
          });
        } else if (apiError.message) {
          // Show general message if no specific errors
          messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: apiError.message,
            life: 5000
          });
        }
      }
      // Handle 401 Unauthorized
      else if (error.status === 401) {
        messageService.add({
          severity: 'warn',
          summary: 'No autorizado',
          detail: 'Debe iniciar sesión para acceder a este recurso',
          life: 5000
        });
      }
      // Handle 403 Forbidden
      else if (error.status === 403) {
        messageService.add({
          severity: 'warn',
          summary: 'Acceso denegado',
          detail: 'No tiene permisos para realizar esta acción',
          life: 5000
        });
      }
      // Handle 404 Not Found
      else if (error.status === 404) {
        messageService.add({
          severity: 'error',
          summary: 'No encontrado',
          detail: 'El recurso solicitado no existe',
          life: 5000
        });
      }
      // Handle 500 Internal Server Error
      else if (error.status === 500) {
        messageService.add({
          severity: 'error',
          summary: 'Error del servidor',
          detail: 'Ocurrió un error en el servidor. Por favor, intente más tarde',
          life: 5000
        });
      }
      // Handle network errors
      else if (error.status === 0) {
        messageService.add({
          severity: 'error',
          summary: 'Error de conexión',
          detail: 'No se pudo conectar con el servidor. Verifique su conexión a internet',
          life: 5000
        });
      }

      // Re-throw the error so components can handle it if needed
      return throwError(() => error);
    })
  );
};
