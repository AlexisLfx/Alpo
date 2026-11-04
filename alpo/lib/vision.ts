export type Region = {
  x: number
  y: number
  width: number
  height: number
}

// Temporalmente desactivamos OpenCV para evitar
// que Next.js intente cargar el paquete eliminado.

export async function detectarPaneles(
  imageData: string
): Promise<Region[]> {
  if (!imageData || !imageData.startsWith('data:image/')) {
    throw new Error('La imagen recibida no es válida')
  }

  return []
}
