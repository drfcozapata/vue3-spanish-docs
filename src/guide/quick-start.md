---
footer: false
---

<script setup>
import { VTCodeGroup, VTCodeGroupTab } from '@vue/theme'
</script>

# Inicio Rápido {#quick-start}

## Prueba Vue Online {#try-vue-online}

- Para probar Vue rápidamente, puedes hacerlo directamente en nuestro [Playground](https://play.vuejs.org/#eNo9jcEKwjAMhl/lt5fpQYfXUQfefAMvvRQbddC1pUuHUPrudg4HIcmXjyRZXEM4zYlEJ+T0iEPgXjn6BB8Zhp46WUZWDjCa9f6w9kAkTtH9CRinV4fmRtZ63H20Ztesqiylphqy3R5UYBqD1UyVAPk+9zkvV1CKbCv9poMLiTEfR2/IXpSoXomqZLtti/IFwVtA9A==).

- Si prefieres una configuración HTML simple sin pasos de construcción, puedes usar este [JSFiddle](https://jsfiddle.net/yyx990803/2ke1ab0z/) como punto de partida.

- Si ya estás familiarizado con Node.js y el concepto de las herramientas de construcción, también puedes probar una configuración de construcción completa directamente en tu navegador en [StackBlitz](https://vite.new/vue).

- Para obtener un recorrido por la configuración recomendada, mira este tutorial interactivo de [Scrimba](http://scrimba.com/links/vue-quickstart) que te muestra cómo ejecutar, editar y desplegar tu primera aplicación Vue.

## Creando una Aplicación Vue {#creating-a-vue-application}

:::tip Requisitos Previos

- Familiaridad con la línea de comandos
- Instalar [Node.js](https://nodejs.org/) versión `^20.19.0 || >=22.12.0`
  :::

En esta sección, presentaremos cómo generar la estructura de una [Aplicación de Página Única](/guide/extras/ways-of-using-vue#single-page-application-spa) de Vue en tu máquina local. El proyecto creado utilizará una configuración de construcción basada en [Vite](https://vitejs.dev) y nos permitirá usar los [Componentes de un Solo Archivo](/guide/scaling-up/sfc) (SFCs) de Vue.

Asegúrate de tener una versión actualizada de [Node.js](https://nodejs.org/) instalada y que tu directorio de trabajo actual sea aquel donde deseas crear un proyecto. Ejecuta el siguiente comando en tu línea de comandos (sin el signo `$`):

::: code-group

```sh [npm]
$ npm create vue@latest
```

```sh [pnpm]
$ pnpm create vue@latest
```

```sh [yarn]
# For Yarn (v1+)
$ yarn create vue

# For Yarn Modern (v2+)
$ yarn create vue@latest

# For Yarn ^v4.11
$ yarn dlx create-vue@latest
```

```sh [bun]
$ bun create vue@latest
```

:::

Este comando instalará y ejecutará [create-vue](https://github.com/vuejs/create-vue), la herramienta oficial de andamiaje de proyectos de Vue. Se te presentarán indicaciones para varias características opcionales como TypeScript y soporte para pruebas:

<div class="language-sh"><pre><code><span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Project name: <span style="color:#888;">… <span style="color:#89DDFF;">&lt;</span><span style="color:#888;">your-project-name</span><span style="color:#89DDFF;">&gt;</span></span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Add TypeScript? <span style="color:#888;">… <span style="color:#89DDFF;text-decoration:underline">No</span> / Yes</span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Add JSX Support? <span style="color:#888;">… <span style="color:#89DDFF;text-decoration:underline">No</span> / Yes</span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Add Vue Router for Single Page Application development? <span style="color:#888;">… <span style="color:#89DDFF;text-decoration:underline">No</span> / Yes</span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Add Pinia for state management? <span style="color:#888;">… <span style="color:#89DDFF;text-decoration:underline">No</span> / Yes</span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Add Vitest for Unit testing? <span style="color:#888;">… <span style="color:#89DDFF;text-decoration:underline">No</span> / Yes</span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Add an End-to-End Testing Solution? <span style="color:#888;">… <span style="color:#89DDFF;text-decoration:underline">No</span> / Cypress / Nightwatch / Playwright</span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Add ESLint for code quality? <span style="color:#888;">… No / <span style="color:#89DDFF;text-decoration:underline">Yes</span></span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Add Prettier for code formatting? <span style="color:#888;">… <span style="color:#89DDFF;text-decoration:underline">No</span> / Yes</span></span>
<span style="color:var(--vt-c-green);">✔</span> <span style="color:#A6ACCD;">Add Vue DevTools 7 extension for debugging? (experimental) <span style="color:#888;">… <span style="color:#89DDFF;text-decoration:underline">No</span> / Yes</span></span>
<span></span>
<span style="color:#A6ACCD;">Scaffolding project in ./<span style="color:#89DDFF;">&lt;</span><span style="color:#888;">your-project-name</span><span style="color:#89DDFF;">&gt;</span>...</span>
<span style="color:#A6ACCD;">Done.</span></code></pre></div>

Si no estás seguro de una opción, simplemente elige `No` pulsando enter por ahora. Una vez que el proyecto esté creado, sigue las instrucciones para instalar las dependencias y iniciar el servidor de desarrollo:

::: code-group

```sh-vue [npm]
$ cd {{'<your-project-name>'}}
$ npm install
$ npm run dev
```

```sh-vue [pnpm]
$ cd {{'<your-project-name>'}}
$ pnpm install
$ pnpm run dev
```

```sh-vue [yarn]
$ cd {{'<your-project-name>'}}
$ yarn
$ yarn dev
```

```sh-vue [bun]
$ cd {{'<your-project-name>'}}
$ bun install
$ bun run dev
```

:::

¡Ahora deberías tener tu primer proyecto Vue en ejecución! Ten en cuenta que los componentes de ejemplo en el proyecto generado están escritos usando la [Composition API](/guide/introduction#composition-api) y `<script setup>`, en lugar de la [Options API](/guide/introduction#options-api). Aquí tienes algunos consejos adicionales:

- La configuración de IDE recomendada es [Visual Studio Code](https://code.visualstudio.com/) + [Vue - Official extension](https://marketplace.visualstudio.com/items?itemName=Vue.volar). Si utilizas otros editores, consulta la [sección de soporte de IDE](/guide/scaling-up/tooling#ide-support).
- Más detalles sobre las herramientas, incluida la integración con frameworks de backend, se discuten en la guía de [Herramientas](/guide/scaling-up/tooling).
- Para aprender más sobre la herramienta de construcción subyacente Vite, consulta la [documentación de Vite](https://vitejs.dev).
- Si eliges usar TypeScript, consulta la [Guía de Uso de TypeScript](typescript/overview).

Cuando estés listo para enviar tu aplicación a producción, ejecuta lo siguiente:

::: code-group

```sh [npm]
$ npm run build
```

```sh [pnpm]
$ pnpm run build
```

```sh [yarn]
$ yarn build
```

```sh [bun]
$ bun run build
```

:::

Esto creará una versión lista para producción de tu aplicación en el directorio `./dist` del proyecto. Consulta la [Guía de Despliegue en Producción](/guide/best-practices/production-deployment) para aprender más sobre cómo enviar tu aplicación a producción.

[Siguientes Pasos >](#next-steps)

## Usando Vue desde CDN {#using-vue-from-cdn}

Puedes usar Vue directamente desde una CDN a través de una etiqueta script:

```html
<script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
```

Aquí estamos usando [unpkg](https://unpkg.com/), pero también puedes usar cualquier CDN que sirva paquetes npm, por ejemplo [jsdelivr](https://www.jsdelivr.com/package/npm/vue) o [cdnjs](https://cdnjs.com/libraries/vue). Por supuesto, también puedes descargar este archivo y servirlo tú mismo.

Al usar Vue desde una CDN, no hay ningún "paso de construcción" involucrado. Esto simplifica mucho la configuración y es adecuado para mejorar HTML estático o integrarse con un framework de backend. Sin embargo, no podrás usar la sintaxis de Componentes de un Solo Archivo (SFC).

### Usando la Compilación Global {#using-the-global-build}

El enlace anterior carga la _compilación global_ de Vue, donde todas las APIs de nivel superior se exponen como propiedades en el objeto global `Vue`. Aquí tienes un ejemplo completo usando la compilación global:

<div class="options-api">

```html
<script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>

<div id="app">{{ message }}</div>

<script>
  const { createApp } = Vue

  createApp({
    data() {
      return {
        message: '¡Hola Vue!'
      }
    }
  }).mount('#app')
</script>
```

[Demo en CodePen >](https://codepen.io/vuejs-examples/pen/QWJwJLp)

</div>

<div class="composition-api">

```html
<script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>

<div id="app">{{ message }}</div>

<script>
  const { createApp, ref } = Vue

  createApp({
    setup() {
      const message = ref('¡Hola Vue!')
      return {
        message
      }
    }
  }).mount('#app')
</script>
```

[Demo en CodePen >](https://codepen.io/vuejs-examples/pen/eYQpQEG)

:::tip
Muchos de los ejemplos de Composition API a lo largo de la guía usarán la sintaxis `<script setup>`, lo cual requiere herramientas de construcción. Si tienes la intención de usar Composition API sin un paso de construcción, consulta el uso de la [opción `setup()`](/api/composition-api-setup).
:::

</div>

### Usando la Compilación de Módulos ES {#using-the-es-module-build}

A lo largo del resto de la documentación, usaremos principalmente la sintaxis de [módulos ES](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules). La mayoría de los navegadores modernos ahora soportan módulos ES de forma nativa, por lo que podemos usar Vue desde una CDN a través de módulos ES nativos de esta manera:

<div class="options-api">

```html{3,4}
<div id="app">{{ message }}</div>

<script type="module">
  import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'

  createApp({
    data() {
      return {
        message: '¡Hola Vue!'
      }
    }
  }).mount('#app')
</script>
```

</div>

<div class="composition-api">

```html{3,4}
<div id="app">{{ message }}</div>

<script type="module">
  import { createApp, ref } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'

  createApp({
    setup() {
      const message = ref('¡Hola Vue!')
      return {
        message
      }
    }
  }).mount('#app')
</script>
```

</div>

Ten en cuenta que estamos usando `<script type="module">`, y la URL de CDN importada apunta a la **compilación de módulos ES** de Vue en su lugar.

<div class="options-api">

[Demo en CodePen >](https://codepen.io/vuejs-examples/pen/VwVYVZO)

</div>
<div class="composition-api">

[Demo en CodePen >](https://codepen.io/vuejs-examples/pen/MWzazEv)

</div>

### Habilitando los Mapas de Importación {#enabling-import-maps}

En el ejemplo anterior, estamos importando desde la URL completa de la CDN, pero en el resto de la documentación verás código como este:

```js
import { createApp } from 'vue'
```

Podemos enseñarle al navegador dónde localizar la importación de `vue` usando [Mapas de Importación](https://caniuse.com/import-maps):

<div class="options-api">

```html{1-7,12}
<script type="importmap">
  {
    "imports": {
      "vue": "https://unpkg.com/vue@3/dist/vue.esm-browser.js"
    }
  }
</script>

<div id="app">{{ message }}</div>

<script type="module">
  import { createApp } from 'vue'

  createApp({
    data() {
      return {
        message: '¡Hola Vue!'
      }
    }
  }).mount('#app')
</script>
```

[Demo en CodePen >](https://codepen.io/vuejs-examples/pen/wvQKQyM)

</div>

<div class="composition-api">

```html{1-7,12}
<script type="importmap">
  {
    "imports": {
      "vue": "https://unpkg.com/vue@3/dist/vue.esm-browser.js"
    }
  }
</script>

<div id="app">{{ message }}</div>

<script type="module">
  import { createApp, ref } from 'vue'

  createApp({
    setup() {
      const message = ref('¡Hola Vue!')
      return {
        message
      }
    }
  }).mount('#app')
</script>
```

[Demo en CodePen >](https://codepen.io/vuejs-examples/pen/YzRyRYM)

</div>

También puedes añadir entradas para otras dependencias al mapa de importación, pero asegúrate de que apunten a la versión de módulos ES de la librería que pretendes usar.

:::tip Soporte del Navegador para Mapas de Importación
Los Mapas de Importación son una característica de navegador relativamente nueva. Asegúrate de usar un navegador dentro de su [rango de soporte](https://caniuse.com/import-maps). En particular, solo es compatible con Safari 16.4+.
:::

:::warning Notas sobre el Uso en Producción
Los ejemplos hasta ahora utilizan la compilación de desarrollo de Vue; si tienes la intención de usar Vue desde una CDN en producción, asegúrate de consultar la [Guía de Despliegue en Producción](/guide/best-practices/production-deployment#without-build-tools).

Aunque es posible usar Vue sin un sistema de construcción, un enfoque alternativo a considerar es usar [`vuejs/petite-vue`](https://github.com/vuejs/petite-vue) que podría adaptarse mejor al contexto donde [`jquery/jquery`](https://github.com/jquery/jquery) (en el pasado) o [`alpinejs/alpine`](https://github.com/alpinejs/alpine) (en el presente) podrían usarse en su lugar.
:::

### Dividiendo los Módulos {#splitting-up-the-modules}

A medida que profundizamos en la guía, es posible que necesitemos dividir nuestro código en archivos JavaScript separados para que sean más fáciles de gestionar. Por ejemplo:

```html [index.html]
<div id="app"></div>

<script type="module">
  import { createApp } from 'vue'
  import MyComponent from './my-component.js'

  createApp(MyComponent).mount('#app')
</script>
```

<div class="options-api">

```js [my-component.js]
export default {
  data() {
    return { count: 0 }
  },
  template: `<div>La Cuenta es: {{ count }}</div>`
}
```

</div>
<div class="composition-api">

```js [my-component.js]
import { ref } from 'vue'
export default {
  setup() {
    const count = ref(0)
    return { count }
  },
  template: `<div>La Cuenta es: {{ count }}</div>`
}
```

</div>

Si abres directamente el `index.html` anterior en tu navegador, verás que arroja un error porque los módulos ES no pueden funcionar a través del protocolo `file://`, que es el protocolo que el navegador usa cuando abres un archivo local.

Por razones de seguridad, los módulos ES solo pueden funcionar a través del protocolo `http://`, que es lo que los navegadores usan al abrir páginas web. Para que los módulos ES funcionen en nuestra máquina local, necesitamos servir el `index.html` a través del protocolo `http://`, con un servidor HTTP local.

Para iniciar un servidor HTTP local, primero asegúrate de tener [Node.js](https://nodejs.org/en/) instalado, luego ejecuta `npx serve` desde la línea de comandos en el mismo directorio donde se encuentra tu archivo HTML. También puedes usar cualquier otro servidor HTTP que pueda servir archivos estáticos con los tipos MIME correctos.

Puede que hayas notado que la plantilla del componente importado se incluye directamente como una cadena de JavaScript. Si estás usando VS Code, puedes instalar la extensión [es6-string-html](https://marketplace.visualstudio.com/items?itemName=Tobermory.es6-string-html) y prefijar las cadenas con un comentario `/*html*/` para obtener resaltado de sintaxis para ellas.

## Siguientes Pasos {#next-steps}

Si te saltaste la [Introducción](/guide/introduction), te recomendamos encarecidamente leerla antes de pasar al resto de la documentación.

<div class="vt-box-container next-steps">
  <a class="vt-box" href="/guide/essentials/application.html">
    <p class="next-steps-link">Continuar con la Guía</p>
    <p class="next-steps-caption">La guía te lleva por cada aspecto del framework con todo detalle.</p>
  </a>
  <a class="vt-box" href="/tutorial/">
    <p class="next-steps-link">Prueba el Tutorial</p>
    <p class="next-steps-caption">Para aquellos que prefieren aprender de forma práctica.</p>
  </a>
  <a class="vt-box" href="/examples/">
    <p class="next-steps-link">Echa un vistazo a los Ejemplos</p>
    <p class="next-steps-caption">Explora ejemplos de características clave y tareas comunes de UI.</p>
  </a>
</div>
