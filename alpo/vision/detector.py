
import cv2
import pytesseract
import re
import json
from datetime import datetime
from pathlib import Path

# Ubicación de Tesseract en Windows
pytesseract.pytesseract.tesseract_cmd = (
    r"C:\Program Files\Tesseract-OCR\tesseract.exe"
)

# Palabras y frases que pueden indicar riesgo.
# Son reglas iniciales, no una prueba definitiva de estafa.
PALABRAS_RIESGO = {
    "premio": 2,
    "ganador": 2,
    "reclamar": 2,
    "gratis": 1,
    "urgente": 2,
    "verificar cuenta": 3,
    "contraseña": 3,
    "pago": 1,
    "comprar": 1,
    "oferta exclusiva": 2,
    "recompensa": 1,
    "codigo de seguridad": 3,
    "código de seguridad": 3,
}

def analizar_captura(ruta_imagen):
    ruta = Path(ruta_imagen)

    if not ruta.exists():
        raise FileNotFoundError(
            f"No se encontró la imagen: {ruta}"
        )

    imagen = cv2.imread(str(ruta))

    if imagen is None:
        raise ValueError("No se pudo abrir la imagen.")

    # Preparar la imagen para facilitar la lectura del texto
    gris = cv2.cvtColor(imagen, cv2.COLOR_BGR2GRAY)
    gris = cv2.resize(
        gris,
        None,
        fx=1.5,
        fy=1.5,
        interpolation=cv2.INTER_CUBIC,
    )
    gris = cv2.threshold(
        gris,
        0,
        255,
        cv2.THRESH_BINARY + cv2.THRESH_OTSU,
    )[1]

    # Reconocer texto en español
    texto = pytesseract.image_to_string(gris, lang="spa")
    texto_normalizado = re.sub(r"\s+", " ", texto.lower())

    coincidencias = []
    puntuacion = 0

    for palabra, puntos in PALABRAS_RIESGO.items():
        if palabra in texto_normalizado:
            coincidencias.append(palabra)
            puntuacion += puntos

    if puntuacion >= 5:
        nivel = "ALTO"
    elif puntuacion >= 2:
        nivel = "MEDIO"
    else:
        nivel = "BAJO"

    resultado = {
        "fecha": datetime.now().isoformat(),
        "imagen": ruta.name,
        "texto_detectado": texto.strip(),
        "coincidencias": coincidencias,
        "puntuacion": puntuacion,
        "nivel_riesgo": nivel,
        "requiere_revision": puntuacion >= 2,
    }

    return resultado


if __name__ == "__main__":
    archivo = input(
        "Escribe la ruta de la captura de pantalla: "
    ).strip().strip('"')

    try:
        resultado = analizar_captura(archivo)

        print("\n--- RESULTADO DEL ANÁLISIS ---")
        print(json.dumps(
            resultado,
            indent=4,
            ensure_ascii=False,
        ))

        salida = Path(__file__).parent / "resultado_vision.json"

        with open(salida, "w", encoding="utf-8") as archivo_json:
            json.dump(
                resultado,
                archivo_json,
                indent=4,
                ensure_ascii=False,
            )

        print(f"\nResultado guardado en: {salida}")

    except (FileNotFoundError, ValueError) as error:
        print(f"Error: {error}")
    except pytesseract.TesseractError as error:
        print(f"Error de OCR: {error}")
