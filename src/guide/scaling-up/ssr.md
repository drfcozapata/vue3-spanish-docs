---
outline: deep
---

# Renderizado en el Lado del Servidor (SSR) {#server-side-rendering-ssr}

## Visión general {#overview}

### ¿Qué es SSR? {#what-is-ssr}

Vue.js es un framework para construir aplicaciones del lado del cliente. Por defecto, los componentes de Vue producen y manipulan el DOM en el navegador como salida. Sin embargo, también es posible renderizar los mismos componentes en cadenas de HTML en el servidor, enviarlas directamente al navegador y, finalmente, "hidratar" el marcado estático en una aplicación completamente interactiva en el cliente.

Una aplicación de Vue.js renderizada en el servidor también puede considerarse "isomórfica" o "universal", en el sentido de que la mayor parte del código de tu aplicación se ejecuta tanto en el servidor **como** en el cliente.

### ¿Por qué SSR? {#why-ssr}

Comparado con una Aplicación de Página Única (SPA) del lado del cliente, la ventaja del SSR reside principalmente en:

- **Tiempo de carga del contenido más rápido**: esto es más notorio en conexiones a internet lentas o dispositivos lentos. El marcado renderizado en el servidor no necesita esperar a que todo el JavaScript se haya descargado y ejecutado para mostrarse, por lo que tu usuario verá una página completamente renderizada antes. Además, la obtención de datos se realiza en el lado del servidor para la visita inicial, lo que probablemente tiene una conexión más rápida a tu base de datos que el cliente. Esto generalmente resulta en métricas mejoradas de [Core Web Vitals](https://web.dev/vitals/), una mejor experiencia de usuario y puede ser crítico para aplicaciones donde el tiempo de carga del contenido está directamente asociado con la tasa de conversión.

- **Modelo mental unificado**: puedes usar el mismo lenguaje y el mismo modelo mental declarativo y orientado a componentes para desarrollar toda tu aplicación, en lugar de saltar entre un sistema de plantillas de backend y un framework de frontend.

- **Mejor SEO**: los rastreadores de motores de búsqueda verán directamente la página completamente renderizada.

  :::tip
  A día de hoy, Google y Bing pueden indexar aplicaciones JavaScript síncronas sin problemas. Síncrono es la palabra clave aquí. Si tu aplicación comienza con un spinner de carga y luego obtiene contenido a través de Ajax, el rastreador no esperará a que termines. Esto significa que si tienes contenido obtenido asíncronamente en páginas donde el SEO es importante, el SSR podría ser necesario.
  :::

También hay algunas desventajas a considerar al usar SSR:

- Restricciones de desarrollo. El código específico del navegador solo puede usarse dentro de ciertos hooks del ciclo de vida; algunas librerías externas pueden necesitar un tratamiento especial para poder ejecutarse en una aplicación renderizada en el servidor.

- Configuración de compilación y requisitos de despliegue más complejos. A diferencia de una SPA completamente estática que se puede desplegar en cualquier servidor de archivos estáticos, una aplicación renderizada en el servidor requiere un entorno donde pueda ejecutarse un servidor Node.js.

- Mayor carga en el lado del servidor. Renderizar una aplicación completa en Node.js será más intensivo en CPU que simplemente servir archivos estáticos, así que si esperas mucho tráfico, prepárate para la carga del servidor correspondiente y emplea sabiamente estrategias de caché.

Antes de usar SSR para tu aplicación, la primera pregunta que debes hacerte es si realmente lo necesitas. Depende principalmente de cuán importante sea el tiempo de carga del contenido para tu aplicación. Por ejemplo, si estás construyendo un dashboard interno donde unos pocos cientos de milisegundos adicionales en la carga inicial no importan mucho, el SSR sería excesivo. Sin embargo, en casos donde el tiempo de carga del contenido es absolutamente crítico, el SSR puede ayudarte a lograr el mejor rendimiento de carga inicial posible.

### SSR vs. SSG {#ssr-vs-ssg}

**Generación de Sitios Estáticos (SSG)**, también conocida como pre-renderizado, es otra técnica popular para construir sitios web rápidos. Si los datos necesarios para renderizar una página en el servidor son los mismos para cada usuario, entonces en lugar de renderizar la página cada vez que llega una solicitud, podemos renderizarla solo una vez, con antelación, durante el proceso de compilación. Las páginas pre-renderizadas se generan y se sirven como archivos HTML estáticos.

SSG mantiene las mismas características de rendimiento de las aplicaciones SSR: proporciona un gran rendimiento en el tiempo de carga del contenido. Al mismo tiempo, es más barato y fácil de desplegar que las aplicaciones SSR porque la salida es HTML estático y assets. La palabra clave aquí es **estático**: SSG solo se puede aplicar a páginas que proporcionan datos estáticos, es decir, datos que se conocen en el momento de la compilación y que no pueden cambiar entre solicitudes. Cada vez que los datos cambian, se necesita un nuevo despliegue.

Si solo estás investigando el SSR para mejorar el SEO de unas pocas páginas de marketing (p. ej., `/`, `/about`, `/contact`, etc.), entonces probablemente querrás SSG en lugar de SSR. SSG también es excelente para sitios web basados en contenido, como sitios de documentación o blogs. De hecho, este sitio web que estás leyendo ahora mismo se genera estáticamente usando [VitePress](https://vitepress.dev/), un generador de sitios estáticos impulsado por Vue.

## Tutorial Básico {#basic-tutorial}

### Renderizado de una Aplicación {#rendering-an-app}

Echemos un vistazo al ejemplo más básico de Vue SSR en acción.

1. Crea un nuevo directorio y `cd` en él
2. Ejecuta `npm init -y`
3. Añade `"type": "module"` en `package.json` para que Node.js se ejecute en [modo de módulos ES](https://nodejs.org/api/esm.html#modules-ecmascript-modules).
4. Ejecuta `npm install vue`
5. Crea un archivo `example.js`:

```js
// this runs in Node.js on the server.
import { createSSRApp } from 'vue'
// Vue's server-rendering API is exposed under `vue/server-renderer`.
import { renderToString } from 'vue/server-renderer'

const app = createSSRApp({
  data: () => ({ count: 1 }),
  template: `<button @click="count++">{{ count }}</button>`
})

renderToString(app).then((html) => {
  console.log(html)
})
```

Luego ejecuta:

```sh
> node example.js
```

Debería imprimir lo siguiente en la línea de comandos:

```
<button>1</button>
```

[`renderToString()`](/api/ssr#rendertostring) toma una instancia de aplicación Vue y devuelve una Promise que se resuelve en el HTML renderizado de la aplicación. También es posible renderizar por streaming usando la [API Stream de Node.js](https://nodejs.org/api/stream.html) o la [API Web Streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API). Consulta la [Referencia de la API de SSR](/api/ssr) para obtener todos los detalles.

Luego podemos mover el código Vue SSR a un controlador de solicitudes del servidor, que envuelve el marcado de la aplicación con el HTML completo de la página. Usaremos [`express`](https://expressjs.com/) para los siguientes pasos:

- Ejecuta `npm install express`
- Crea el siguiente archivo `server.js`:

```js
import express from 'express'
import { createSSRApp } from 'vue'
import { renderToString } from 'vue/server-renderer'

const server = express()

server.get('/', (req, res) => {
  const app = createSSRApp({
    data: () => ({ count: 1 }),
    template: `<button @click="count++">{{ count }}</button>`
  })

  renderToString(app).then((html) => {
    res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Vue SSR Example</title>
      </head>
      <body>
        <div id="app">${html}</div>
      </body>
    </html>
    `)
  })
})

server.listen(3000, () => {
  console.log('ready')
})
```

Finalmente, ejecuta `node server.js` y visita `http://localhost:3000`. Deberías ver la página funcionando con el botón.

[Pruébalo en StackBlitz](https://stackblitz.com/fork/vue-ssr-example-basic?file=index.js)

### Hidratación del Cliente {#client-hydration}

Si haces clic en el botón, notarás que el número no cambia. El HTML es completamente estático en el cliente ya que no estamos cargando Vue en el navegador.

Para hacer que la aplicación del lado del cliente sea interactiva, Vue necesita realizar el paso de **hidratación**. Durante la hidratación, crea la misma aplicación Vue que se ejecutó en el servidor, empareja cada componente con los nodos del DOM que debe controlar y adjunta listeners de eventos del DOM.

Para montar una aplicación en modo de hidratación, necesitamos usar [`createSSRApp()`](/api/application#createssrapp) en lugar de `createApp()`:

```js{2}
// this runs in the browser.
import { createSSRApp } from 'vue'

const app = createSSRApp({
  // ...same app as on server
})

// mounting an SSR app on the client assumes
// the HTML was pre-rendered and will perform
// hydration instead of mounting new DOM nodes.
app.mount('#app')
```

### Estructura del Código {#code-structure}

Nota cómo necesitamos reutilizar la misma implementación de la aplicación que en el servidor. Aquí es donde debemos empezar a pensar en la estructura del código en una aplicación SSR: ¿cómo compartimos el mismo código de aplicación entre el servidor y el cliente?

Aquí demostraremos la configuración más básica. Primero, dividamos la lógica de creación de la aplicación en un archivo dedicado, `app.js`:

```js [app.js]
// (shared between server and client)
import { createSSRApp } from 'vue'

export function createApp() {
  return createSSRApp({
    data: () => ({ count: 1 }),
    template: `<button @click="count++">{{ count }}</button>`
  })
}
```

Este archivo y sus dependencias se comparten entre el servidor y el cliente; los llamamos **código universal**. Hay una serie de cosas a las que debes prestar atención al escribir código universal, como [discutiremos a continuación](#writing-ssr-friendly-code).

Nuestra entrada del cliente importa el código universal, crea la aplicación y realiza el montaje:

```js [client.js]
import { createApp } from './app.js'

createApp().mount('#app')
```

Y el servidor utiliza la misma lógica de creación de la aplicación en el controlador de solicitudes:

```js{2,5} [server.js]
// (irrelevant code omitted)
import { createApp } from './app.js'

server.get('/', (req, res) => {
  const app = createApp()
  renderToString(app).then(html => {
    // ...
  })
})
```

Además, para cargar los archivos del cliente en el navegador, también necesitamos:

1. Servir archivos del cliente añadiendo `server.use(express.static('.'))` en `server.js`.
2. Cargar la entrada del cliente añadiendo `<script type="module" src="/client.js"></script>` al esqueleto HTML.
3. Soportar el uso como `import * from 'vue'` en el navegador añadiendo un [Mapa de Importaciones](https://github.com/WICG/import-maps) al esqueleto HTML.

[Prueba el ejemplo completo en StackBlitz](https://stackblitz.com/fork/vue-ssr-example?file=index.js). ¡El botón ahora es interactivo!

## Soluciones de Nivel Superior {#higher-level-solutions}

Pasar del ejemplo a una aplicación SSR lista para producción implica mucho más. Necesitaremos:

- Soportar SFCs de Vue y otros requisitos del paso de compilación. De hecho, necesitaremos coordinar dos compilaciones para la misma aplicación: una para el cliente y otra para el servidor.

  :::tip
  Los componentes de Vue se compilan de manera diferente cuando se usan para SSR: las plantillas se compilan en concatenaciones de cadenas en lugar de funciones de renderizado del Virtual DOM para un rendimiento de renderizado más eficiente.
  :::

- En el controlador de solicitudes del servidor, renderizar el HTML con los enlaces de activos del lado del cliente correctos y las sugerencias de recursos óptimas. También podríamos necesitar cambiar entre el modo SSR y SSG, o incluso mezclar ambos en la misma aplicación.

- Administrar el enrutamiento, la obtención de datos y los stores de gestión de estado de manera universal.

Una implementación completa sería bastante compleja y depende de la cadena de herramientas de compilación que hayas elegido. Por lo tanto, recomendamos encarecidamente optar por una solución de nivel superior y con opinión que abstraiga la complejidad por ti. A continuación, presentaremos algunas soluciones SSR recomendadas en el ecosistema de Vue.

### Nuxt {#nuxt}

[Nuxt](https://nuxt.com/) es un framework de nivel superior construido sobre el ecosistema de Vue que proporciona una experiencia de desarrollo optimizada para escribir aplicaciones Vue universales. ¡Aún mejor, también puedes usarlo como un generador de sitios estáticos! Recomendamos encarecidamente probarlo.

### Quasar {#quasar}

[Quasar](https://quasar.dev) es una solución completa basada en Vue que te permite apuntar a SPA, SSR, PWA, aplicaciones móviles, aplicaciones de escritorio y extensiones de navegador, todo usando una única base de código. No solo maneja la configuración de compilación, sino que también proporciona una colección completa de componentes de UI compatibles con Material Design.

### Vite SSR {#vite-ssr}

Vite proporciona [soporte incorporado para el renderizado en el lado del servidor de Vue](https://vitejs.dev/guide/ssr.html), pero es intencionadamente de bajo nivel. Si deseas ir directamente con Vite, echa un vistazo a [vite-plugin-ssr](https://vite-plugin-ssr.com/), un plugin de la comunidad que abstrae muchos detalles desafiantes por ti.

También puedes encontrar un ejemplo de proyecto Vue + Vite SSR usando configuración manual [aquí](https://github.com/vitejs/vite-plugin-vue/tree/main/playground/ssr-vue), que puede servir como base para construir. Ten en cuenta que esto solo se recomienda si tienes experiencia con SSR / herramientas de compilación y realmente quieres tener control total sobre la arquitectura de nivel superior.

## Escribiendo Código Compatible con SSR {#writing-ssr-friendly-code}

Independientemente de tu configuración de compilación o elección de framework de nivel superior, hay algunos principios que se aplican en todas las aplicaciones Vue SSR.

### Reactividad en el Servidor {#reactivity-on-the-server}

Durante el SSR, cada URL de solicitud se mapea a un estado deseado de nuestra aplicación. No hay interacción del usuario ni actualizaciones del DOM, por lo que la reactividad es innecesaria en el servidor. Por defecto, la reactividad está deshabilitada durante el SSR para un mejor rendimiento.

### Hooks del Ciclo de Vida del Componente {#component-lifecycle-hooks}

Dado que no hay actualizaciones dinámicas, los hooks del ciclo de vida como <span class="options-api">`mounted`</span><span class="composition-api">`onMounted`</span> o <span class="options-api">`updated`</span><span class="composition-api">`onUpdated`</span> **NO** se llamarán durante el SSR y solo se ejecutarán en el cliente.<span class="options-api"> Los únicos hooks que se llaman durante el SSR son `beforeCreate` y `created`</span>

Debes evitar el código que produce efectos secundarios que necesitan limpieza en <span class="options-api">`beforeCreate` y `created`</span><span class="composition-api">`setup()` o el ámbito raíz de `<script setup>`</span>. Un ejemplo de tales efectos secundarios es configurar temporizadores con `setInterval`. En código solo del lado del cliente, podemos configurar un temporizador y luego desarmarlo en <span class="options-api">`beforeUnmount`</span><span class="composition-api">`onBeforeUnmount`</span> o <span class="options-api">`unmounted`</span><span class="composition-api">`onUnmounted`</span>. Sin embargo, debido a que los hooks de desmontaje nunca se llamarán durante el SSR, los temporizadores permanecerán para siempre. Para evitar esto, mueve tu código de efectos secundarios a <span class="options-api">`mounted`</span><span class="composition-api">`onMounted`</span> en su lugar.

### Acceso a APIs Específicas de la Plataforma {#access-to-platform-specific-apis}

El código universal no puede asumir acceso a APIs específicas de la plataforma, por lo que si tu código usa directamente globales solo de navegador como `window` o `document`, arrojará errores cuando se ejecute en Node.js, y viceversa.

Para tareas que se comparten entre el servidor y el cliente pero con diferentes APIs de plataforma, se recomienda envolver las implementaciones específicas de la plataforma dentro de una API universal, o usar librerías que hagan esto por ti. Por ejemplo, puedes usar [`node-fetch`](https://github.com/node-fetch/node-fetch) para usar la misma API fetch tanto en el servidor como en el cliente.

Para APIs solo de navegador, el enfoque común es acceder a ellas de forma perezosa dentro de hooks del ciclo de vida solo del cliente, como <span class="options-api">`mounted`</span><span class="composition-api">`onMounted`</span>.

Ten en cuenta que si una librería de terceros no está escrita pensando en el uso universal, podría ser complicado integrarla en una aplicación renderizada en el servidor. _Podrías_ lograr que funcione simulando algunas de las globales, pero sería una solución poco elegante y podría interferir con el código de detección de entorno de otras librerías.

### Contaminación del Estado entre Solicitudes {#cross-request-state-pollution}

En el capítulo Gestión de Estado, introdujimos un [patrón simple de gestión de estado usando APIs de Reactividad](state-management#simple-state-management-con-reactivity-api). En un contexto SSR, este patrón requiere algunos ajustes adicionales.

El patrón declara un estado compartido en el ámbito raíz de un módulo JavaScript. Esto los convierte en **singletons**, es decir, solo hay una instancia del objeto reactivo durante todo el ciclo de vida de nuestra aplicación. Esto funciona como se espera en una aplicación Vue pura del lado del cliente, ya que los módulos de nuestra aplicación se inicializan de nuevo para cada visita a la página del navegador.

Sin embargo, en un contexto SSR, los módulos de la aplicación se inicializan típicamente solo una vez en el servidor, cuando el servidor arranca. Las mismas instancias de módulo se reutilizarán en múltiples solicitudes del servidor, y también lo harán nuestros objetos de estado singleton. Si mutamos el estado singleton compartido con datos específicos de un usuario, se puede filtrar accidentalmente a una solicitud de otro usuario. A esto lo llamamos **contaminación del estado entre solicitudes.**

Técnicamente podemos reinicializar todos los módulos JavaScript en cada solicitud, tal como lo hacemos en los navegadores. Sin embargo, inicializar módulos JavaScript puede ser costoso, por lo que esto afectaría significativamente el rendimiento del servidor.

La solución recomendada es crear una nueva instancia de toda la aplicación, incluyendo el router y los stores globales, en cada solicitud. Luego, en lugar de importarlo directamente en nuestros componentes, proporcionamos el estado compartido usando [provide a nivel de aplicación](/guide/components/provide-inject#app-level-provide) e inyectamos en los componentes que lo necesitan:

```js [app.js]
// (shared between server and client)
import { createSSRApp } from 'vue'
import { createStore } from './store.js'

// called on each request
export function createApp() {
  const app = createSSRApp(/* ... */)
  // create new instance of store per request
  const store = createStore(/* ... */)
  // provide store at the app level
  app.provide('store', store)
  // also expose store for hydration purposes
  return { app, store }
}
```

Librerías de gestión de estado como Pinia están diseñadas con esto en mente. Consulta la [guía de SSR de Pinia](https://pinia.vuejs.org/ssr/) para más detalles.

### Incompatibilidad de Hidratación {#hydration-mismatch}

Si la estructura del DOM del HTML pre-renderizado no coincide con la salida esperada de la aplicación del lado del cliente, habrá un error de incompatibilidad de hidratación. La incompatibilidad de hidratación se introduce más comúnmente por las siguientes causas:

1. La plantilla contiene una estructura de anidación HTML inválida, y el HTML renderizado fue "corregido" por el comportamiento nativo de análisis de HTML del navegador. Por ejemplo, un error común es que [`<div>` no puede colocarse dentro de `<p>`](https://stackoverflow.com/questions/8397852/why-cant-the-p-tag-contain-a-div-tag-inside-it):

   ```html
   <p><div>hi</div></p>
   ```

   Si producimos esto en nuestro HTML renderizado en el servidor, el navegador terminará el primer `<p>` cuando encuentre el `<div>` y lo analizará en la siguiente estructura del DOM:

   ```html
   <p></p>
   <div>hi</div>
   <p></p>
   ```

2. Los datos utilizados durante el renderizado contienen valores generados aleatoriamente. Dado que la misma aplicación se ejecutará dos veces (una en el servidor y otra en el cliente), no se garantiza que los valores aleatorios sean los mismos entre ambas ejecuciones. Hay dos formas de evitar incompatibilidades inducidas por valores aleatorios:

   1. Usa `v-if` + `onMounted` para renderizar la parte que depende de valores aleatorios solo en el cliente. Tu framework también puede tener características integradas para facilitar esto, por ejemplo el componente `<ClientOnly>` en VitePress.

   2. Usa una librería de generación de números aleatorios que soporte la generación con semillas, y garantiza que la ejecución del servidor y la ejecución del cliente usen la misma semilla (por ejemplo, incluyendo la semilla en el estado serializado y recuperándola en el cliente).

3. El servidor y el cliente están en diferentes zonas horarias. A veces, es posible que queramos convertir una marca de tiempo a la hora local del usuario. Sin embargo, la zona horaria durante la ejecución del servidor y la zona horaria durante la ejecución del cliente no siempre son las mismas, y es posible que no podamos conocer de manera fiable la zona horaria del usuario durante la ejecución del servidor. En tales casos, la conversión de la hora local también debe realizarse como una operación solo del cliente.

Cuando Vue encuentra una incompatibilidad de hidratación, intentará recuperarse automáticamente y ajustar el DOM pre-renderizado para que coincida con el estado del lado del cliente. Esto provocará una pérdida de rendimiento de renderizado debido a que se descartan nodos incorrectos y se montan nodos nuevos, pero en la mayoría de los casos, la aplicación debería seguir funcionando como se espera. Dicho esto, sigue siendo mejor eliminar las incompatibilidades de hidratación durante el desarrollo.

#### Suprimiendo Incompatibilidades de Hidratación <sup class="vt-badge" data-text="3.5+" /> {#suppressing-hydration-mismatches}

En Vue 3.5+, es posible suprimir selectivamente las incompatibilidades de hidratación inevitables utilizando el atributo [`data-allow-mismatch`](/api/ssr#data-allow-mismatch).

### Directivas Personalizadas {#custom-directives}

Dado que la mayoría de las directivas personalizadas implican manipulación directa del DOM, se ignoran durante el SSR. Sin embargo, si deseas especificar cómo debe renderizarse una directiva personalizada (es decir, qué atributos debe añadir al elemento renderizado), puedes usar el hook de directiva `getSSRProps`:

```js
const myDirective = {
  mounted(el, binding) {
    // client-side implementation:
    // directly update the DOM
    el.id = binding.value
  },
  getSSRProps(binding) {
    // server-side implementation:
    // return the props to be rendered.
    // getSSRProps only receives the directive binding.
    return {
      id: binding.value
    }
  }
}
```

### Teleports {#teleports}

Los Teleports requieren un manejo especial durante el SSR. Si la aplicación renderizada contiene Teleports, el contenido teletransportado no formará parte de la cadena renderizada. Una solución más sencilla es renderizar condicionalmente el Teleport en el montaje.

Si necesitas hidratar contenido teletransportado, este se expone bajo la propiedad `teleports` del objeto de contexto ssr:

```js
const ctx = {}
const html = await renderToString(app, ctx)

console.log(ctx.teleports) // { '#teleported': 'teleported content' }
```

Necesitas inyectar el marcado del teleport en la ubicación correcta de tu HTML de página final de manera similar a cómo necesitas inyectar el marcado de la aplicación principal.

:::tip
Evita apuntar a `body` cuando uses Teleports y SSR juntos; usualmente, `<body>` contendrá otro contenido renderizado en el servidor, lo que hace imposible que los Teleports determinen la ubicación de inicio correcta para la hidratación.

En su lugar, prefiere un contenedor dedicado, p. ej. `<div id="teleported"></div>` que contenga solo contenido teletransportado.
:::