# Renderizado Declarativo {#declarative-rendering}

<div class="sfc">

Lo que ves en el editor es un Componente de Archivo Único (SFC) de Vue. Un SFC es un bloque de código reutilizable y autocontenido que encapsula HTML, CSS y JavaScript que pertenecen juntos, escrito dentro de un archivo `.vue`.

</div>

La característica principal de Vue es el **renderizado declarativo**: usando una sintaxis de plantilla que extiende HTML, podemos describir cómo debe verse el HTML basándose en el estado de JavaScript. Cuando el estado cambia, el HTML se actualiza automáticamente.

<div class="composition-api">

El estado que puede activar actualizaciones cuando cambia se considera **reactivo**. Podemos declarar estado reactivo usando la API `reactive()` de Vue. Los objetos creados a partir de `reactive()` son [Proxies](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) de JavaScript que funcionan como objetos normales:

```js
import { reactive } from 'vue'

const counter = reactive({
  count: 0
})

console.log(counter.count) // 0
counter.count++
```

`reactive()` solo funciona en objetos (incluyendo arrays y tipos incorporados como `Map` y `Set`). `ref()`, por otro lado, puede tomar cualquier tipo de valor y crear un objeto que expone el valor interno bajo una propiedad `.value`:

```js
import { ref } from 'vue'

const message = ref('Hello World!')

console.log(message.value) // "Hello World!"
message.value = 'Changed'
```

Los detalles sobre `reactive()` y `ref()` se discuten en <a target="_blank" href="/guide/essentials/reactivity-fundamentals.html">Guía - Fundamentos de Reactividad</a>.

<div class="sfc">

El estado reactivo declarado en el bloque `<script setup>` del componente se puede usar directamente en la plantilla. Así es como podemos renderizar texto dinámico basándonos en el valor del objeto `counter` y la `ref` `message`, usando la sintaxis de bigotes:

</div>

<div class="html">

El objeto que se pasa a `createApp()` es un componente de Vue. El estado de un componente debe declararse dentro de su función `setup()`, y devolverse usando un objeto:

```js{2,5}
setup() {
  const counter = reactive({ count: 0 })
  const message = ref('Hello World!')
  return {
    counter,
    message
  }
}
```

Las propiedades en el objeto devuelto estarán disponibles en la plantilla. Así es como podemos renderizar texto dinámico basándonos en el valor de `message`, usando la sintaxis de bigotes:

</div>

```vue-html
<h1>{{ message }}</h1>
<p>Count is: {{ counter.count }}</p>
```

Observa cómo no necesitamos usar `.value` al acceder a la `ref` `message` en las plantillas: se desenvuelve automáticamente para un uso más conciso.

</div>

<div class="options-api">

El estado que puede activar actualizaciones cuando cambia se considera **reactivo**. En Vue, el estado reactivo se mantiene en los componentes. <span class="html">En el código de ejemplo, el objeto que se pasa a `createApp()` es un componente.</span>

Podemos declarar estado reactivo usando la opción `data` del componente, que debe ser una función que devuelve un objeto:

<div class="sfc">

```js{3-5}
export default {
  data() {
    return {
      message: 'Hello World!'
    }
  }
}
```

</div>
<div class="html">

```js{3-5}
createApp({
  data() {
    return {
      message: 'Hello World!'
    }
  }
})
```

</div>

La propiedad `message` estará disponible en la plantilla. Así es como podemos renderizar texto dinámico basándonos en el valor de `message`, usando la sintaxis de bigotes:

```vue-html
<h1>{{ message }}</h1>
```

</div>

El contenido dentro de los bigotes no se limita solo a identificadores o rutas; podemos usar cualquier expresión de JavaScript válida:

```vue-html
<h1>{{ message.split('').reverse().join('') }}</h1>
```

<div class="composition-api">

Ahora, intenta crear un estado reactivo tú mismo y úsalo para renderizar contenido de texto dinámico para el `<h1>` en la plantilla.

</div>

<div class="options-api">

Ahora, intenta crear una propiedad `data` tú mismo y úsala como contenido de texto para el `<h1>` en la plantilla.

</div>