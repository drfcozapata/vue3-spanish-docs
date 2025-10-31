# Directivas Integradas {#built-in-directives}

## v-text {#v-text}

Actualiza el contenido de texto del elemento.

- **Espera:** `string`

- **Detalles**

  `v-text` funciona estableciendo la propiedad [textContent](https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent) del elemento, por lo que sobrescribirá cualquier contenido existente dentro del elemento. Si necesitas actualizar parte del `textContent`, deberías usar [interpolaciones de bigotes](/guide/essentials/template-syntax#text-interpolation) en su lugar.

- **Ejemplo**

  ```vue-html
  <span v-text="msg"></span>
  <!-- same as -->
  <span>{{msg}}</span>
  ```

- **Ver también** [Sintaxis de Plantilla - Interpolación de Texto](/guide/essentials/template-syntax#text-interpolation)

## v-html {#v-html}

Actualiza el [innerHTML](https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML) del elemento.

- **Espera:** `string`

- **Detalles**

  El contenido de `v-html` se inserta como HTML plano - la sintaxis de plantilla de Vue no será procesada. Si te encuentras intentando componer plantillas usando `v-html`, intenta repensar la solución utilizando componentes en su lugar.

  ::: warning Nota de Seguridad
  Renderizar dinámicamente HTML arbitrario en tu sitio web puede ser muy peligroso porque puede conducir fácilmente a [ataques XSS](https://en.wikipedia.org/wiki/Cross-site_scripting). Usa `v-html` solo en contenido de confianza y **nunca** en contenido proporcionado por el usuario.
  :::

  En [Componentes de Archivo Único](/guide/scaling-up/sfc), los estilos `scoped` no se aplicarán al contenido dentro de `v-html`, porque ese HTML no es procesado por el compilador de plantillas de Vue. Si deseas aplicar estilos CSS `scoped` al contenido de `v-html`, puedes usar [módulos CSS](./sfc-css-features#css-modules) o un elemento `<style>` global adicional con una estrategia de alcance manual como BEM.

- **Ejemplo**

  ```vue-html
  <div v-html="html"></div>
  ```

- **Ver también** [Sintaxis de Plantilla - HTML Crudo](/guide/essentials/template-syntax#raw-html)

## v-show {#v-show}

Alterna la visibilidad del elemento basándose en el valor de verdad de la expresión.

- **Espera:** `any`

- **Detalles**

  `v-show` funciona estableciendo la propiedad CSS `display` mediante estilos en línea, e intentará respetar el valor `display` inicial cuando el elemento sea visible. También dispara transiciones cuando su condición cambia.

- **Ver también** [Renderizado Condicional - v-show](/guide/essentials/conditional#v-show)

## v-if {#v-if}

Renderiza condicionalmente un elemento o un fragmento de plantilla basándose en el valor de verdad de la expresión.

- **Espera:** `any`

- **Detalles**

  Cuando un elemento con `v-if` es alternado, el elemento y sus directivas / componentes contenidos son destruidos y reconstruidos. Si la condición inicial es falsa, el contenido interno no será renderizado en absoluto.

  Puede usarse en `<template>` para denotar un bloque condicional que contiene solo texto o múltiples elementos.

  Esta directiva dispara transiciones cuando su condición cambia.

  Cuando se usan juntas, `v-if` tiene una prioridad más alta que `v-for`. No recomendamos usar estas dos directivas juntas en un mismo elemento — consulta la [guía de renderizado de listas](/guide/essentials/list#v-for-with-v-if) para más detalles.

- **Ver también** [Renderizado Condicional - v-if](/guide/essentials/conditional#v-if)

## v-else {#v-else}

Denota el "bloque else" para `v-if` o para una cadena `v-if` / `v-else-if`.

- **No espera expresión**

- **Detalles**

  - Restricción: el elemento hermano anterior debe tener `v-if` o `v-else-if`.

  - Puede usarse en `<template>` para denotar un bloque condicional que contiene solo texto o múltiples elementos.

- **Ejemplo**

  ```vue-html
  <div v-if="Math.random() > 0.5">
    Now you see me
  </div>
  <div v-else>
    Now you don't
  </div>
  ```

- **Ver también** [Renderizado Condicional - v-else](/guide/essentials/conditional#v-else)

## v-else-if {#v-else-if}

Denota el "bloque else if" para `v-if`. Puede encadenarse.

- **Espera:** `any`

- **Detalles**

  - Restricción: el elemento hermano anterior debe tener `v-if` o `v-else-if`.

  - Puede usarse en `<template>` para denotar un bloque condicional que contiene solo texto o múltiples elementos.

- **Ejemplo**

  ```vue-html
  <div v-if="type === 'A'">
    A
  </div>
  <div v-else-if="type === 'B'">
    B
  </div>
  <div v-else-if="type === 'C'">
    C
  </div>
  <div v-else>
    Not A/B/C
  </div>
  ```

- **Ver también** [Renderizado Condicional - v-else-if](/guide/essentials/conditional#v-else-if)

## v-for {#v-for}

Renderiza el elemento o bloque de plantilla múltiples veces basándose en los datos de origen.

- **Espera:** `Array | Object | number | string | Iterable`

- **Detalles**

  El valor de la directiva debe usar la sintaxis especial `alias in expresion` para proporcionar un alias para el elemento actual que se está iterando:

  ```vue-html
  <div v-for="item in items">
    {{ item.text }}
  </div>
  ```

  Alternativamente, también puedes especificar un alias para el índice (o la `key` si se usa en un `Object`):

  ```vue-html
  <div v-for="(item, index) in items"></div>
  <div v-for="(value, key) in object"></div>
  <div v-for="(value, name, index) in object"></div>
  ```

  El comportamiento por defecto de `v-for` intentará actualizar los elementos en su lugar sin moverlos. Para forzarlo a reordenar los elementos, debes proporcionar una pista de ordenación con el atributo especial `key`:

  ```vue-html
  <div v-for="item in items" :key="item.id">
    {{ item.text }}
  </div>
  ```

  `v-for` también puede funcionar con valores que implementan el [Protocolo Iterable](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterable_protocol), incluyendo `Map` y `Set` nativos.

- **Ver también**
  - [Renderizado de Listas](/guide/essentials/list)

## v-on {#v-on}

Adjunta un escuchador de eventos al elemento.

- **Abreviatura:** `@`

- **Espera:** `Function | Declaración en Línea | Object (sin argumento)`

- **Argumento:** `event` (opcional si se usa la sintaxis `Object`)

- **Modificadores**

  - `.stop` - llama a `event.stopPropagation()`.
  - `.prevent` - llama a `event.preventDefault()`.
  - `.capture` - añade el escuchador de eventos en modo de captura.
  - `.self` - solo dispara el manejador si el evento fue despachado desde este elemento.
  - `.{keyAlias}` - solo dispara el manejador en ciertas `key`s.
  - `.once` - dispara el manejador como máximo una vez.
  - `.left` - solo dispara el manejador para eventos del botón izquierdo del ratón.
  - `.right` - solo dispara el manejador para eventos del botón derecho del ratón.
  - `.middle` - solo dispara el manejador para eventos del botón central del ratón.
  - `.passive` - adjunta un evento DOM con `{ passive: true }`.

- **Detalles**

  El tipo de evento se denota por el argumento. La expresión puede ser el nombre de un método, una declaración en línea, u omitirse si hay modificadores presentes.

  Cuando se usa en un elemento normal, escucha solo a [**eventos DOM nativos**](https://developer.mozilla.org/en-US/docs/Web/Events). Cuando se usa en un componente de elemento personalizado, escucha a **eventos personalizados** emitidos en ese componente hijo.

  Al escuchar eventos DOM nativos, el método recibe el evento nativo como único argumento. Si se usa una declaración en línea, la declaración tiene acceso a la propiedad especial `$event`: `v-on:click="handle('ok', $event)"`.

  `v-on` también admite la vinculación a un objeto de pares de evento / escuchador sin un argumento. Ten en cuenta que al usar la sintaxis de objeto, no admite ningún modificador.

- **Ejemplo**

  ```vue-html
  <!-- method handler -->
  <button v-on:click="doThis"></button>

  <!-- dynamic event -->
  <button v-on:[event]="doThis"></button>

  <!-- inline statement -->
  <button v-on:click="doThat('hello', $event)"></button>

  <!-- shorthand -->
  <button @click="doThis"></button>

  <!-- shorthand dynamic event -->
  <button @[event]="doThis"></button>

  <!-- stop propagation -->
  <button @click.stop="doThis"></button>

  <!-- prevent default -->
  <button @click.prevent="doThis"></button>

  <!-- prevent default without expression -->
  <form @submit.prevent></form>

  <!-- chain modifiers -->
  <button @click.stop.prevent="doThis"></button>

  <!-- key modifier using keyAlias -->
  <input @keyup.enter="onEnter" />

  <!-- the click event will be triggered at most once -->
  <button v-on:click.once="doThis"></button>

  <!-- object syntax -->
  <button v-on="{ mousedown: doThis, mouseup: doThat }"></button>
  ```

  Escuchando eventos personalizados en un componente hijo (el manejador se llama cuando "my-event" es emitido en el hijo):

  ```vue-html
  <MyComponent @my-event="handleThis" />

  <!-- inline statement -->
  <MyComponent @my-event="handleThis(123, $event)" />
  ```

- **Ver también**
  - [Manejo de Eventos](/guide/essentials/event-handling)
  - [Componentes - Eventos Personalizados](/guide/essentials/component-basics#listening-to-events)

## v-bind {#v-bind}

Vincula dinámicamente uno o más atributos, o una `prop` de componente a una expresión.

- **Abreviatura:**
  - `:` o `.` (cuando se usa el modificador `.prop`)
  - Omitiendo valor (cuando el atributo y el valor vinculado tienen el mismo nombre, requiere 3.4+)

- **Espera:** `any (con argumento) | Object (sin argumento)`

- **Argumento:** `attrOrProp (opcional)`

- **Modificadores**

  - `.camel` - transforma el nombre del atributo kebab-case a camelCase.
  - `.prop` - fuerza que una vinculación se establezca como una propiedad DOM (3.2+).
  - `.attr` - fuerza que una vinculación se establezca como un atributo DOM (3.2+).

- **Uso**

  Cuando se usa para vincular el atributo `class` o `style`, `v-bind` admite tipos de valores adicionales como `Array` u `Object`. Consulta la sección de la guía enlazada a continuación para más detalles.

  Al establecer una vinculación en un elemento, Vue por defecto comprueba si el elemento tiene la `key` definida como una propiedad usando una verificación con el operador `in`. Si la propiedad está definida, Vue establecerá el valor como una propiedad DOM en lugar de un atributo. Esto debería funcionar en la mayoría de los casos, pero puedes anular este comportamiento usando explícitamente los modificadores `.prop` o `.attr`. Esto es a veces necesario, especialmente cuando [se trabaja con elementos personalizados](/guide/extras/web-components#passing-dom-properties).

  Cuando se usa para la vinculación de una `prop` de componente, la `prop` debe declararse correctamente en el componente hijo.

  Cuando se usa sin un argumento, puede usarse para vincular un objeto que contiene pares de nombre-valor de atributo.

- **Ejemplo**

  ```vue-html
  <!-- bind an attribute -->
  <img v-bind:src="imageSrc" />

  <!-- dynamic attribute name -->
  <button v-bind:[key]="value"></button>

  <!-- shorthand -->
  <img :src="imageSrc" />

  <!-- same-name shorthand (3.4+), expands to :src="src" -->
  <img :src />

  <!-- shorthand dynamic attribute name -->
  <button :[key]="value"></button>

  <!-- with inline string concatenation -->
  <img :src="'/path/to/images/' + fileName" />

  <!-- class binding -->
  <div :class="{ red: isRed }"></div>
  <div :class="[classA, classB]"></div>
  <div :class="[classA, { classB: isB, classC: isC }]"></div>

  <!-- style binding -->
  <div :style="{ fontSize: size + 'px' }"></div>
  <div :style="[styleObjectA, styleObjectB]"></div>

  <!-- binding an object of attributes -->
  <div v-bind="{ id: someProp, 'other-attr': otherProp }"></div>

  <!-- prop binding. "prop" must be declared in the child component. -->
  <MyComponent :prop="someThing" />

  <!-- pass down parent props in common with a child component -->
  <MyComponent v-bind="$props" />

  <!-- XLink -->
  <svg><a :xlink:special="foo"></a></svg>
  ```

  El modificador `.prop` también tiene una abreviatura dedicada, `.`:

  ```vue-html
  <div :someProperty.prop="someObject"></div>

  <!-- equivalent to -->
  <div .someProperty="someObject"></div>
  ```

  El modificador `.camel` permite camelizar un nombre de atributo `v-bind` cuando se usan plantillas en el DOM, por ejemplo, el atributo SVG `viewBox`:

  ```vue-html
  <svg :view-box.camel="viewBox"></svg>
  ```

  `.camel` no es necesario si estás utilizando plantillas de cadena, o pre-compilando la plantilla con un paso de construcción.

- **Ver también**
  - [Vinculación de Clases y Estilos](/guide/essentials/class-and-style)
  - [Componentes - Detalles del Paso de Props](/guide/components/props#prop-passing-details)

## v-model {#v-model}

Crea una vinculación bidireccional en un elemento de entrada de formulario o un componente.

- **Espera:** varía según el valor del elemento de entrada de formulario o la salida de los componentes

- **Limitado a:**

  - `<input>`
  - `<select>`
  - `<textarea>`
  - componentes

- **Modificadores**

  - [`.lazy`](/guide/essentials/forms#lazy) - escucha a eventos `change` en lugar de `input`
  - [`.number`](/guide/essentials/forms#number) - convierte cadenas de entrada válidas a números
  - [`.trim`](/guide/essentials/forms#trim) - recorta la entrada

- **Ver también**

  - [Vinculaciones de Entrada de Formulario](/guide/essentials/forms)
  - [Eventos de Componente - Uso con `v-model`](/guide/components/v-model)

## v-slot {#v-slot}

Denota `slots` nombrados o `slots` con ámbito que esperan recibir `props`.

- **Abreviatura:** `#`

- **Espera:** Expresión JavaScript válida en una posición de argumento de función, incluyendo soporte para desestructuración. Opcional - solo es necesaria si se esperan `props` para el `slot`.

- **Argumento:** nombre del `slot` (opcional, por defecto `default`)

- **Limitado a:**

  - `<template>`
  - [componentes](/guide/components/slots#scoped-slots) (para un `slot` por defecto solitario con `props`)

- **Ejemplo**

  ```vue-html
  <!-- Named slots -->
  <BaseLayout>
    <template v-slot:header>
      Header content
    </template>

    <template v-slot:default>
      Default slot content
    </template>

    <template v-slot:footer>
      Footer content
    </template>
  </BaseLayout>

  <!-- Named slot that receives props -->
  <InfiniteScroll>
    <template v-slot:item="slotProps">
      <div class="item">
        {{ slotProps.item.text }}
      </div>
    </template>
  </InfiniteScroll>

  <!-- Default slot that receive props, with destructuring -->
  <Mouse v-slot="{ x, y }">
    Mouse position: {{ x }}, {{ y }}
  </Mouse>
  ```

- **Ver también**
  - [Componentes - Slots](/guide/components/slots)

## v-pre {#v-pre}

Omite la compilación para este elemento y todos sus hijos.

- **No espera expresión**

- **Detalles**

  Dentro del elemento con `v-pre`, toda la sintaxis de plantilla de Vue se conservará y se renderizará tal cual. El caso de uso más común es mostrar etiquetas de bigotes sin procesar.

- **Ejemplo**

  ```vue-html
  <span v-pre>{{ this will not be compiled }}</span>
  ```

## v-once {#v-once}

Renderiza el elemento y el componente una sola vez, y omite futuras actualizaciones.

- **No espera expresión**

- **Detalles**

  En renderizados posteriores, el elemento/componente y todos sus hijos serán tratados como contenido estático y se omitirán. Esto puede usarse para optimizar el rendimiento de las actualizaciones.

  ```vue-html
  <!-- single element -->
  <span v-once>This will never change: {{msg}}</span>
  <!-- the element have children -->
  <div v-once>
    <h1>Comment</h1>
    <p>{{msg}}</p>
  </div>
  <!-- component -->
  <MyComponent v-once :comment="msg"></MyComponent>
  <!-- `v-for` directive -->
  <ul>
    <li v-for="i in list" v-once>{{i}}</li>
  </ul>
  ```

  Desde la versión 3.2, también puedes memoizar parte de la plantilla con condiciones de invalidación usando [`v-memo`](#v-memo).

- **Ver también**
  - [Sintaxis de Vinculación de Datos - interpolaciones](/guide/essentials/template-syntax#text-interpolation)
  - [v-memo](#v-memo)

## v-memo {#v-memo}

- Solo compatible con 3.2+

- **Espera:** `any[]`

- **Detalles**

  Memoiza un subárbol de la plantilla. Puede usarse tanto en elementos como en componentes. La directiva espera un array de longitud fija de valores de dependencia para comparar para la memoización. Si cada valor en el array fue el mismo que en el último renderizado, entonces las actualizaciones para todo el subárbol se omitirán. Por ejemplo:

  ```vue-html
  <div v-memo="[valueA, valueB]">
    ...
  </div>
  ```

  Cuando el componente se vuelve a renderizar, si tanto `valueA` como `valueB` permanecen iguales, todas las actualizaciones para este `<div>` y sus hijos se omitirán. De hecho, incluso la creación de VNode del DOM Virtual también se omitirá ya que la copia memoizada del subárbol puede ser reutilizada.

  Es importante especificar el array de memoización correctamente, de lo contrario podríamos omitir actualizaciones que sí deberían aplicarse. `v-memo` con un array de dependencias vacío (`v-memo="[]"`) sería funcionalmente equivalente a `v-once`.

  **Uso con `v-for`**

  `v-memo` se proporciona únicamente para micro-optimizaciones en escenarios críticos de rendimiento y rara vez debería ser necesario. El caso más común donde esto puede ser útil es al renderizar grandes listas con `v-for` (donde `length > 1000`):

  ```vue-html
  <div v-for="item in list" :key="item.id" v-memo="[item.id === selected]">
    <p>ID: {{ item.id }} - selected: {{ item.id === selected }}</p>
    <p>...more child nodes</p>
  </div>
  ```

  Cuando el estado `selected` del componente cambia, se creará una gran cantidad de VNodes a pesar de que la mayoría de los elementos permanecieron exactamente iguales. El uso de `v-memo` aquí está diciendo esencialmente "solo actualiza este elemento si pasó de no seleccionado a seleccionado, o viceversa". Esto permite que cada elemento no afectado reutilice su VNode anterior y omita por completo la comparación (diffing). Ten en cuenta que no necesitamos incluir `item.id` en el array de dependencia de memo aquí ya que Vue lo infiere automáticamente de la `key` del elemento.

  :::warning
  Cuando uses `v-memo` con `v-for`, asegúrate de que se utilicen en el mismo elemento. **`v-memo` no funciona dentro de `v-for`.**
  :::

  `v-memo` también puede usarse en componentes para prevenir manualmente actualizaciones no deseadas en ciertos casos extremos donde la verificación de actualización del componente hijo ha sido desoptimizado. Pero de nuevo, es responsabilidad del desarrollador especificar arrays de dependencia correctos para evitar omitir actualizaciones necesarias.

- **Ver también**
  - [v-once](#v-once)

## v-cloak {#v-cloak}

Se utiliza para ocultar la plantilla sin compilar hasta que esté lista.

- **No espera expresión**

- **Detalles**

  **Esta directiva solo es necesaria en configuraciones sin paso de construcción.**

  Al usar plantillas en el DOM, puede haber un "destello de plantillas sin compilar": el usuario puede ver etiquetas de bigotes sin procesar hasta que el componente montado las reemplace con contenido renderizado.

  `v-cloak` permanecerá en el elemento hasta que la instancia del componente asociado esté montada. Combinado con reglas CSS como `[v-cloak] { display: none }`, se puede usar para ocultar las plantillas sin procesar hasta que el componente esté listo.

- **Ejemplo**

  ```css
  [v-cloak] {
    display: none;
  }
  ```

  ```vue-html
  <div v-cloak>
    {{ message }}
  </div>
  ```

  El `<div>` no será visible hasta que la compilación haya finalizado.