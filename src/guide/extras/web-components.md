# Vue y Componentes Web {#vue-and-web-components}

[Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components) es un término general para un conjunto de APIs nativas de la web que permiten a los desarrolladores crear elementos personalizados reutilizables.

Consideramos que Vue y Web Components son tecnologías principalmente complementarias. Vue tiene un excelente soporte tanto para consumir como para crear elementos personalizados. Ya sea que estés integrando elementos personalizados en una aplicación Vue existente, o usando Vue para construir y distribuir elementos personalizados, estás en buena compañía.

## Uso de elementos personalizados en Vue {#using-custom-elements-in-vue}

Vue [obtiene una puntuación perfecta del 100% en las pruebas de Custom Elements Everywhere](https://custom-elements-everywhere.com/libraries/vue/results/results.html). Consumir elementos personalizados dentro de una aplicación Vue funciona en gran medida de la misma manera que usar elementos HTML nativos, con algunas cosas a tener en cuenta:

### Omisión de la resolución de componentes {#skipping-component-resolution}

Por defecto, Vue intentará resolver una etiqueta HTML no nativa como un componente Vue registrado antes de recurrir a renderizarla como un elemento personalizado. Esto hará que Vue emita una advertencia de "fallo al resolver componente" durante el desarrollo. Para indicarle a Vue que ciertos elementos deben ser tratados como elementos personalizados y omitir la resolución de componentes, podemos especificar la opción [`compilerOptions.isCustomElement`](/api/application#app-config-compileroptions).

Si estás usando Vue con una configuración de compilación, la opción debe pasarse a través de las configuraciones de compilación, ya que es una opción en tiempo de compilación.

#### Ejemplo de configuración en el navegador {#example-in-browser-config}

```js
// Only works if using in-browser compilation.
// If using build tools, see config examples below.
app.config.compilerOptions.isCustomElement = (tag) => tag.includes('-')
```

#### Ejemplo de configuración de Vite {#example-vite-config}

```js [vite.config.js]
import vue from '@vitejs/plugin-vue'

export default {
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // treat all tags with a dash as custom elements
          isCustomElement: (tag) => tag.includes('-')
        }
      }
    })
  ]
}
```

#### Ejemplo de configuración de Vue CLI {#example-vue-cli-config}

```js [vue.config.js]
module.exports = {
  chainWebpack: (config) => {
    config.module
      .rule('vue')
      .use('vue-loader')
      .tap((options) => ({
        ...options,
        compilerOptions: {
          // treat any tag that starts with ion- as custom elements
          isCustomElement: (tag) => tag.startsWith('ion-')
        }
      }))
  }
}
```

### Paso de propiedades DOM {#passing-dom-properties}

Dado que los atributos DOM solo pueden ser cadenas, necesitamos pasar datos complejos a los elementos personalizados como propiedades DOM. Al establecer `props` en un elemento personalizado, Vue 3 verifica automáticamente la presencia de propiedades DOM usando el operador `in` y preferirá establecer el valor como una propiedad DOM si la clave está presente. Esto significa que, en la mayoría de los casos, no necesitarás pensar en esto si el elemento personalizado sigue las [mejores prácticas recomendadas](https://web.dev/custom-elements-best-practices/).

Sin embargo, podría haber casos raros en los que los datos deban pasarse como una propiedad DOM, pero el elemento personalizado no defina/refleje correctamente la propiedad (lo que hace que la verificación `in` falle). En este caso, puedes forzar que un enlace `v-bind` se establezca como una propiedad DOM utilizando el modificador `.prop`:

```vue-html
<my-element :user.prop="{ name: 'jack' }"></my-element>

<!-- shorthand equivalent -->
<my-element .user="{ name: 'jack' }"></my-element>
```

## Construcción de elementos personalizados con Vue {#building-custom-elements-con-vue}

El principal beneficio de los elementos personalizados es que pueden usarse con cualquier framework, o incluso sin un framework. Esto los hace ideales para distribuir componentes donde el consumidor final puede no estar usando la misma pila frontend, o cuando deseas aislar la aplicación final de los detalles de implementación de los componentes que utiliza.

### defineCustomElement {#definecustomelement}

Vue soporta la creación de elementos personalizados usando exactamente las mismas APIs de componentes Vue a través del método [`defineCustomElement`](/api/custom-elements#definecustomelement). El método acepta el mismo argumento que [`defineComponent`](/api/general#definecomponent), pero en su lugar devuelve un constructor de elementos personalizados que extiende `HTMLElement`:

```vue-html
<my-vue-element></my-vue-element>
```

```js
import { defineCustomElement } from 'vue'

const MyVueElement = defineCustomElement({
  // normal Vue component options here
  props: {},
  emits: {},
  template: `...`,

  // defineCustomElement only: CSS to be injected into shadow root
  styles: [`/* inlined css */`]
})

// Register the custom element.
// After registration, all `<my-vue-element>` tags
// on the page will be upgraded.
customElements.define('my-vue-element', MyVueElement)

// You can also programmatically instantiate the element:
// (can only be done after registration)
document.body.appendChild(
  new MyVueElement({
    // initial props (optional)
  })
)
```

#### Ciclo de vida {#lifecycle}

- Un elemento personalizado de Vue montará una instancia interna de componente Vue dentro de su `shadow root` cuando se llame a su [`connectedCallback`](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements#using_the_lifecycle_callbacks) por primera vez.

- Cuando se invoca el `disconnectedCallback` del elemento, Vue verificará si el elemento se ha desvinculado del documento después de un `microtask tick`.

  - Si el elemento sigue en el documento, es un movimiento y la instancia del componente se conservará;

  - Si el elemento se desvincula del documento, es una eliminación y la instancia del componente se desmontará.

#### Props {#props}

- Todas las `props` declaradas usando la opción `props` se definirán en el elemento personalizado como propiedades. Vue manejará automáticamente la reflexión entre atributos / propiedades cuando sea apropiado.

  - Los atributos siempre se reflejan en las propiedades correspondientes.

  - Las propiedades con valores primitivos (`string`, `boolean` o `number`) se reflejan como atributos.

- Vue también convierte automáticamente las `props` declaradas con tipos `Boolean` o `Number` al tipo deseado cuando se establecen como atributos (que siempre son cadenas). Por ejemplo, dada la siguiente declaración de `props`:

  ```js
  props: {
    selected: Boolean,
    index: Number
  }
  ```

  Y el uso del elemento personalizado:

  ```vue-html
  <my-element selected index="1"></my-element>
  ```

  En el componente, `selected` se convertirá a `true` (booleano) e `index` se convertirá a `1` (número).

#### Eventos {#events}

Los eventos emitidos a través de `this.$emit` o `emit` de la función `setup` se despachan como [`CustomEvents`](https://developer.mozilla.org/en-US/docs/Web/Events/Creating_and_triggering_events#adding_custom_data_%E2%80%93_customevent) nativos en el elemento personalizado. Los argumentos de evento adicionales (payload) se expondrán como un array en el objeto `CustomEvent` como su propiedad `detail`.

#### Slots {#slots}

Dentro del componente, los `slots` se pueden renderizar usando el elemento `<slot/>` como de costumbre. Sin embargo, al consumir el elemento resultante, solo acepta la [sintaxis nativa de slots](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_templates_and_slots):

- Los [scoped slots](/guide/components/slots#scoped-slots) no son compatibles.

- Al pasar `slots` con nombre, usa el atributo `slot` en lugar de la directiva `v-slot`:

  ```vue-html
  <my-element>
    <div slot="named">hello</div>
  </my-element>
  ```

#### Provide / Inject {#provide-inject}

La [API Provide / Inject](/guide/components/provide-inject#provide-inject) y su [equivalente de Composition API](/api/composition-api-dependency-injection#provide) también funcionan entre elementos personalizados definidos por Vue. Sin embargo, ten en cuenta que esto funciona **solo entre elementos personalizados**. Es decir, un elemento personalizado definido por Vue no podrá `inject` propiedades proporcionadas por un componente Vue que no sea un elemento personalizado.

#### Configuración a nivel de aplicación <sup class="vt-badge" data-text="3.5+" /> {#app-level-config}

Puedes configurar la instancia de aplicación de un elemento personalizado de Vue usando la opción `configureApp`:

```js
defineCustomElement(MyComponent, {
  configureApp(app) {
    app.config.errorHandler = (err) => {
      /* ... */
    }
  }
})
```

### SFC como elemento personalizado {#sfc-as-custom-element}

`defineCustomElement` también funciona con los Componentes de Archivo Único (SFC) de Vue. Sin embargo, con la configuración de herramientas predeterminada, los `<style>` dentro de los SFCs seguirán siendo extraídos y fusionados en un único archivo CSS durante la compilación de producción. Cuando se utiliza un SFC como un elemento personalizado, a menudo es deseable inyectar las etiquetas `<style>` en el `shadow root` del elemento personalizado.

Las herramientas SFC oficiales soportan la importación de SFCs en "custom element mode" (requiere `@vitejs/plugin-vue@^1.4.0` o `vue-loader@^16.5.0`). Un SFC cargado en modo de elemento personalizado incrusta sus etiquetas `<style>` como cadenas de CSS y las expone bajo la opción `styles` del componente. Esto será recogido por `defineCustomElement` e inyectado en el `shadow root` del elemento cuando se instancie.

Para optar por este modo, simplemente termina el nombre de tu archivo de componente con `.ce.vue`:

```js
import { defineCustomElement } from 'vue'
import Example from './Example.ce.vue'

console.log(Example.styles) // ["/* inlined css */"]

// convert into custom element constructor
const ExampleElement = defineCustomElement(Example)

// register
customElements.define('my-example', ExampleElement)
```

Si deseas personalizar qué archivos deben importarse en modo de elemento personalizado (por ejemplo, tratar _todos_ los SFCs como elementos personalizados), puedes pasar la opción `customElement` a los respectivos `build plugins`:

- [@vitejs/plugin-vue](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue#using-vue-sfcs-as-custom-elements)
- [vue-loader](https://github.com/vuejs/vue-loader/tree/next#v16-only-options)

### Consejos para una biblioteca de elementos personalizados de Vue {#tips-for-a-vue-custom-elements-library}

Al construir elementos personalizados con Vue, los elementos dependerán del `runtime` de Vue. Hay un costo de tamaño base de ~16kb, dependiendo de cuántas características se utilicen. Esto significa que no es ideal usar Vue si estás enviando un solo elemento personalizado; es posible que desees usar JavaScript vanilla, [petite-vue](https://github.com/vuejs/petite-vue), o frameworks que se especialicen en un tamaño de `runtime` pequeño. Sin embargo, el tamaño base está más que justificado si estás enviando una colección de elementos personalizados con lógica compleja, ya que Vue permitirá que cada componente se escriba con mucho menos código. Cuantos más elementos envíes juntos, mejor será el equilibrio.

Si los elementos personalizados se utilizarán en una aplicación que también usa Vue, puedes optar por externalizar Vue del bundle construido para que los elementos usen la misma copia de Vue de la aplicación anfitriona.

Se recomienda exportar los constructores de elementos individuales para dar a tus usuarios la flexibilidad de importarlos a demanda y registrarlos con los nombres de etiqueta deseados. También puedes exportar una función de conveniencia para registrar automáticamente todos los elementos. Aquí hay un ejemplo de punto de entrada de una biblioteca de elementos personalizados de Vue:

```js [elements.js]
import { defineCustomElement } from 'vue'
import Foo from './MyFoo.ce.vue'
import Bar from './MyBar.ce.vue'

const MyFoo = defineCustomElement(Foo)
const MyBar = defineCustomElement(Bar)

// export individual elements
export { MyFoo, MyBar }

export function register() {
  customElements.define('my-foo', MyFoo)
  customElements.define('my-bar', MyBar)
}
```

Un consumidor puede usar los elementos en un archivo Vue:

```vue
<script setup>
import { register } from 'path/to/elements.js'
register()
</script>

<template>
  <my-foo ...>
    <my-bar ...></my-bar>
  </my-foo>
</template>
```

O en cualquier otro framework, como uno con JSX, y con nombres personalizados:

```jsx
import { MyFoo, MyBar } from 'path/to/elements.js'

customElements.define('some-foo', MyFoo)
customElements.define('some-bar', MyBar)

export function MyComponent() {
  return <>
    <some-foo ... >
      <some-bar ... ></some-bar>
    </some-foo>
  </>
}
```

### Web Components basados en Vue y TypeScript {#web-components-and-typescript}

Al escribir plantillas SFC de Vue, es posible que desees [comprobar el tipo](/guide/scaling-up/tooling.html#typescript) de tus componentes Vue, incluyendo aquellos definidos como elementos personalizados.

Los elementos personalizados se registran globalmente en los navegadores utilizando sus APIs integradas, y por defecto no tendrán inferencia de tipos cuando se usen en plantillas de Vue. Para proporcionar soporte de tipos para los componentes Vue registrados como elementos personalizados, podemos registrar tipados de componentes globales aumentando la interfaz [`GlobalComponents`](https://github.com/vuejs/language-tools/wiki/Global-Component-Types) para la verificación de tipos en plantillas Vue (los usuarios de JSX pueden aumentar el tipo [JSX.IntrinsicElements](https://www.typescriptlang.org/docs/handbook/jsx.html#intrinsic-elements) en su lugar, lo cual no se muestra aquí).

Así es como se define el tipo para un elemento personalizado hecho con Vue:

```typescript
import { defineCustomElement } from 'vue'

// Import the Vue component.
import SomeComponent from './src/components/SomeComponent.ce.vue'

// Turn the Vue component into a Custom Element class.
export const SomeElement = defineCustomElement(SomeComponent)

// Remember to register the element class with the browser.
customElements.define('some-element', SomeElement)

// Add the new element type to Vue's GlobalComponents type.
declare module 'vue' {
  interface GlobalComponents {
    // Be sure to pass in the Vue component type here
    // (SomeComponent, *not* SomeElement).
    // Custom Elements require a hyphen in their name,
    // so use the hyphenated element name here.
    'some-element': typeof SomeComponent
  }
}
```

## Web Components no-Vue y TypeScript {#non-vue-web-components-and-typescript}

Aquí está la forma recomendada de habilitar la verificación de tipos en plantillas SFC de elementos personalizados que no están construidos con Vue.

:::tip Nota
Este enfoque es una posible forma de hacerlo, pero puede variar dependiendo del framework que se utilice para crear los elementos personalizados.
:::

Supongamos que tenemos un elemento personalizado con algunas propiedades JS y eventos definidos, y que se distribuye en una biblioteca llamada `some-lib`:

```ts [some-lib/src/SomeElement.ts]
// Define a class with typed JS properties.
export class SomeElement extends HTMLElement {
  foo: number = 123
  bar: string = 'blah'

  lorem: boolean = false

  // This method should not be exposed to template types.
  someMethod() {
    /* ... */
  }

  // ... implementation details omitted ...
  // ... assume the element dispatches events named "apple-fell" ...
}

customElements.define('some-element', SomeElement)

// This is a list of properties of SomeElement that will be selected for type
// checking in framework templates (f.e. Vue SFC templates). Any other
// properties will not be exposed.
export type SomeElementAttributes = 'foo' | 'bar'

// Define the event types that SomeElement dispatches.
export type SomeElementEvents = {
  'apple-fell': AppleFellEvent
}

export class AppleFellEvent extends Event {
  /* ... details omitted ... */
}
```

Los detalles de implementación se han omitido, pero la parte importante es que tenemos definiciones de tipo para dos cosas: tipos de `props` y tipos de eventos.

Creemos un `type helper` para registrar fácilmente definiciones de tipos de elementos personalizados en Vue:

```ts [some-lib/src/DefineCustomElement.ts]
// We can re-use this type helper per each element we need to define.
type DefineCustomElement<
  ElementType extends HTMLElement,
  Events extends EventMap = {},
  SelectedAttributes extends keyof ElementType = keyof ElementType
> = new () => ElementType & {
  // Use $props to define the properties exposed to template type checking. Vue
  // specifically reads prop definitions from the `$props` type. Note that we
  // combine the element's props with the global HTML props and Vue's special
  // props.
  /** @deprecated Do not use the $props property on a Custom Element ref, 
    this is for template prop types only. */
  $props: HTMLAttributes &
    Partial<Pick<ElementType, SelectedAttributes>> &
    PublicProps

  // Use $emit to specifically define event types. Vue specifically reads event
  // types from the `$emit` type. Note that `$emit` expects a particular format
  // that we map `Events` to.
  /** @deprecated Do not use the $emit property on a Custom Element ref, 
    this is for template prop types only. */
  $emit: VueEmit<Events>
}

type EventMap = {
  [event: string]: Event
}

// This maps an EventMap to the format that Vue's $emit type expects.
type VueEmit<T extends EventMap> = EmitFn<{
  [K in keyof T]: (event: T[K]) => void
}>
```

:::tip Nota
Hemos marcado `$props` y `$emit` como `deprecated` para que, cuando obtengamos una `ref` a un elemento personalizado, no tengamos la tentación de usar estas propiedades, ya que estas propiedades son solo para fines de verificación de tipos cuando se trata de elementos personalizados. Estas propiedades no existen realmente en las instancias de elementos personalizados.
:::

Usando el `type helper` ahora podemos seleccionar las propiedades JS que deben exponerse para la verificación de tipos en las plantillas de Vue:

```ts [some-lib/src/SomeElement.vue.ts]
import {
  SomeElement,
  SomeElementAttributes,
  SomeElementEvents
} from './SomeElement.js'
import type { Component } from 'vue'
import type { DefineCustomElement } from './DefineCustomElement'

// Add the new element type to Vue's GlobalComponents type.
declare module 'vue' {
  interface GlobalComponents {
    'some-element': DefineCustomElement<
      SomeElement,
      SomeElementAttributes,
      SomeElementEvents
    >
  }
}
```

Supongamos que `some-lib` construye sus archivos TypeScript fuente en una carpeta `dist/`. Un usuario de `some-lib` puede entonces importar `SomeElement` y usarlo en un SFC de Vue de la siguiente manera:

```vue [SomeElementImpl.vue]
<script setup lang="ts">
// This will create and register the element with the browser.
import 'some-lib/dist/SomeElement.js'

// A user that is using TypeScript and Vue should additionally import the
// Vue-specific type definition (users of other frameworks may import other
// framework-specific type definitions).
import type {} from 'some-lib/dist/SomeElement.vue.js'

import { useTemplateRef, onMounted } from 'vue'

const el = useTemplateRef('el')

onMounted(() => {
  console.log(
    el.value!.foo,
    el.value!.bar,
    el.value!.lorem,
    el.value!.someMethod()
  )

  // Do not use these props, they are `undefined`
  // IDE will show them crossed out
  el.$props
  el.$emit
})
</script>

<template>
  <!-- Now we can use the element, with type checking: -->
  <some-element
    ref="el"
    :foo="456"
    :blah="'hello'"
    @apple-fell="
      (event) => {
        // The type of `event` is inferred here to be `AppleFellEvent`
      }
    "
  ></some-element>
</template>
```

Si un elemento no tiene definiciones de tipo, los tipos de las propiedades y los eventos se pueden definir de forma más manual:

```vue [SomeElementImpl.vue]
<script setup lang="ts">
// Suppose that `some-lib` is plain JS without type definitions, and TypeScript
// cannot infer the types:
import { SomeElement } from 'some-lib'

// We'll use the same type helper as before.
import { DefineCustomElement } from './DefineCustomElement'

type SomeElementProps = { foo?: number; bar?: string }
type SomeElementEvents = { 'apple-fell': AppleFellEvent }
interface AppleFellEvent extends Event {
  /* ... */
}

// Add the new element type to Vue's GlobalComponents type.
declare module 'vue' {
  interface GlobalComponents {
    'some-element': DefineCustomElement<
      SomeElementProps,
      SomeElementEvents
    >
  }
}

// ... same as before, use a reference to the element ...
</script>

<template>
  <!-- ... same as before, use the element in the template ... -->
</template>
```

Los autores de elementos personalizados no deben exportar automáticamente definiciones de tipo de elementos personalizados específicas del framework desde sus bibliotecas, por ejemplo, no deben exportarlas desde un archivo `index.ts` que también exporta el resto de la biblioteca, de lo contrario, los usuarios tendrán errores inesperados de aumento de módulos. Los usuarios deben importar el archivo de definición de tipo específico del framework que necesiten.

## Web Components vs. Componentes Vue {#web-components-vs-vue-components}

Algunos desarrolladores creen que los modelos de componentes propietarios de los frameworks deben evitarse, y que el uso exclusivo de Custom Elements hace que una aplicación sea "a prueba de futuro". Aquí intentaremos explicar por qué creemos que esta es una visión demasiado simplista del problema.

De hecho, existe un cierto nivel de superposición de características entre Custom Elements y Vue Components: ambos nos permiten definir componentes reutilizables con paso de datos, emisión de eventos y gestión del ciclo de vida. Sin embargo, las APIs de Web Components son relativamente de bajo nivel y básicas. Para construir una aplicación real, necesitamos bastantes capacidades adicionales que la plataforma no cubre:

- Un sistema de plantillas declarativo y eficiente;

- Un sistema de gestión de estado reactivo que facilite la extracción y reutilización de lógica entre componentes;

- Una forma performante de renderizar los componentes en el servidor e hidratarlos en el cliente (SSR), lo cual es importante para el SEO y las [métricas de Web Vitals como LCP](https://web.dev/vitals/). El SSR nativo de elementos personalizados típicamente implica simular el DOM en `Node.js` y luego serializar el DOM mutado, mientras que el SSR de Vue compila en concatenación de cadenas siempre que sea posible, lo cual es mucho más eficiente.

El modelo de componentes de Vue está diseñado teniendo en cuenta estas necesidades como un sistema coherente.

Con un equipo de ingeniería competente, probablemente podrías construir el equivalente sobre Custom Elements nativos, pero esto también significa que estás asumiendo la carga de mantenimiento a largo plazo de un framework interno, mientras pierdes los beneficios del ecosistema y la comunidad de un framework maduro como Vue.

También hay frameworks construidos usando Custom Elements como base de su modelo de componentes, pero todos inevitablemente tienen que introducir sus soluciones propietarias a los problemas mencionados anteriormente. El uso de estos frameworks implica aceptar sus decisiones técnicas sobre cómo resolver estos problemas, lo cual, a pesar de lo que se pueda anunciar, no te aísla automáticamente de posibles cambios futuros.

También hay algunas áreas en las que encontramos que los elementos personalizados son limitantes:

- La evaluación ansiosa de `slots` dificulta la composición de componentes. Los [scoped slots](/guide/components/slots#scoped-slots) de Vue son un mecanismo potente para la composición de componentes, que no puede ser soportado por los elementos personalizados debido a la naturaleza ansiosa de los `slots` nativos. Los `slots` ansiosos también significan que el componente receptor no puede controlar cuándo o si renderizar un fragmento de contenido del `slot`.

- El envío de elementos personalizados con CSS con ámbito `shadow DOM` hoy en día requiere incrustar el CSS dentro de JavaScript para que puedan inyectarse en los `shadow roots` en tiempo de ejecución. También resultan en estilos duplicados en el marcado en escenarios SSR. Se están trabajando en [características de la plataforma](https://github.com/whatwg/html/pull/4898/) en esta área, pero por ahora todavía no están universalmente soportadas, y todavía hay preocupaciones de rendimiento en producción / SSR que deben abordarse. Mientras tanto, los SFC de Vue proporcionan [mecanismos de ámbito CSS](/api/sfc-css-features) que soportan la extracción de los estilos en archivos CSS planos.

Vue siempre se mantendrá al día con los últimos estándares en la plataforma web, y con gusto aprovecharemos todo lo que la plataforma proporcione si nos facilita el trabajo. Sin embargo, nuestro objetivo es proporcionar soluciones que funcionen bien y funcionen hoy. Eso significa que tenemos que incorporar nuevas características de la plataforma con una mentalidad crítica, y eso implica llenar las lagunas donde los estándares se quedan cortos mientras ese sea el caso.
