# Despliegue en Producción {#production-deployment}

## Desarrollo vs. Producción {#development-vs-production}

Durante el desarrollo, Vue proporciona una serie de características para mejorar la experiencia de desarrollo:

- Advertencias para errores y trampas comunes
- Validación de propiedades / eventos
- [Hooks de depuración de reactividad](/guide/extras/reactivity-in-depth#reactivity-debugging)
- Integración con Devtools

Sin embargo, estas características se vuelven inútiles en producción. Algunas de las comprobaciones de advertencia también pueden generar una pequeña sobrecarga de rendimiento. Al desplegar a producción, debemos eliminar todas las ramas de código no utilizadas y exclusivas del desarrollo para un tamaño de carga útil más pequeño y un mejor rendimiento.

## Sin Herramientas de Construcción {#without-build-tools}

Si estás usando Vue sin una herramienta de construcción, cargándolo desde un CDN o un script auto-alojado, asegúrate de usar la build de producción (archivos dist que terminan en `.prod.js`) al desplegar a producción. Las builds de producción están pre-minificadas con todas las ramas de código exclusivas del desarrollo eliminadas.

- Si usas la build global (accediendo a través del global `Vue`): usa `vue.global.prod.js`.
- Si usas la build ESM (accediendo a través de importaciones nativas ESM): usa `vue.esm-browser.prod.js`.

Consulta la [guía de archivos dist](https://github.com/vuejs/core/tree/main/packages/vue#which-dist-file-to-use) para más detalles.

## Con Herramientas de Construcción {#with-build-tools}

Los proyectos generados mediante `create-vue` (basado en Vite) o Vue CLI (basado en webpack) están preconfigurados para builds de producción.

Si usas una configuración personalizada, asegúrate de que:

1. `vue` se resuelve a `vue.runtime.esm-bundler.js`.
2. Las [flags de características en tiempo de compilación](/api/compile-time-flags) estén correctamente configuradas.
3. <code>process.env<wbr>.NODE_ENV</code> sea reemplazado con `"production"` durante la build.

Referencias adicionales:

- [Guía de build de producción de Vite](https://vitejs.dev/guide/build.html)
- [Guía de despliegue de Vite](https://vitejs.dev/guide/static-deploy.html)
- [Guía de despliegue de Vue CLI](https://cli.vuejs.org/guide/deployment.html)

## Seguimiento de Errores en Tiempo de Ejecución {#tracking-runtime-errors}

El [manejador de errores a nivel de aplicación](/api/application#app-config-errorhandler) se puede usar para reportar errores a servicios de seguimiento:

```js
import { createApp } from 'vue'

const app = createApp(...)

app.config.errorHandler = (err, instance, info) => {
  // report error to tracking services
}
```

Servicios como [Sentry](https://docs.sentry.io/platforms/javascript/guides/vue/) y [Bugsnag](https://docs.bugsnag.com/platforms/javascript/vue/) también proporcionan integraciones oficiales para Vue.