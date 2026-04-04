# Informe sobre la Verificación de Google OAuth (De Prueba a Producción)

Para sacar la aplicación de la versión de prueba (Testing) de Google OAuth y dejarla "En Producción" (libre para cualquier usuario sin tener que agregarlo a mano), necesitas cumplir con una serie de requisitos muy estrictos de Google, debido a que tu aplicación utiliza permisos avanzados de YouTube.

## 🟢 Lo que tienes bien actualmente
- **Autenticación funcional:** Has integrado correctamente NextAuth con el proveedor de Google.
- **Manejo de tokens:** Estás capturando correctamente el `accessToken` para enviárselo a las APIs de YouTube y hacer las peticiones a nombre del usuario (búsquedas, dar "dislikes", etc.).

## 🔴 Lo que falta o está mal y NECESITAS agregar

Para enviar y lograr aprobar el proceso de verificación en la Consola de Google Cloud, te van a pedir indispensablemente:

### 1. Dominio Verificado Autorizado
Debes tener la aplicación subida a un dominio propio (por ejemplo, `tudominio.com`). Además, debes verificar la propiedad de este dominio en **Google Search Console** utilizando la misma cuenta de Google con la que creaste el proyecto en Google Cloud.

### 2. Página de Política de Privacidad (Privacy Policy)
Necesitas crear y publicar dentro de tu página web (ej. `tudominio.com/privacy`) un documento legal indicando:
- Qué datos solicitas de los usuarios (en tu caso: correo, perfil, uso de la cuenta de YouTube).
- Qué vas a hacer con esos datos exactamente (ej. "leer listas de reproducción, dar me gusta/no me gusta y gestionar búsquedas").
- Con quién los compartes (nadie) y cómo los proteges.
- Cómo un usuario puede solicitar que borres sus datos.
*Nota: Este link lo debes colocar en la configuración de la Pantalla de Consentimiento en Google Cloud.*

### 3. Página de Términos de Servicio (Terms of Service)
Tener otra página pública (ej. `tudominio.com/terms`) donde estipules bajo qué normas permites usar la aplicación.

### 4. Video de Demostración (Obligatorio)
Google te pedirá un enlace a un video de YouTube subido por ti que muestre paso a paso:
1. Cómo un usuario entra a tu página.
2. Cómo el usuario hace clic en el botón de iniciar sesión con Google y se le presentan los permisos solicitados.
3. Qué hace la aplicación con esos permisos (mostrar cómo tu plataforma gestiona el historial o cómo le da *dislike* a los videos inapropiados). 
Tienes que dejar clarísimo visualmente que los permisos solicitados son justificados para ofrecer el servicio.

## ⚠️ ALERTA CRÍTICA: Alcances Restringidos (Restricted Scopes)

Tu aplicación requiere controlar y modificar datos sensibles de la cuenta de YouTube del usuario (dar *dislikes*, acceder al historial, interacciones en general). Esto habitualmente requiere pedir los *scopes* (permisos) de `youtube` y/o `youtube.force-ssl`.

**Google clasifica estos permisos como "Restringidos" (Restricted Scopes).**

Eso significa que la verificación no es simplemente revisar que el sitio web exista y esté bien. Cuando un sitio pide un Alcance Restringido y quiere salir a Producción, **Google exige una Auditoría de Seguridad de terceros (CASA Tier 2 Security Assessment).**

- Esta auditoría cuesta **entre $15,000 USD y $75,000 USD** realizados por empresas de ciberseguridad afiliadas a Google, y se requeriría pagar una recertificación a menudo anualmente.
- **Alternativa:** Si el costo es inasumible, muchas aplicaciones prefieren quedarse "eternamente" en el modo *Testing* (Agregando manualmente hasta 100 usuarios de prueba) o modifican la lógica de su web para **solo leer** datos públicos, usando API Keys en lugar de manipular perfiles de usuarios de esa forma.

## Pasos Prácticos en Google Cloud
1. Entra a "APIs y Servicios" -> "Pantalla de consentimiento de OAuth".
2. Rellena los datos de Dominio, Link de Privacidad, Link de Términos y Logo.
3. Asegúrate de justificar por escrito cada *Scope* que solicitas.
4. Oprime **"Enviar para verificación"** y responde al equipo de *Google Trust & Safety* por correo con tu video y justificaciones.
