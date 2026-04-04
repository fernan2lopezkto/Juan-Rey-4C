# Informe sobre la Verificación de Google OAuth (De Prueba a Producción)

Para sacar la aplicación de la versión de prueba (Testing) de Google OAuth y dejarla "En Producción" (libre para cualquier usuario sin tener que agregarlo a mano), necesitas cumplir con una serie de requisitos básicos de Google.

Dado que hemos **removido** los permisos avanzados (Restricted Scopes) y ya administramos el historial y los filtros localmente sin afectar la cuenta de Google de los usuarios, **el proceso ahora es extremadamente sencillo y libre de auditorías de pago**.

## 🟢 Lo que tienes bien configurado
- **Autenticación puramente de Perfil:** Ya le indicamos al proveedor de Google (NextAuth) que SOLO solicite `openid`, `email` y `profile`. 
- **Gestión Local/Server:** Tu base de datos y *localStorage* administran el historial y los filtros visuales sin interferir con la cuenta del usuario en YouTube, evadiendo la estricta vigilancia de Google de forma elegante.
- **Páginas Legales Creadas:** Ya existen las rutas en tu código para `/terms` (Términos de Servicio) y `/privacy` (Política de Privacidad) listas para ser alojadas.

## 🔴 Cómo Remover los Scopes Restringidos de Google Cloud (Paso a Paso)

Dado que en tu aplicación ya no los usamos, debes eliminarlos de la Consola de Google para que te aprueben:

1. Ve a tu consola de [Google Cloud](https://console.cloud.google.com/).
2. En el menú, busca y entra a **"API y Servicios"** -> **"Pantalla de consentimiento de OAuth"** *(OAuth consent screen)*.
3. Haz clic en **"EDITAR LA APLICACIÓN"** (Edit App).
4. Avanza a la sección **"Permisos"** *(Scopes)*.
5. Busca en la lista los permisos como `../auth/youtube` o `../auth/youtube.force-ssl` y dale al botón con el ícono del bote de basura para **eliminarlos**.
6. Deja únicamente los scopes básicos (los de email, profile y openid) listados allí, que son los que aparecen normalmente con los checks pre-marcados.
7. Guarda y continúa hasta el final.

## ✅ Pasos para solicitar la verificación final

Una vez que limpies los *Scopes*, esto es lo que debes enviar para que pongan la App pública:

### 1. Aloja la App en un Dominio Verificado
Sube tu aplicación de Next.js a un dominio tuyo y verifica su propiedad integrándolo con **Google Search Console** utilizando el mismo correo de administrador de Google Cloud.

### 2. Agrega los enlaces a tus políticas
Dentro de la Pantalla de Consentimiento en Google Cloud, debes colocar las URLs completas de tus páginas legales:
- URL de la página principal: `https://tudominio.com`
- URL de la Política de privacidad: `https://tudominio.com/privacy`
- URL de las Condiciones del servicio: `https://tudominio.com/terms`

### 3. Publicar (Publish)
Una vez guardadas las URLs, en la pestaña principal de la "Pantalla de consentimiento de OAuth" ubica en la sección de estado de prueba un botón que dice **"Publicar aplicación"** *(Publish App)*. 

Dado que ya no estás pidiendo nada restringido o sensible, el proceso de revisión será **sencillo y muy rápido** (generalmente tarda entre unas horas y pocos días). No te pedirán ni auditoría CAS Tier 2 ni demos exhaustivos como hubiese sido con *force-ssl*.
