
import time
from pathlib import Path

import mss
from PIL import Image

BASE_DIR = Path(__file__).parent
CARPETA = BASE_DIR / "capturas"
CARPETA.mkdir(parents=True, exist_ok=True)

RUTA_IMAGEN = CARPETA / "ultima_captura.png"

print("ALPO: capturador de pantalla iniciado.")
print("Abre Roblox en el navegador y deja visible el chat.")
print("Presiona Ctrl+C para detener.")

try:
    with mss.mss() as captura:
        monitor = captura.monitors[1]

        while True:
            imagen = captura.grab(monitor)
            foto = Image.frombytes(
                "RGB",
                imagen.size,
                imagen.rgb,
            )
            foto.save(RUTA_IMAGEN)

            print("Pantalla capturada.")
            time.sleep(1)

except KeyboardInterrupt:
    print("\nCaptura detenida.")
