# API de la Aplicación {#application-api}

## createApp() {#createapp}

Crea una instancia de aplicación.

- **Tipo**

  ```ts
  function createApp(rootComponent: Component, rootProps?: object): App
  ```

- **Detalles**

  El primer argumento es el componente raíz. El segundo argumento opcional son las `props` que se pasarán al componente raíz.

- **Ejemplo**

  Con componente raíz en línea:

  ```js
  import { createApp } from 'vue'

  const app = createApp({
    /* root component options */
  })
  ```

  Con componente importado:

  ```js
  import { createApp } from 'vue'
  import App from './App.vue'

  const app = createApp(App)
  ```

- **Ver también** [Guía - Creando una Aplicación Vue](/guide/essentials/application)

## createSSRApp() {#createssrapp}

Crea una instancia de aplicación en modo de [Hidratación SSR](/guide/scaling-up/ssr#client-hydration). Su uso es exactamente el mismo que el de `createApp()`.

## app.mount() {#app-mount}

Monta la instancia de aplicación en un elemento contenedor.

- **Tipo**

  ```ts
  interface App {
    mount(rootContainer: Element | string): ComponentPublicInstance
  }
  ```

- **Detalles**

  El argumento puede ser un elemento DOM real o un selector CSS (se utilizará el primer elemento coincidente). Devuelve la instancia del componente raíz.

  Si el componente tiene una `template` o una función de `render` definida, reemplazará cualquier nodo DOM existente dentro del contenedor. De lo contrario, si el compilador en tiempo de ejecución está disponible, el `innerHTML` del contenedor se utilizará como `template`.

  En modo de hidratación SSR, hidratará los nodos DOM existentes dentro del contenedor. Si hay [desajustes](/guide/scaling-up/ssr#hydration-mismatch), los nodos DOM existentes se transformarán para coincidir con la salida esperada.

  Para cada instancia de `app`, `mount()` solo se puede llamar una vez.

- **Ejemplo**

  ```js
  import { createApp } from 'vue'
  const app = createApp(/* ... */)

  app.mount('#app')
  ```

  También puede montarse en un elemento DOM real:

  ```js
  app.mount(document.body.firstChild)
  ```

## app.unmount() {#app-unmount}

Desmonta una instancia de aplicación montada, activando los hooks del ciclo de vida de desmontaje para todos los componentes en el árbol de componentes de la aplicación.

- **Tipo**

  ```ts
  interface App {
    unmount(): void
  }
  ```

## app.onUnmount() <sup class="vt-badge" data-text="3.5+" /> {#app-onunmount}

Registra una función de callback para ser llamada cuando la `app` sea desmontada.

- **Tipo**

  ```ts
  interface App {
    onUnmount(callback: () => any): void
  }
  ```

## app.component() {#app-component}

Registra un componente global si se pasa tanto un string de nombre como una definición de componente, o recupera uno ya registrado si solo se pasa el nombre.

- **Tipo**

  ```ts
  interface App {
    component(name: string): Component | undefined
    component(name: string, component: Component): this
  }
  ```

- **Ejemplo**

  ```js
  import { createApp } from 'vue'

  const app = createApp({})

  // registrar un objeto de opciones
  app.component('MyComponent', {
    /* ... */
  })

  // recuperar un componente registrado
  const MyComponent = app.component('MyComponent')
  ```

- **Ver también** [Registro de Componentes](/guide/components/registration)

## app.directive() {#app-directive}

Registra una directiva personalizada global si se pasa tanto un string de nombre como una definición de directiva, o recupera una ya registrada si solo se pasa el nombre.

- **Tipo**

  ```ts
  interface App {
    directive(name: string): Directive | undefined
    directive(name: string, directive: Directive): this
  }
  ```

- **Ejemplo**

  ```js
  import { createApp } => from 'vue'

  const app = createApp({
    /* ... */
  })

  // registrar (directiva de objeto)
  app.directive('myDirective', {
    /* custom directive hooks */
  })

  // registrar (atajo de directiva de función)
  app.directive('myDirective', () => {
    /* ... */
  })

  // recuperar una directiva registrada
  const myDirective = app.directive('myDirective')
  ```

- **Ver también** [Directivas Personalizadas](/guide/reusability/custom-directives)

## app.use() {#app-use}

Instala un [plugin](/guide/reusability/plugins).

- **Tipo**

  ```ts
  interface App {
    use(plugin: Plugin, ...options: any[]): this
  }
  ```

- **Detalles**

  Espera el `plugin` como primer argumento, y opciones opcionales del `plugin` como segundo argumento.

  El `plugin` puede ser un objeto con un método `install()`, o simplemente una función que se utilizará como método `install()`. Las opciones (segundo argumento de `app.use()`) se pasarán al método `install()` del `plugin`.

  Cuando se llama a `app.use()` en el mismo `plugin` varias veces, el `plugin` se instalará solo una vez.

- **Ejemplo**

  ```js
  import { createApp } from 'vue'
  import MyPlugin from './plugins/MyPlugin'

  const app = createApp({
    /* ... */
  })

  app.use(MyPlugin)
  ```

- **Ver también** [Plugins](/guide/reusability/plugins)

## app.mixin() {#app-mixin}

Aplica un `mixin` global (con ámbito a la aplicación). Un `mixin` global aplica sus opciones incluidas a cada instancia de componente en la aplicación.

:::warning No Recomendado
Los `mixins` son compatibles en Vue 3 principalmente por compatibilidad con versiones anteriores, debido a su uso generalizado en las librerías del ecosistema. El uso de `mixins`, especialmente los `mixins` globales, debe evitarse en el código de la aplicación.

Para la reutilización de lógica, prefiere [Composables](/guide/reusability/composables) en su lugar.
:::

- **Tipo**

  ```ts
  interface App {
    mixin(mixin: ComponentOptions): this
  }
  ```

## app.provide() {#app-provide}

Proporciona un valor que puede ser inyectado en todos los componentes descendientes dentro de la aplicación.

- **Tipo**

  ```ts
  interface App {
    provide<T>(key: InjectionKey<T> | symbol | string, value: T): this
  }
  ```

- **Detalles**

  Espera la clave de inyección como primer argumento, y el valor proporcionado como segundo. Devuelve la propia instancia de aplicación.

- **Ejemplo**

  ```js
  import { createApp } from 'vue'

  const app = createApp(/* ... */)

  app.provide('message', 'hello')
  ```

  Dentro de un componente en la aplicación:

  <div class="composition-api">

  ```js
  import { inject } from 'vue'

  export default {
    setup() {
      console.log(inject('message')) // 'hello'
    }
  }
  ```

  </div>
  <div class="options-api">

  ```js
  export default {
    inject: ['message'],
    created() {
      console.log(this.message) // 'hello'
    }
  }
  ```

  </div>

- **Ver también**
  - [Provide / Inject](/guide/components/provide-inject)
  - [Provide a nivel de aplicación](/guide/components/provide-inject#app-level-provide)
  - [app.runWithContext()](#app-runwithcontext)

## app.runWithContext() {#app-runwithcontext}

- Solo compatible con 3.3+

Ejecuta una función de callback con la aplicación actual como contexto de inyección.

- **Tipo**

  ```ts
  interface App {
    runWithContext<T>(fn: () => T): T
  }
  ```

- **Detalles**

  Espera una función de callback y la ejecuta inmediatamente. Durante la llamada síncrona de la función de callback, las llamadas a `inject()` pueden buscar inyecciones de los valores proporcionados por la aplicación actual, incluso cuando no hay una instancia de componente activa. El valor de retorno de la función de callback también será devuelto.

- **Ejemplo**

  ```js
  import { inject } from 'vue'

  app.provide('id', 1)

  const injected = app.runWithContext(() => {
    return inject('id')
  })

  console.log(injected) // 1
  ```

## app.version {#app-version}

Proporciona la versión de Vue con la que se creó la aplicación. Esto es útil dentro de [plugins](/guide/reusability/plugins), donde podrías necesitar lógica condicional basada en diferentes versiones de Vue.

- **Tipo**

  ```ts
  interface App {
    version: string
  }
  ```

- **Ejemplo**

  Realizando una verificación de versión dentro de un plugin:

  ```js
  export default {
    install(app) {
      const version = Number(app.version.split('.')[0])
      if (version < 3) {
        console.warn('This plugin requires Vue 3')
      }
    }
  }
  ```

- **Ver también** [API Global - version](/api/general#version)

## app.config {#app-config}

Cada instancia de aplicación expone un objeto `config` que contiene los ajustes de configuración para esa aplicación. Puedes modificar sus propiedades (documentadas a continuación) antes de montar tu aplicación.

```js
import { createApp } from 'vue'

const app = createApp(/* ... */)

console.log(app.config)
```

## app.config.errorHandler {#app-config-errorhandler}

Asigna un manejador global para errores no capturados que se propagan desde dentro de la aplicación.

- **Tipo**

  ```ts
  interface AppConfig {
    errorHandler?: (
      err: unknown,
      instance: ComponentPublicInstance | null,
      // `info` is a Vue-specific error info,
      // e.g. which lifecycle hook the error was thrown in
      info: string
    ) => void
  }
  ```

- **Detalles**

  El manejador de errores recibe tres argumentos: el error, la instancia de componente que lo provocó y un string de información que especifica el tipo de origen del error.

  Puede capturar errores de las siguientes fuentes:

  - Renderizados de componentes
  - Manejadores de eventos
  - Hooks del ciclo de vida
  - Función `setup()`
  - `Watchers`
  - Hooks de directivas personalizadas
  - Hooks de transición

  :::tip
  En producción, el tercer argumento (`info`) será un código acortado en lugar del string de información completo. Puedes encontrar la asignación de código a string en la [Referencia de Códigos de Error en Producción](/error-reference/#runtime-errors).
  :::

- **Ejemplo**

  ```js
  app.config.errorHandler = (err, instance, info) => {
    // manejar error, p. ej. reportar a un servicio
  }
  ```

## app.config.warnHandler {#app-config-warnhandler}

Asigna un manejador personalizado para las advertencias en tiempo de ejecución de Vue.

- **Tipo**

  ```ts
  interface AppConfig {
    warnHandler?: (
      msg: string,
      instance: ComponentPublicInstance | null,
      trace: string
    ) => void
  }
  ```

- **Detalles**

  El manejador de advertencias recibe el mensaje de advertencia como primer argumento, la instancia del componente de origen como segundo argumento y un string de seguimiento del componente como tercero.

  Puede utilizarse para filtrar advertencias específicas y reducir la verbosidad de la consola. Todas las advertencias de Vue deben abordarse durante el desarrollo, por lo que esto solo se recomienda durante las sesiones de depuración para enfocarse en advertencias específicas entre muchas, y debe eliminarse una vez finalizada la depuración.

  :::tip
  Las advertencias solo funcionan durante el desarrollo, por lo que esta configuración se ignora en modo de producción.
  :::

- **Ejemplo**

  ```js
  app.config.warnHandler = (msg, instance, trace) => {
    // `trace` es el seguimiento de la jerarquía de componentes
  }
  ```

## app.config.performance {#app-config-performance}

Establece esto en `true` para habilitar el seguimiento de rendimiento de inicialización, compilación, renderizado y parcheo de componentes en el panel de rendimiento/línea de tiempo de las herramientas de desarrollo del navegador. Solo funciona en modo de desarrollo y en navegadores que admiten la API [performance.mark](https://developer.mozilla.org/en-US/docs/Web/API/Performance/mark).

- **Tipo:** `boolean`

- **Ver también** [Guía - Rendimiento](/guide/best-practices/performance)

## app.config.compilerOptions {#app-config-compileroptions}

Configura las opciones del compilador en tiempo de ejecución. Los valores establecidos en este objeto se pasarán al compilador de plantillas en el navegador y afectarán a cada componente de la `app` configurada. Ten en cuenta que también puedes anular estas opciones por componente utilizando la [opción `compilerOptions`](/api/options-rendering#compileroptions).

::: warning Importante
Esta opción de configuración solo se respeta cuando se utiliza la compilación completa (es decir, el `vue.js` independiente que puede compilar `templates` en el navegador). Si utilizas la compilación solo en tiempo de ejecución con una configuración de compilación, las opciones del compilador deben pasarse a `@vue/compiler-dom` a través de las configuraciones de la herramienta de compilación.

- Para `vue-loader`: [pasa a través de la opción del cargador `compilerOptions`](https://vue-loader.vuejs.org/options.html#compileroptions). Consulta también [cómo configurarlo en `vue-cli`](https://cli.vuejs.org/guide/webpack.html#modifying-options-of-a-loader).

- Para `vite`: [pasa a través de las opciones de `@vitejs/plugin-vue`](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue#options).
  :::

### app.config.compilerOptions.isCustomElement {#app-config-compileroptions-iscustomelement}

Especifica un método de verificación para reconocer elementos personalizados nativos.

- **Tipo:** `(tag: string) => boolean`

- **Detalles**

  Debe devolver `true` si la etiqueta debe tratarse como un elemento personalizado nativo. Para una etiqueta coincidente, Vue la renderizará como un elemento nativo en lugar de intentar resolverla como un componente Vue.

  Las etiquetas HTML y SVG nativas no necesitan ser emparejadas en esta función; el analizador de Vue las reconoce automáticamente.

- **Ejemplo**

  ```js
  // tratar todas las etiquetas que comienzan con 'ion-' como elementos personalizados
  app.config.compilerOptions.isCustomElement = (tag) => {
    return tag.startsWith('ion-')
  }
  ```

- **Ver también** [Vue y Componentes Web](/guide/extras/web-components)

### app.config.compilerOptions.whitespace {#app-config-compileroptions-whitespace}

Ajusta el comportamiento del manejo de espacios en blanco en las plantillas.

- **Tipo:** `'condense' | 'preserve'`

- **Valor por defecto:** `'condense'`

- **Detalles**

  Vue elimina / condensa los caracteres de espacio en blanco en las plantillas para producir una salida compilada más eficiente. La estrategia predeterminada es "condense", con el siguiente comportamiento:

  1. Los caracteres de espacio en blanco iniciales / finales dentro de un elemento se condensan en un solo espacio.
  2. Los caracteres de espacio en blanco entre elementos que contienen saltos de línea se eliminan.
  3. Los caracteres de espacio en blanco consecutivos en nodos de texto se condensan en un solo espacio.

  Establecer esta opción en `'preserve'` deshabilitará (2) y (3).

- **Ejemplo**

  ```js
  app.config.compilerOptions.whitespace = 'preserve'
  ```

### app.config.compilerOptions.delimiters {#app-config-compileroptions-delimiters}

Ajusta los delimitadores utilizados para la interpolación de texto dentro de la plantilla.

- **Tipo:** `[string, string]`

- **Valor por defecto:** ``{{ "['\u007b\u007b', '\u007d\u007d']" }}``

- **Detalles**

  Esto se utiliza típicamente para evitar conflictos con `frameworks` del lado del servidor que también utilizan la sintaxis de bigotes (`mustache`).

- **Ejemplo**

  ```js
  // Delimitadores cambiados al estilo de string de plantilla ES6
  app.config.compilerOptions.delimiters = ['${', '}']
  ```

### app.config.compilerOptions.comments {#app-config-compileroptions-comments}

Ajusta el tratamiento de los comentarios HTML en las plantillas.

- **Tipo:** `boolean`

- **Valor por defecto:** `false`

- **Detalles**

  Por defecto, Vue eliminará los comentarios en producción. Establecer esta opción en `true` forzará a Vue a preservar los comentarios incluso en producción. Los comentarios siempre se preservan durante el desarrollo. Esta opción se utiliza típicamente cuando Vue se usa con otras librerías que dependen de los comentarios HTML.

- **Ejemplo**

  ```js
  app.config.compilerOptions.comments = true
  ```

## app.config.globalProperties {#app-config-globalproperties}

Un objeto que se puede utilizar para registrar propiedades globales a las que se puede acceder desde cualquier instancia de componente dentro de la aplicación.

- **Tipo**

  ```ts
  interface AppConfig {
    globalProperties: Record<string, any>
  }
  ```

- **Detalles**

  Este es un reemplazo del `Vue.prototype` de Vue 2, que ya no está presente en Vue 3. Como con cualquier cosa global, esto debe usarse con moderación.

  Si una propiedad global entra en conflicto con una propiedad propia de un componente, la propiedad propia del componente tendrá mayor prioridad.

- **Uso**

  ```js
  app.config.globalProperties.msg = 'hello'
  ```

  Esto hace que `msg` esté disponible dentro de cualquier plantilla de componente en la aplicación, y también en `this` de cualquier instancia de componente:

  ```js
  export default {
    mounted() {
      console.log(this.msg) // 'hello'
    }
  }
  ```

- **Ver también** [Guía - Aumentando Propiedades Globales](/guide/typescript/options-api#augmenting-global-properties) <sup class="vt-badge ts" />

## app.config.optionMergeStrategies {#app-config-optionmergestrategies}

Un objeto para definir estrategias de fusión para opciones de componentes personalizadas.

- **Tipo**

  ```ts
  interface AppConfig {
    optionMergeStrategies: Record<string, OptionMergeFunction>
  }

  type OptionMergeFunction = (to: unknown, from: unknown) => any
  ```

- **Detalles**

  Algunos `plugins` / librerías añaden soporte para opciones de componentes personalizadas (inyectando `mixins` globales). Estas opciones pueden requerir una lógica de fusión especial cuando la misma opción necesita ser "fusionada" de múltiples fuentes (p. ej. `mixins` o herencia de componentes).

  Se puede registrar una función de estrategia de fusión para una opción personalizada asignándola al objeto `app.config.optionMergeStrategies` utilizando el nombre de la opción como clave.

  La función de estrategia de fusión recibe el valor de esa opción definida en las instancias padre e hijo como primer y segundo argumento, respectivamente.

- **Ejemplo**

  ```js
  const app = createApp({
    // opción propia
    msg: 'Vue',
    // opción de un mixin
    mixins: [
      {
        msg: 'Hello '
      }
    ],
    mounted() {
      // opciones fusionadas expuestas en this.$options
      console.log(this.$options.msg)
    }
  })

  // definir una estrategia de fusión personalizada para `msg`
  app.config.optionMergeStrategies.msg = (parent, child) => {
    return (parent || '') + (child || '')
  }

  app.mount('#app')
  // registra 'Hello Vue'
  ```

- **Ver también** [Instancia de Componente - `$options`](/api/component-instance#options)

## app.config.idPrefix <sup class="vt-badge" data-text="3.5+" /> {#app-config-idprefix}

Configura un prefijo para todos los IDs generados a través de [useId()](/api/composition-api-helpers.html#useid) dentro de esta aplicación.

- **Tipo:** `string`

- **Valor por defecto:** `undefined`

- **Ejemplo**

  ```js
  app.config.idPrefix = 'myApp'
  ```

  ```js
  // en un componente:
  const id1 = useId() // 'myApp:0'
  const id2 = useId() // 'myApp:1'
  ```

## app.config.throwUnhandledErrorInProduction <sup class="vt-badge" data-text="3.5+" /> {#app-config-throwunhandlederrorinproduction}

Fuerza a que los errores no manejados se lancen en modo de producción.

- **Tipo:** `boolean`

- **Valor por defecto:** `false`

- **Detalles**

  Por defecto, los errores lanzados dentro de una aplicación Vue pero no manejados explícitamente tienen un comportamiento diferente entre los modos de desarrollo y producción:

  - En desarrollo, el error se lanza y puede posiblemente hacer que la aplicación se bloquee. Esto es para hacer el error más prominente para que pueda ser notado y corregido durante el desarrollo.

  - En producción, el error solo se registrará en la consola para minimizar el impacto en los usuarios finales. Sin embargo, esto puede evitar que los errores que solo ocurren en producción sean capturados por los servicios de monitoreo de errores.

  Al establecer `app.config.throwUnhandledErrorInProduction` en `true`, los errores no manejados se lanzarán incluso en modo de producción.