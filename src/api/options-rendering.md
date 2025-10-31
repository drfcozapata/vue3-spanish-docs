# Options: Renderizado {#options-rendering}

## template {#template}

Una plantilla de cadena para el componente.

- **Tipo**

  ```ts
  interface ComponentOptions {
    template?: string
  }
  ```

- **Detalles**

  Una plantilla proporcionada a través de la opción `template` se compilará sobre la marcha en tiempo de ejecución. Solo es compatible cuando se utiliza una construcción de Vue que incluye el compilador de plantillas. El compilador de plantillas **NO** está incluido en las construcciones de Vue que tienen la palabra `runtime` en sus nombres, p. ej. `vue.runtime.esm-bundler.js`. Consulta la [guía de archivos dist](https://github.com/vuejs/core/tree/main/packages/vue#which-dist-file-to-use) para más detalles sobre las diferentes construcciones.

  Si la cadena comienza con `#`, se utilizará como un `querySelector` y se usará el `innerHTML` del elemento seleccionado como la cadena de plantilla. Esto permite que la plantilla de origen se cree utilizando elementos `<template>` nativos.

  Si la opción `render` también está presente en el mismo componente, `template` será ignorado.

  Si el componente raíz de tu aplicación no tiene una opción `template` o `render` especificada, Vue intentará usar el `innerHTML` del elemento montado como plantilla en su lugar.

  :::warning Nota de Seguridad
  Solo usa fuentes de plantilla en las que puedas confiar. No uses contenido proporcionado por el usuario como tu plantilla. Consulta la [Guía de Seguridad](/guide/best-practices/security#rule-no-1-never-use-non-trusted-templates) para más detalles.
  :::

## render {#render}

Una función que devuelve programáticamente el árbol DOM virtual del componente.

- **Tipo**

  ```ts
  interface ComponentOptions {
    render?(this: ComponentPublicInstance) => VNodeChild
  }

  type VNodeChild = VNodeChildAtom | VNodeArrayChildren

  type VNodeChildAtom =
    | VNode
    | string
    | number
    | boolean
    | null
    | undefined
    | void

  type VNodeArrayChildren = (VNodeArrayChildren | VNodeChildAtom)[]
  ```

- **Detalles**

  `render` es una alternativa a las plantillas de cadena que te permite aprovechar todo el poder programático de JavaScript para declarar la salida de renderizado del componente.

  Las plantillas precompiladas, por ejemplo, las de los Single-File Components, se compilan en la opción `render` en tiempo de construcción. Si tanto `render` como `template` están presentes en un componente, `render` tendrá mayor prioridad.

- **Ver también**
  - [Mecanismo de Renderizado](/guide/extras/rendering-mechanism)
  - [Funciones de Renderizado](/guide/extras/render-function)

## compilerOptions {#compileroptions}

Configura las opciones del compilador en tiempo de ejecución para la plantilla del componente.

- **Tipo**

  ```ts
  interface ComponentOptions {
    compilerOptions?: {
      isCustomElement?: (tag: string) => boolean
      whitespace?: 'condense' | 'preserve' // default: 'condense'
      delimiters?: [string, string] // default: ['{{', '}}']
      comments?: boolean // default: false
    }
  }
  ```

- **Detalles**

  Esta opción de configuración solo se respeta cuando se utiliza la construcción completa (es decir, el `vue.js` independiente que puede compilar plantillas en el navegador). Es compatible con las mismas opciones que el [app.config.compilerOptions](/api/application#app-config-compileroptions) a nivel de aplicación, y tiene mayor prioridad para el componente actual.

- **Ver también** [app.config.compilerOptions](/api/application#app-config-compileroptions)

## slots<sup class="vt-badge ts"/> {#slots}

- Solo compatible con 3.3+

Una opción para ayudar con la inferencia de tipos al usar `slots` programáticamente en funciones de renderizado.

- **Detalles**

  El valor en tiempo de ejecución de esta opción no se utiliza. Los tipos reales deben declararse mediante `type casting` usando el asistente de tipo `SlotsType`:

  ```ts
  import { SlotsType } from 'vue'

  defineComponent({
    slots: Object as SlotsType<{
      default: { foo: string; bar: number }
      item: { data: number }
    }>,
    setup(props, { slots }) {
      expectType<
        undefined | ((scope: { foo: string; bar: number }) => any)
      >(slots.default)
      expectType<undefined | ((scope: { data: number }) => any)>(
        slots.item
      )
    }
  })
  ```
