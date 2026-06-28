This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

---

## Variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

```env
# WhatsApp Business Cloud API (Meta)
# Obtén estos valores desde: https://developers.facebook.com/apps/{app_id}/whatsapp-business/wa-dev-console
WHATSAPP_PHONE_NUMBER_ID=   # ID del número de WhatsApp Business (solo dígitos)
WHATSAPP_ACCESS_TOKEN=      # Token de acceso (System User Token permanente)
WHATSAPP_VERIFY_TOKEN=      # Token secreto que tú eliges para verificar el webhook
```

> El archivo `.env.local` nunca se sube al repositorio. En producción configura estas variables directamente en el servicio.

---

## Despliegue en Google Cloud Run

### Configurar variables de entorno (Consola)

1. Ir a [console.cloud.google.com/run](https://console.cloud.google.com/run) → seleccionar el servicio
2. **Editar y desplegar nueva revisión** → pestaña **Variables y secretos**
3. Agregar cada variable en la sección **Variables de entorno**
4. Clic en **Implementar**

### Configurar variables de entorno (CLI)

```bash
gcloud run services update TU_SERVICIO \
  --region TU_REGION \
  --set-env-vars "WHATSAPP_PHONE_NUMBER_ID=416885851497137" \
  --set-env-vars "WHATSAPP_ACCESS_TOKEN=EAAB..." \
  --set-env-vars "WHATSAPP_VERIFY_TOKEN=mi_token_secreto"
```

### Configurar con Secret Manager (recomendado para tokens)

```bash
# Crear el secreto
echo -n "EAAB..." | gcloud secrets create WHATSAPP_ACCESS_TOKEN --data-file=-

# Vincular al servicio
gcloud run services update TU_SERVICIO \
  --region TU_REGION \
  --set-secrets "WHATSAPP_ACCESS_TOKEN=WHATSAPP_ACCESS_TOKEN:latest"
```

---

## Configurar Webhook de WhatsApp (Meta)

El webhook recibe confirmaciones de entrega/lectura y mensajes entrantes.

**Endpoint:** `POST /api/webhook/whatsapp`

### Pasos en Meta Developer Console

1. Ir a **developers.facebook.com** → tu app → **WhatsApp** → **Configuration**
2. En la sección **Webhooks**, hacer clic en **Edit**
3. Completar:
   - **Callback URL:** `https://tu-dominio.run.app/api/webhook/whatsapp`
   - **Verify token:** el mismo valor que pusiste en `WHATSAPP_VERIFY_TOKEN`
4. Hacer clic en **Verify and save**
5. En **Webhook fields**, suscribirse a: `messages`

### Flujo de estados de mensaje

```
Enviado (✓) → Entregado (✓✓) → Leído (✓✓ azul)
```

Cada cambio de estado llega por webhook y se refleja en el chat en tiempo real (polling cada 3 s).

---

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
