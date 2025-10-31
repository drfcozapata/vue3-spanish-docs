# API de Renderizado en el Servidor {#server-side-rendering-api}

## renderToString() {#rendertostring}

- **Exportado desde `vue/server-renderer`**

- **Tipo**

  ```ts
  function renderToString(
    input: App | VNode,
    context?: SSRContext
  ): Promise<string>
  ```

- **Ejemplo**

  ```js
  import { createSSRApp } from 'vue'
  import { renderToString } from 'vue/server-renderer'

  const app = createSSRApp({
    data: () => ({ msg: 'hello' }),
    template: `<div>{{ msg }}</div>`
  })

  ;(async () => {
    const html = await renderToString(app)
    console.log(html)
  })()
  ```

  ### Contexto SSR {#ssr-context}

  Puedes pasar un objeto de contexto opcional, que se puede usar para registrar datos adicionales durante el renderizado, por ejemplo, [accediendo al contenido de los Teleports](/guide/scaling-up/ssr#teleports):

  ```js
  const ctx = {}
  const html = await renderToString(app, ctx)

  console.log(ctx.teleports) // { '#teleported': 'teleported content' }
  ```

  La mayoría de las otras APIs de SSR en esta página también aceptan opcionalmente un objeto de contexto. Se puede acceder al objeto de contexto en el código del componente a través del asistente [useSSRContext](#usessrcontext).

- **Ver también** [Guía - Renderizado en el Servidor](/guide/scaling-up/ssr)

## renderToNodeStream() {#rendertonodestream}

Renderiza la entrada como un [stream Readable de Node.js](https://nodejs.org/api/stream.html#stream_class_stream_readable).

- **Exportado desde `vue/server-renderer`**

- **Tipo**

  ```ts
  function renderToNodeStream(
    input: App | VNode,
    context?: SSRContext
  ): Readable
  ```

- **Ejemplo**

  ```js
  // dentro de un handler http de Node.js
  renderToNodeStream(app).pipe(res)
  ```

  :::tip Nota
  Este método no es compatible con la compilación ESM de `vue/server-renderer`, que está desacoplada de los entornos de Node.js. Usa [`pipeToNodeWritable`](#pipetonodowritable) en su lugar.
  :::

## pipeToNodeWritable() {#pipetonodowritable}

Renderiza y redirige a una instancia de [stream Writable de Node.js](https://nodejs.org/api/stream.html#stream_writable_streams) existente.

- **Exportado desde `vue/server-renderer`**

- **Tipo**

  ```ts
  function pipeToNodeWritable(
    input: App | VNode,
    context: SSRContext = {},
    writable: Writable
  ): void
  ```

- **Ejemplo**

  ```js
  // dentro de un handler http de Node.js
  pipeToNodeWritable(app, {}, res)
  ```

## renderToWebStream() {#rendertowebstream}

Renderiza la entrada como un [Web ReadableStream](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API).

- **Exportado desde `vue/server-renderer`**

- **Tipo**

  ```ts
  function renderToWebStream(
    input: App | VNode,
    context?: SSRContext
  ): ReadableStream
  ```

- **Ejemplo**

  ```js
  // dentro de un entorno con soporte para ReadableStream
  return new Response(renderToWebStream(app))
  ```

  :::tip Nota
  En entornos que no exponen el constructor `ReadableStream` en el ámbito global, se debe usar [`pipeToWebWritable()`](#pipetowebwritable) en su lugar.
  :::

## pipeToWebWritable() {#pipetowebwritable}

Renderiza y redirige a una instancia de [Web WritableStream](https://developer.mozilla.org/en-US/docs/Web/API/WritableStream) existente.

- **Exportado desde `vue/server-renderer`**

- **Tipo**

  ```ts
  function pipeToWebWritable(
    input: App | VNode,
    context: SSRContext = {},
    writable: WritableStream
  ): void
  ```

- **Ejemplo**

  Esto se usa típicamente en combinación con [`TransformStream`](https://developer.mozilla.org/en-US/docs/Web/API/TransformStream):

  ```js
  // TransformStream está disponible en entornos como CloudFlare workers.
  // en Node.js, TransformStream necesita ser importado explícitamente desde 'stream/web'
  const { readable, writable } = new TransformStream()
  pipeToWebWritable(app, {}, writable)

  return new Response(readable)
  ```

## renderToSimpleStream() {#rendertosimplestream}

Renderiza la entrada en modo streaming usando una interfaz `readable` simple.

- **Exportado desde `vue/server-renderer`**

- **Tipo**

  ```ts
  function renderToSimpleStream(
    input: App | VNode,
    context: SSRContext,
    options: SimpleReadable
  ): SimpleReadable

  interface SimpleReadable {
    push(content: string | null): void
    destroy(err: any): void
  }
  ```

- **Ejemplo**

  ```js
  let res = ''

  renderToSimpleStream(
    app,
    {},
    {
      push(chunk) {
        if (chunk === null) {
          // hecho
          console(`render complete: ${res}`)
        } else {
          res += chunk
        }
      },
      destroy(err) {
        // error encontrado
      }
    }
  )
  ```

## useSSRContext() {#usessrcontext}

Una API de tiempo de ejecución utilizada para recuperar el objeto de contexto pasado a `renderToString()` u otras APIs de renderizado en el servidor.

- **Tipo**

  ```ts
  function useSSRContext<T = Record<string, any>>(): T | undefined
  ```

- **Ejemplo**

  El contexto recuperado se puede usar para adjuntar información necesaria para renderizar el HTML final (por ejemplo, metadatos del `head`).

  ```vue
  <script setup>
  import { useSSRContext } from 'vue'

  // asegúrate de llamarlo solo durante el SSR
  // https://vitejs.dev/guide/ssr.html#conditional-logic
  if (import.meta.env.SSR) {
    const ctx = useSSRContext()
    // ...adjuntar propiedades al contexto
  }
  </script>
  ```

## data-allow-mismatch <sup class="vt-badge" data-text="3.5+" /> {#data-allow-mismatch}

Un atributo especial que se puede usar para suprimir las advertencias de [desajuste de hidratación](/guide/scaling-up/ssr#hydration-mismatch).

- **Ejemplo**

  ```html
  <div data-allow-mismatch="text">{{ data.toLocaleString() }}</div>
  ```

  El valor puede limitar el desajuste permitido a un tipo específico. Los valores permitidos son:

  - `text`
  - `children` (solo permite desajustes para hijos directos)
  - `class`
  - `style`
  - `attribute`

  Si no se proporciona ningún valor, se permitirán todos los tipos de desajustes.