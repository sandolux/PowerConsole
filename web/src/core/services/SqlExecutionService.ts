// src/core/services/SqlExecutionService.ts

export type ExecutionResponse = {
  success: boolean;
  message: string;
  data: any[] | null;
};

export class SqlExecutionService {
  /**
   * Simula la ejecución de un script SQL.
   * Si el script contiene "ERROR" o profileId es "INVALID", simula un error.
   * @param script El script SQL a ejecutar.
   * @param profileId El ID del perfil de conexión.
   * @returns Una promesa que resuelve con un ExecutionResponse.
   */
  public async executeScript(script: string, profileId: string): Promise<ExecutionResponse> {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (script.toUpperCase().includes("ERROR") || profileId === "INVALID") {
          resolve({
            success: false,
            message: `Error de ejecución para el perfil '${profileId}': Error de sintaxis o conexión.`,
            data: null,
          });
        } else {
          // Simulación de datos de éxito
          const mockData = Array.from({ length: 5 }, (_, i) => ({
            ID: i + 1,
            Descripcion: `Item ${i + 1}`,
            Estado: i % 2 === 0 ? "Activo" : "Inactivo",
          }));
          resolve({
            success: true,
            message: "Script ejecutado exitosamente.",
            data: mockData,
          });
        }
      }, 2000); // Simula 2 segundos de latencia
    });
  }
}
