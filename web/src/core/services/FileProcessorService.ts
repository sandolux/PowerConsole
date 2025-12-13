import JSZip from 'jszip';

export class FileProcessorService {
  private supportedImageExtensions = /\.(jpeg|jpg|png|gif|bmp|webp)$/i;

  private isImage(fileName: string): boolean {
    return this.supportedImageExtensions.test(fileName);
  }

  // Nueva función para sanear el código
  private sanitizeCode(fileName: string): string {
    // 1. Elimina la extensión del archivo
    let code = fileName.replace(/\.[^/.]+$/, "");

    // 2. Elimina el prefijo del contador y guion bajo o guion (ej: '1_', '2-', 'ABC-')
    // Busca el último '_' o '-' para manejar múltiples separadores o prefijos complejos
    const lastUnderscoreIndex = code.lastIndexOf('_');
    const lastHyphenIndex = code.lastIndexOf('-');

    let lastSeparatorIndex = -1;
    if (lastUnderscoreIndex > lastHyphenIndex) {
      lastSeparatorIndex = lastUnderscoreIndex;
    } else {
      lastSeparatorIndex = lastHyphenIndex;
    }

    if (lastSeparatorIndex !== -1) {
      const potentialCode = code.substring(lastSeparatorIndex + 1);
      // Regla Final: Si el código limpiado solo contiene números, devuélvelo
      if (/^\d+$/.test(potentialCode)) {
        return potentialCode;
      }
    }
    
    // Si no se encuentra un separador o el código no es numérico, intentar con el código original sin extensión
    if (/^\d+$/.test(code)) {
        return code;
    }

    return fileName; // Retornar el nombre original si no se puede sanear a un número
  }

  /**
   * Procesa una lista de archivos, descomprimiendo ZIPs y filtrando imágenes.
   * Mantiene un índice de nombres existentes para evitar duplicados.
   * @param fileList La lista de archivos a procesar (desde un input de tipo file).
   * @param currentNameIndex Un Set con los nombres de archivos ya cargados para evitar duplicados.
   * @returns Un objeto que contiene un array de archivos procesados (nombre y code) y la cantidad de archivos omitidos.
   */
  public async processFiles(
    fileList: FileList,
    currentNameIndex: Set<string>
  ): Promise<{ processedFiles: Array<{ name: string; code: string; blob: Blob }>; skippedCount: number }> {
    const processedFiles: Array<{ name: string; code: string; blob: Blob }> = [];
    let skippedCount = 0;

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];

      const isZip = file.type.includes('zip') || file.name.toLowerCase().endsWith('.zip');

      if (isZip) {
        try {
          const zip = await new JSZip().loadAsync(file);
          const zipFiles = await this.processZipFile(zip, currentNameIndex);
          processedFiles.push(...zipFiles.processedFiles);
          skippedCount += zipFiles.skippedCount;
        } catch (e) {
          console.error(`Error processing zip file ${file.name}:`, e);
          skippedCount++;
        }
      } else if (file.type.startsWith('image/') || this.isImage(file.name)) {
        if (!currentNameIndex.has(file.name)) {
          const code = this.sanitizeCode(file.name);
          processedFiles.push({ name: file.name, code, blob: file });
          currentNameIndex.add(file.name);
        } else {
          skippedCount++;
        }
      } else {
        skippedCount++; // Archivo no soportado (ni zip ni imagen)
      }
    }

    // Opcional: ordenar los archivos procesados por nombre
    processedFiles.sort((a, b) => a.name.localeCompare(b.name));

    return { processedFiles, skippedCount };
  }

  private async processZipFile(
    zip: JSZip,
    currentNameIndex: Set<string>
  ): Promise<{ processedFiles: Array<{ name: string; code: string; blob: Blob }>; skippedCount: number }> {
    const processedFiles: Array<{ name: string; code: string; blob: Blob }> = [];
    let skippedCount = 0;

    const promises: Promise<void>[] = [];

    zip.forEach((relativePath, zipEntry) => {
      // Usar la función isImage para detectar imágenes dentro del ZIP
      if (!zipEntry.dir && this.isImage(relativePath)) {
        if (!currentNameIndex.has(relativePath)) {
          promises.push(
            zipEntry.async('blob').then(blob => {
              const code = this.sanitizeCode(relativePath);
              processedFiles.push({ name: relativePath, code, blob });
              currentNameIndex.add(relativePath);
            })
          );
        } else {
          skippedCount++;
        }
      }
    });

    await Promise.all(promises);

    return { processedFiles, skippedCount };
  }
}

