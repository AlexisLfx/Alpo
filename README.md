# ALPO

Aplicación Next.js para analizar audio, detectar frases de riesgo, registrar evidencia en Monad Testnet y enviar alertas por WhatsApp.

## Desarrollo local

La aplicación está en `alpo/`:

```bash
cd alpo
npm ci
cp .env.local.example .env.local
# Completa las variables de .env.local antes de iniciar.
npm run dev
```

Abre http://localhost:3000. Para vincular WhatsApp, ejecuta `npm run whatsapp:login` y escanea el QR.

## Configuración

- `GROQ_API_KEY`: transcripción de audio.
- `MONAD_PRIVATE_KEY`: clave de una wallet de testnet para registrar evidencia.
- `NEXT_PUBLIC_CONTRACT_ADDRESS`: dirección del contrato de evidencia.
- `TUTOR_WHATSAPP_NUMBER`: destinatario de alertas, con código de país y sin `+`.
- `DEMO_MODE`: usa una transcripción simulada cuando vale `true`; las integraciones de blockchain y WhatsApp siguen activas.

Mantén `.env.local` y `.baileys_auth/` fuera de Git. El script `scripts/test-whatsapp.mjs` envía un mensaje real al destinatario definido en su código.

## Validación y producción

Desde `alpo/`, ejecuta `npx tsc --noEmit` para comprobar tipos y `npm run build` para compilar. `npm start` sirve la compilación de producción. No hay una suite automatizada de pruebas configurada.

Consulta [AGENTS.md](AGENTS.md) para las pautas de contribución.
