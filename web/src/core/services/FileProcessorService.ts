import JSZip from 'jszip';

export class FileProcessorService {
  /**
   * Procesa una lista de archivos, descomprimiendo ZIPs y filtrando imágenes.
   * Mantiene un índice de nombres existentes para evitar duplicados.
   * @param fileList La lista de archivos a procesar (desde un input de tipo file).
   * @param currentNameIndex Un Set con los nombres de archivos ya cargados para evitar duplicados.
   * @returns Un objeto que contiene un array de archivos procesados (nombre y Blob) y la cantidad de archivos omitidos.
   */
  public async processFiles(
    fileList: FileList,
    currentNameIndex: Set<string>
  ): Promise<{ processedFiles: Array<{ name: string; blob: Blob }>; skippedCount: number }> {
    const processedFiles: Array<{ name: string; blob: Blob }> = [];
    let skippedCount = 0;

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];

      if (file.type === 'application/zip') {
        const zip = await new JSZip().loadAsync(file);
        const zipFiles = await this.processZipFile(zip, currentNameIndex);
        processedFiles.push(...zipFiles.processedFiles);
        skippedCount += zipFiles.skippedCount;
      } else if (file.type.startsWith('image/')) {
        if (!currentNameIndex.has(file.name)) {
          processedFiles.push({ name: file.name, blob: file });
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
  ): Promise<{ processedFiles: Array<{ name: string; blob: Blob }>; skippedCount: number }> {
    const processedFiles: Array<{ name: string; blob: Blob }> = [];
    let skippedCount = 0;

    const promises: Promise<void>[] = [];

    zip.forEach((relativePath, zipEntry) => {
      if (!zipEntry.dir && relativePath.match(/\.(jpeg|jpg|png|gif|bmp|webp)$/i)) {
        if (!currentNameIndex.has(relativePath)) {
          promises.push(
            zipEntry.async('blob').then(blob => {
              processedFiles.push({ name: relativePath, blob });
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
