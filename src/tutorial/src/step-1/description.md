# Primeros pasos {#getting-started}

¡Bienvenido al tutorial de Vue!

El objetivo de este tutorial es darte rápidamente una experiencia de cómo se siente trabajar con Vue, directamente en el navegador. No pretende ser exhaustivo, y no necesitas entenderlo todo antes de seguir adelante. Sin embargo, después de completarlo, asegúrate también de leer la <a target="_blank" href="/guide/introduction.html">Guía</a>, que cubre cada tema con más detalle.

## Requisitos previos {#prerequisites}

El tutorial asume una familiaridad básica con HTML, CSS y JavaScript. Si eres totalmente nuevo en el desarrollo front-end, puede que no sea la mejor idea saltar directamente a un framework como primer paso: ¡comprende los fundamentos y luego regresa! La experiencia previa con otros frameworks ayuda, pero no es obligatoria.

## Cómo usar este tutorial {#how-to-use-this-tutorial}

Puedes editar el código <span class="wide">a la derecha</span><span class="narrow">abajo</span> y ver el resultado actualizarse al instante. Cada paso introducirá una característica central de Vue, y se esperará que completes el código para que la demo funcione. Si te quedas atascado, tendrás un botón "¡Muéstrame!" que te revelará el código funcional. Intenta no depender demasiado de él: aprenderás más rápido resolviendo las cosas por tu cuenta.

Si eres un desarrollador experimentado que viene de Vue 2 u otros frameworks, hay algunos ajustes que puedes modificar para aprovechar al máximo este tutorial. Si eres principiante, se recomienda usar la configuración predeterminada.

<details>
<summary>Detalles de la configuración del tutorial</summary>

- Vue ofrece dos estilos de API: Options API y Composition API. Este tutorial está diseñado para funcionar con ambos; puedes elegir tu estilo preferido usando los selectores de **Preferencia de API** en la parte superior. <a target="_blank" href="/guide/introduction.html#api-styles">Aprende más sobre los estilos de API</a>.

- También puedes cambiar entre el modo SFC o el modo HTML. El primero mostrará ejemplos de código en formato <a target="_blank" href="/guide/introduction.html#single-file-components">Single-File Component</a> (SFC), que es lo que la mayoría de los desarrolladores usan cuando utilizan Vue con un paso de compilación. El modo HTML muestra el uso sin un paso de compilación.

<div class="html">

:::tip
Si vas a usar el modo HTML sin un paso de compilación en tus propias aplicaciones, asegúrate de cambiar las importaciones a:

```js
import { ... } from 'vue/dist/vue.esm-bundler.js'
```

dentro de tus scripts o configurar tu herramienta de compilación para resolver `vue` de forma adecuada. Configuración de ejemplo para [Vite](https://vitejs.dev/):

```js [vite.config.js]
export default {
  resolve: {
    alias: {
      vue: 'vue/dist/vue.esm-bundler.js'
    }
  }
}
```

Consulta la [sección respectiva en la guía de herramientas](/guide/scaling-up/tooling.html#note-on-in-browser-template-compilation) para obtener más información.
:::

</div>

</details>

¿Listo? Haz clic en "Siguiente" para empezar.