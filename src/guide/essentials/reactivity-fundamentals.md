---
outline: deep
---

# Fundamentos de Reactividad {#reactivity-fundamentals}

:::tip Preferencia de API
Esta página y muchos otros capítulos posteriores de la guía contienen contenido diferente para la Options API y la Composition API. Tu preferencia actual es <span class="options-api">Options API</span><span class="composition-api">Composition API</span>. Puedes alternar entre los estilos de API usando los selectores de "Preferencia de API" en la parte superior de la barra lateral izquierda.
:::

<div class="options-api">

## Declarando el Estado Reactivo \* {#declaring-reactive-state}

Con la Options API, usamos la opción `data` para declarar el estado reactivo de un componente. El valor de la opción debe ser una función que retorne un objeto. Vue llamará a la función al crear una nueva instancia de componente y envolverá el objeto retornado en su sistema de reactividad. Cualquier propiedad de nivel superior de este objeto es proxy en la instancia del componente (`this` en métodos y hooks de ciclo de vida):

```js{2-6}
export default {
  data() {
    return {
      count: 1
    }
  },

  // `mounted` es un hook del ciclo de vida que se explicará después
  mounted() {
    // `this` se refiere a la instancia del componente.
    console.log(this.count) // => 1

    // los datos también pueden mutarse
    this.count = 2
  }
}
```

[Pruébalo en el Playground](https://play.vuejs.org/#eNpFUNFqhDAQ/JXBpzsoHu2j3B2U/oYPpnGtoetGkrW2iP/eRFsPApthd2Zndilex7H8mqioimu0wY16r4W+Rx8ULXVmYsVSC9AaNafz/gcC6RTkHwHWT6IVnne85rI+1ZLr5YJmyG1qG7gIA3Yd2R/LhN77T8y9sz1mwuyYkXazcQI2SiHz/7iP3VlQexeb5KKjEKEe2lPyMIxeSBROohqxVO4E6yV6ppL9xykTy83tOQvd7tnzoZtDwhrBO2GYNFloYWLyxrzPPOi44WWLWUt618txvASUhhRCKSHgbZt2scKy7HfCujGOqWL9BVfOgyI=)

Estas propiedades de instancia solo se añaden cuando la instancia es creada por primera vez, por lo que debes asegurarte de que todas estén presentes en el objeto retornado por la función `data`. Donde sea necesario, usa `null`, `undefined` o algún otro valor de marcador de posición para las propiedades donde el valor deseado aún no esté disponible.

Es posible añadir una nueva propiedad directamente a `this` sin incluirla en `data`. Sin embargo, las propiedades añadidas de esta manera no podrán activar actualizaciones reactivas.

Vue utiliza un prefijo `$` al exponer sus propias APIs integradas a través de la instancia del componente. También reserva el prefijo `_` para propiedades internas. Debes evitar usar nombres para las propiedades `data` de nivel superior que comiencen con cualquiera de estos caracteres.

### Proxy Reactivo vs. Original \* {#reactive-proxy-vs-original}

En Vue 3, los datos se vuelven reactivos aprovechando los [Proxies de JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy). Los usuarios que vienen de Vue 2 deben ser conscientes del siguiente caso particular:

```js
export default {
  data() {
    return {
      someObject: {}
    }
  },
  mounted() {
    const newObject = {}
    this.someObject = newObject

    console.log(newObject === this.someObject) // false
  }
}
```

Cuando accedes a `this.someObject` después de asignarlo, el valor es un proxy reactivo del `newObject` original. **A diferencia de Vue 2, el `newObject` original se mantiene intacto y no se volverá reactivo: asegúrate de acceder siempre al estado reactivo como una propiedad de `this`.**

</div>

<div class="composition-api">

## Declarando el Estado Reactivo \*\* {#declaring-reactive-state-1}

### `ref()` \*\* {#ref}

En la Composition API, la forma recomendada de declarar el estado reactivo es usando la función [`ref()`](/api/reactivity-core#ref):

```js
import { ref } from 'vue'

const count = ref(0)
```

`ref()` toma el argumento y lo retorna envuelto dentro de un objeto ref con una propiedad `.value`:

```js
const count = ref(0)

console.log(count) // { value: 0 }
console.log(count.value) // 0

count.value++
console.log(count.value) // 1
```

> Ver también: [Tipado de Refs](/guide/typescript/composition-api#typing-ref) <sup class="vt-badge ts" />

Para acceder a las refs en el template de un componente, decláralas y retórnalas desde la función `setup()` del componente:

```js{5,9-11}
import { ref } from 'vue'

export default {
  // `setup` es un hook especial dedicado para la Composition API.
  setup() {
    const count = ref(0)

    // expone el ref al template
    return {
      count
    }
  }
}
```

```vue-html
<div>{{ count }}</div>
```

Observa que **no** necesitamos añadir `.value` al usar la ref en el template. Por comodidad, las refs se desenvuelven automáticamente cuando se usan dentro de templates (con algunas [advertencias](#caveat-when-unwrapping-in-templates)).

También puedes mutar una ref directamente en los manejadores de eventos:

```vue-html{1}
<button @click="count++">
  {{ count }}
</button>
```

Para una lógica más compleja, podemos declarar funciones que mutan refs en el mismo ámbito y exponerlas como métodos junto con el estado:

```js{7-10,15}
import { ref } from 'vue'

export default {
  setup() {
    const count = ref(0)

    function increment() {
      // .value es necesario en JavaScript
      count.value++
    }

    // no olvides exponer también la función.
    return {
      count,
      increment
    }
  }
}
```

Los métodos expuestos pueden luego usarse como manejadores de eventos:

```vue-html{1}
<button @click="increment">
  {{ count }}
</button>
```

Aquí tienes el ejemplo en vivo en [Codepen](https://codepen.io/vuejs-examples/pen/WNYbaqo), sin usar ninguna herramienta de compilación.

### `<script setup>` \*\* {#script-setup}

Exponer manualmente el estado y los métodos a través de `setup()` puede ser tedioso. Afortunadamente, se puede evitar al usar [Componentes de Archivo Único (SFCs)](/guide/scaling-up/sfc). Podemos simplificar el uso con `<script setup>`:

```vue{1}
<script setup>
import { ref } from 'vue'

const count = ref(0)

function increment() {
  count.value++
}
</script>

<template>
  <button @click="increment">
    {{ count }}
  </button>
</template>
```

[Pruébalo en el Playground](https://play.vuejs.org/#eNo9jUEKgzAQRa8yZKMiaNcllvYe2dgwQqiZhDhxE3L3jrW4/DPvv1/UK8Zhz6juSm82uciwIef4MOR8DImhQMIFKiwpeGgEbQwZsoE2BhsyMUwH0d66475ksuwCgSOb0CNx20ExBCc77POas...=)

Las importaciones de nivel superior, variables y funciones declaradas en `<script setup>` son automáticamente utilizables en el template del mismo componente. Piensa en el template como una función de JavaScript declarada en el mismo ámbito: naturalmente tiene acceso a todo lo declarado junto a ella.

:::tip
Para el resto de la guía, utilizaremos principalmente la sintaxis SFC + `<script setup>` para los ejemplos de código de la Composition API, ya que es el uso más común para los desarrolladores de Vue.

Si no estás utilizando SFC, aún puedes usar la Composition API con la opción [`setup()`](/api/composition-api-setup).
:::

### ¿Por qué Refs? \*\* {#why-refs}

Puede que te estés preguntando por qué necesitamos refs con el `.value` en lugar de variables simples. Para explicar eso, tendremos que discutir brevemente cómo funciona el sistema de reactividad de Vue.

Cuando usas una ref en un template, y cambias el valor de la ref más tarde, Vue detecta automáticamente el cambio y actualiza el DOM en consecuencia. Esto es posible gracias a un sistema de reactividad basado en el seguimiento de dependencias. Cuando un componente se renderiza por primera vez, Vue **rastrea** cada ref que se usó durante la renderización. Más tarde, cuando una ref es mutada, **activará** una nueva renderización para los componentes que la están rastreando.

En JavaScript estándar, no hay forma de detectar el acceso o la mutación de variables simples. Sin embargo, podemos interceptar las operaciones de obtención y establecimiento de las propiedades de un objeto usando métodos getter y setter.

La propiedad `.value` le da a Vue la oportunidad de detectar cuándo se ha accedido o mutado a una ref. Internamente, Vue realiza el seguimiento en su getter y la activación en su setter. Conceptualmente, puedes pensar en una ref como un objeto que se ve así:

```js
// pseudocódigo, no implementación real
const myRef = {
  _value: 0,
  get value() {
    track()
    return this._value
  },
  set value(newValue) {
    this._value = newValue
    trigger()
  }
}
```

Otra característica interesante de las refs es que, a diferencia de las variables simples, puedes pasar refs a funciones mientras mantienes el acceso al último valor y la conexión de reactividad. Esto es particularmente útil al refactorizar lógica compleja en código reutilizable.

El sistema de reactividad se discute con más detalle en la sección [Reactividad en Profundidad](/guide/extras/reactivity-in-depth).

</div>

<div class="options-api">

## Declarando Métodos \* {#declaring-methods}

<VueSchoolLink href="https://vueschool.io/lessons/methods-in-vue-3" title="Lección Gratuita de Métodos de Vue.js"/>

Para añadir métodos a una instancia de componente usamos la opción `methods`. Esto debe ser un objeto que contenga los métodos deseados:

```js{7-11}
export default {
  data() {
    return {
      count: 0
    }
  },
  methods: {
    increment() {
      this.count++
    }
  },
  mounted() {
    // methods pueden llamarse en los hooks del ciclo de vida o en otros métodos
    this.increment()
  }
}
```

Vue vincula automáticamente el valor `this` para los `methods` para que siempre se refiera a la instancia del componente. Esto asegura que un método retenga el valor `this` correcto si se usa como un listener de eventos o un callback. Debes evitar usar funciones flecha al definir `methods`, ya que eso impide que Vue vincule el valor `this` apropiado:

```js
export default {
  methods: {
    increment: () => {
      // MAL: ¡no hay acceso a `this` aquí!
    }
  }
}
```

Al igual que todas las demás propiedades de la instancia del componente, los `methods` son accesibles desde dentro del template del componente. Dentro de un template se usan más comúnmente como listeners de eventos:

```vue-html
<button @click="increment">{{ count }}</button>
```

[Pruébalo en el Playground](https://play.vuejs.org/#eNplj9EKwyAMRX8l+LSx0e65uLL9hy+dZlTWqtg4BuK/z1baDgZicsPJgUR2d656B2QN45P02lErDH6c9QQKn10YCKIwAKqj7nAsPYBHCt6sCUDaYKiBS8lpLuk8/yNSb9XUrKg20uOIhnYXAPV6qhbF6fRvmOeodn6hfzwLKkx+vN5OyIFwdENHmBMAfwQia+AmBy1fV8E2gWBtjOUASInXBcxLvN4MLH0BCe1i4Q==)

En el ejemplo anterior, el método `increment` será llamado cuando se haga clic en el `<button>`.

</div>

### Reactividad Profunda {#deep-reactivity}

<div class="options-api">

En Vue, el estado es profundamente reactivo por defecto. Esto significa que puedes esperar que los cambios sean detectados incluso cuando mutas objetos o arrays anidados:

```js
export default {
  data() {
    return {
      obj: {
        nested: { count: 0 },
        arr: ['foo', 'bar']
      }
    }
  },
  methods: {
    mutateDeeply() {
      // funcionarán como se espera.
      this.obj.nested.count++
      this.obj.arr.push('baz')
    }
  }
}
```

</div>

<div class="composition-api">

Las Refs pueden contener cualquier tipo de valor, incluyendo objetos profundamente anidados, arrays, o estructuras de datos incorporadas de JavaScript como `Map`.

Una ref hará que su valor sea profundamente reactivo. Esto significa que puedes esperar que los cambios sean detectados incluso cuando mutas objetos o arrays anidados:

```js
import { ref } from 'vue'

const obj = ref({
  nested: { count: 0 },
  arr: ['foo', 'bar']
})

function mutateDeeply() {
  // funcionarán como se espera.
  obj.value.nested.count++
  obj.value.arr.push('baz')
}
```

Los valores no primitivos se convierten en proxies reactivos a través de [`reactive()`](#reactive), lo cual se discute a continuación.

También es posible optar por no usar la reactividad profunda con [shallow refs](/api/reactivity-advanced#shallowref). Para las shallow refs, solo el acceso a `.value` se rastrea para la reactividad. Las shallow refs pueden usarse para optimizar el rendimiento evitando el costo de observación de objetos grandes, o en casos donde el estado interno es gestionado por una librería externa.

Lectura adicional:

- [Reducir la Sobrecarga de Reactividad para Estructuras Inmutables Grandes](/guide/best-practices/performance#reduce-reactivity-overhead-for-large-immutable-structures)
- [Integración con Sistemas de Estado Externos](/guide/extras/reactivity-in-depth#integration-with-external-state-systems)

</div>

### Momento de Actualización del DOM {#dom-update-timing}

Cuando mutas el estado reactivo, el DOM se actualiza automáticamente. Sin embargo, debe tenerse en cuenta que las actualizaciones del DOM no se aplican de forma síncrona. En su lugar, Vue las almacena en un búfer hasta la "siguiente iteración" (next tick) en el ciclo de actualización para asegurar que cada componente se actualice solo una vez, sin importar cuántos cambios de estado hayas realizado.

Para esperar a que la actualización del DOM se complete después de un cambio de estado, puedes usar la API global [nextTick()](/api/general#nexttick):

<div class="composition-api">

```js
import { nextTick } from 'vue'

async function increment() {
  count.value++
  await nextTick()
  // Ahora el DOM está actualizado
}
```

</div>
<div class="options-api">

```js
import { nextTick } from 'vue'

export default {
  methods: {
    async increment() {
      this.count++
      await nextTick()
      // Ahora el DOM está actualizado
    }
  }
}
```

</div>

<div class="composition-api">

## `reactive()` \*\* {#reactive}

Hay otra forma de declarar el estado reactivo, con la API `reactive()`. A diferencia de una ref que envuelve el valor interno en un objeto especial, `reactive()` hace que un objeto sea reactivo en sí mismo:

```js
import { reactive } from 'vue'

const state = reactive({ count: 0 })
```

> Ver también: [Tipado de Reactive](/guide/typescript/composition-api#typing-reactive) <sup class="vt-badge ts" />

Uso en template:

```vue-html
<button @click="state.count++">
  {{ state.count }}
</button>
```

Los objetos reactivos son [Proxies de JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) y se comportan como objetos normales. La diferencia es que Vue es capaz de interceptar el acceso y la mutación de todas las propiedades de un objeto reactivo para el seguimiento y la activación de la reactividad.

`reactive()` convierte el objeto profundamente: los objetos anidados también se envuelven con `reactive()` cuando se accede a ellos. También es llamada por `ref()` internamente cuando el valor de la ref es un objeto. Similar a las shallow refs, también existe la API [`shallowReactive()`](/api/reactivity-advanced#shallowreactive) para optar por no usar la reactividad profunda.

### Proxy Reactivo vs. Original \*\* {#reactive-proxy-vs-original-1}

Es importante notar que el valor retornado de `reactive()` es un [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) del objeto original, que no es igual al objeto original:

```js
const raw = {}
const proxy = reactive(raw)

// el proxy NO es igual al original.
console.log(proxy === raw) // false
```

Solo el proxy es reactivo - mutar el objeto original no activará actualizaciones. Por lo tanto, la mejor práctica al trabajar con el sistema de reactividad de Vue es **usar exclusivamente las versiones proxy de tu estado**.

Para asegurar un acceso consistente al proxy, llamar a `reactive()` sobre el mismo objeto siempre retorna el mismo proxy, y llamar a `reactive()` sobre un proxy existente también retorna ese mismo proxy:

```js
// llamar a reactive() sobre un mismo objeto retorna el mismo proxy
console.log(reactive(raw) === proxy) // true

// llamar a reactive() sobre un proxy lo retorna a sí mismo
console.log(reactive(proxy) === proxy) // true
```

Esta regla también se aplica a los objetos anidados. Debido a la reactividad profunda, los objetos anidados dentro de un objeto reactivo también son proxies:

```js
const proxy = reactive({})

const raw = {}
proxy.nested = raw

console.log(proxy.nested === raw) // false
```

### Limitaciones de `reactive()` \*\* {#limitations-of-reactive}

La API `reactive()` tiene algunas limitaciones:

1.  **Tipos de valor limitados:** solo funciona para tipos de objeto (objetos, arrays y [tipos de colección](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects#keyed_collections) como `Map` y `Set`). No puede contener [tipos primitivos](https://developer.mozilla.org/en-US/docs/Glossary/Primitive) como `string`, `number` o `boolean`.

2.  **No se puede reemplazar el objeto completo:** dado que el seguimiento de reactividad de Vue funciona sobre el acceso a propiedades, siempre debemos mantener la misma referencia al objeto reactivo. Esto significa que no podemos "reemplazar" fácilmente un objeto reactivo porque la conexión de reactividad con la primera referencia se pierde:

    ```js
    let state = reactive({ count: 0 })

    // la referencia anterior ({ count: 0 }) ya no se rastrea
    // (¡se ha perdido la conexión de reactividad!)
    state = reactive({ count: 1 })
    ```

3.  **No es amigable con la desestructuración:** cuando desestructuramos la propiedad de tipo primitivo de un objeto reactivo en variables locales, o cuando pasamos esa propiedad a una función, perderemos la conexión de reactividad:

    ```js
    const state = reactive({ count: 0 })

    // count se desconecta de state.count cuando se desestructura.
    let { count } = state
    // no afecta el estado original
    count++

    // La función recibe un número simple y no
    // podrá rastrear los cambios en state.count.
    // Tenemos que pasar el objeto completo para mantener la reactividad.
    callSomeFunction(state.count)
    ```

Debido a estas limitaciones, recomendamos usar `ref()` como la API principal para declarar el estado reactivo.

## Detalles Adicionales del Desenvolvimiento de Refs \*\* {#additional-ref-unwrapping-details}

### Como Propiedad de Objeto Reactivo \*\* {#ref-unwrapping-as-reactive-object-property}

Una ref se desenvuelve automáticamente cuando se accede o se muta como una propiedad de un objeto reactivo. En otras palabras, se comporta como una propiedad normal:

```js
const count = ref(0)
const state = reactive({
  count
})

console.log(state.count) // 0

state.count = 1
console.log(count.value) // 1
```

Si una nueva ref se asigna a una propiedad vinculada a una ref existente, reemplazará a la ref antigua:

```js
const otherCount = ref(2)

state.count = otherCount
console.log(state.count) // 2
// la ref original ahora está desconectada de state.count
console.log(count.value) // 1
```

El desenvolvimiento de refs solo ocurre cuando está anidado dentro de un objeto reactivo profundo. No se aplica cuando se accede como una propiedad de un [objeto reactivo superficial](/api/reactivity-advanced#shallowreactive).

### Advertencia en Arrays y Colecciones \*\* {#caveat-in-arrays-and-collections}

A diferencia de los objetos reactivos, **no** se realiza ningún desenvolvimiento cuando se accede a la ref como un elemento de un array reactivo o un tipo de colección nativo como `Map`:

```js
const books = reactive([ref('Vue 3 Guide')])
// necesita .value aquí
console.log(books[0].value)

const map = reactive(new Map([['count', ref(0)]]))
// necesita .value aquí
console.log(map.get('count').value)
```

### Advertencia al Desenvolver en Plantillas \*\* {#caveat-when-unwrapping-in-templates}

El desenvolvimiento de refs en templates solo se aplica si la ref es una propiedad de nivel superior en el contexto de renderizado del template.

En el ejemplo siguiente, `count` y `object` son propiedades de nivel superior, pero `object.id` no lo es:

```js
const count = ref(0)
const object = { id: ref(1) }
```

Por lo tanto, esta expresión funciona como se espera:

```vue-html
{{ count + 1 }}
```

...mientras que esta **NO** lo hace:

```vue-html
{{ object.id + 1 }}
```

El resultado renderizado será `[object Object]1` porque `object.id` no se desenvuelve al evaluar la expresión y permanece como un objeto ref. Para solucionar esto, podemos desestructurar `id` en una propiedad de nivel superior:

```js
const { id } = object
```

```vue-html
{{ id + 1 }}
```

Ahora el resultado renderizado será `2`.

Otra cosa a tener en cuenta es que una ref sí se desenvuelve si es el valor final evaluado de una interpolación de texto (es decir, una etiqueta <code v-pre>{{ }}</code>), por lo que lo siguiente renderizará `1`:

```vue-html
{{ object.id }}
```

Esto es solo una característica de conveniencia de la interpolación de texto y es equivalente a <code v-pre>{{ object.id.value }}</code>.

</div>

<div class="options-api">

### Métodos con Estado \* {#stateful-methods}

En algunos casos, puede que necesitemos crear dinámicamente una función de método, por ejemplo, creando un manejador de eventos "debounced":

```js
import { debounce } from 'lodash-es'

export default {
  methods: {
    // Limitación de eventos con Lodash
    click: debounce(function () {
      // ... respuesta al clic ...
    }, 500)
  }
}
```

Sin embargo, este enfoque es problemático para componentes que se reutilizan porque una función "debounced" tiene **estado**: mantiene un estado interno sobre el tiempo transcurrido. Si múltiples instancias de componente comparten la misma función "debounced", interferirán entre sí.

Para mantener la función "debounced" de cada instancia de componente independiente de las demás, podemos crear la versión "debounced" en el hook de ciclo de vida `created`:

```js
export default {
  created() {
    // ahora cada instancia tiene su propia copia del gestor debounced
    this.debouncedClick = _.debounce(this.click, 500)
  },
  unmounted() {
    // también es buena idea cancelar el temporizador
    // cuando se elimina el componente
    this.debouncedClick.cancel()
  },
  methods: {
    click() {
      // ... respuesta al clic ...
    }
  }
}
```

</div>
