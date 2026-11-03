
import time
from pathlib import Path

import pytesseract
import requests
from PIL import Image
from pytesseract import Output

BASE_DIR = Path(__file__).parent
RUTA_IMAGEN = BASE_DIR / "capturas" / "ultima_captura.png"
URL_API = "http://localhost:3000/api/screen"

pytesseract.pytesseract.tesseract_cmd = (
    r"C:\Program Files\Tesseract-OCR\tesseract.exe"
)

ultima_modificacion = None
ultimo_texto = ""

print("ALPO: detector visual del chat iniciado.")
print("Deja Roblox visible y el servidor Next.js encendido.")
print("Presiona Ctrl+C para detener.\n")


def localizar_chat(imagen):
    """Busca el campo 'Enviar' y estima la región del chat."""

    datos = pytesseract.image_to_data(
        imagen,
        lang="spa+eng",
        output_type=Output.DICT,
    )

    ancho, alto = imagen.size
    candidatos = []

    for i, palabra in enumerate(datos["text"]):
        palabra = palabra.strip().lower()

        if palabra not in ("enviar", "enviarun"):
            continue

        x = datos["left"][i]
        y = datos["top"][i]

        if x > ancho * 0.45 and y > alto * 0.50:
            candidatos.append((x, y))

    if not candidatos:
        return None

    x, y = max(candidatos, key=lambda punto: punto[1])

    izquierda = max(0, x - 45)
    arriba = max(0, y - 370)
    derecha = min(ancho, x + 610)
    abajo = min(alto, y + 65)

    if derecha <= izquierda or abajo <= arriba:
        return None

    return imagen.crop((izquierda, arriba, derecha, abajo))


try:
    while True:

        if not RUTA_IMAGEN.exists():
            print("Esperando la primera captura...")
            time.sleep(1)
            continue

        modificacion = RUTA_IMAGEN.stat().st_mtime

        if modificacion == ultima_modificacion:
            time.sleep(0.3)
            continue

        ultima_modificacion = modificacion

        # Leer imagen de forma segura
        try:
            with Image.open(RUTA_IMAGEN) as original:
                original.load()
                imagen = original.convert("RGB")

        except (OSError, ValueError):
            print("Imagen en proceso de captura, esperando...")
            time.sleep(0.5)
            continue

        # Localizar automáticamente el chat
        chat = localizar_chat(imagen)

        if chat is None:
            print("No encuentro el campo 'Enviar'.")
            time.sleep(1)
            continue

        # Extraer texto del chat
        texto = pytesseract.image_to_string(
            chat,
            lang="spa+eng",
        ).strip()

        if not texto or texto == ultimo_texto:
            time.sleep(0.3)
            continue

        ultimo_texto = texto

        print("\nTexto reconocido en la región del chat:")
        print(texto)

        # Enviar al detector existente de ALPO
        respuesta = requests.post(
            URL_API,
            json={"text": texto},
            timeout=10,
        )

        if respuesta.ok:
            resultado = respuesta.json()

            if resultado.get("detected"):
                print("\n¡POSIBLE RIESGO DETECTADO!")
                print(
                    "Frases:",
                    resultado.get("detectedPhrases", [])
                )
            else:
                print("No se detectaron frases de riesgo.")

        else:
            print(
                "Error de la API:",
                respuesta.status_code,
                respuesta.text[:300],
            )

        time.sleep(0.5)

except KeyboardInterrupt:
    print("\nALPO: analizador detenido.")

except requests.RequestException as error:
    print("\nNo se pudo conectar con ALPO:", error)
