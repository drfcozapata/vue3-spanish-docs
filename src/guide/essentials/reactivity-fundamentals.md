---
outline: deep
---

# Fundamentos de Reactividad {#reactivity-fundamentals}

:::tip Preferencias de API
Esta página y muchos otros capítulos posteriores en la guía tienen contenido diferente para la Options API y la Composition API. Tu preferencia actual es <span class="options-api">Options API</span><span class="composition-api">Composition API</span>. Puedes alternar entre los estilos de API usando el interruptor de "Preferencia de API" en la parte superior de la barra lateral izquierda.
:::

<div class="options-api">

## Declarando el Estado Reactivo \* {#declaring-reactive-state}

Con la Options API, usamos la opción `data` para declarar el estado reactivo de un componente. El valor de la opción debe ser una función que retorne un objeto. Vue llamará a la función al crear una nueva instancia del componente y empaquetará el objeto devuelto en su sistema de reactividad. Cualquier propiedad de nivel superior de este objeto se representa en la instancia del componente (`this` en los métodos y hooks del ciclo de vida):

```js{2-6}
export default {
  data() {
    return {
      count: 1
    }
  },

  // `mounted` es un hook del ciclo de vida que explicaremos luego
  mounted() {
    // `this` se refiere a la instancia del componente.
    console.log(this.count) // => 1

    // los datos también pueden ser mutados
    this.count = 2
  }
}
```

[Pruébalo en la Zona de Práctica](https://play.vuejs.org/#eNpFUNFqhDAQ/JXBpzsoHu2j3B2U/oYPpnGtoetGkrW2iP/eRFsPApthd2Zndilex7H8mqioimu0wY16r4W+Rx8ULXVmYsVSC9AaNafz/gcC6RTkHwHWT6IVnne85rI+1ZLr5YJmyG1qG7gIA3Yd2R/LhN77T8y9sz1mwuyYkXazcQI2SiHz/7iP3VlQexeb5KKjEKEe2lPyMIxeSBROohqxVO4E6yV6ppL9xykTy83tOQvd7tnzoZtDwhrBO2GYNFloYWLyxrzPPOi44WWLWUt618txvASUhhRCKSHgbZt2scKy7HfCujGOqWL9BVfOgyI=)

Estas propiedades de la instancia solo se agregan cuando la instancia se crea por primera vez, por lo que debes asegurarte de que estén todas presentes en el objeto retornado por la función `data`. Cuando sea necesario, usa `null`, `undefined` o algún otro valor indicador para las propiedades donde el valor deseado aún no está disponible.

Es posible agregar una nueva propiedad directamente al `this` sin incluirla en `data`. Sin embargo, las propiedades agregadas de esta manera no serán capaces de desencadenar actualizaciones reactivas.

Vue usa el prefijo `$` cuando expone sus propias APIs integradas a través de la instancia del componente. También reserva el prefijo `_` para propiedades internas. Debes evitar el uso de nombres para las propiedades de nivel superior de `data` que comiencen con cualquiera de estos caracteres.

### Proxy Reactivo vs. Original \* {#reactive-proxy-vs-original}

En Vue 3, los datos se vuelven reactivos al aprovechar los [Proxies de JavaScript](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Proxy). Los usuarios que vienen de Vue 2 deben tener en cuenta el siguiente caso extremo:

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

Cuando accedes a `this.someObject` después de asignarlo, el valor es un proxy reactivo del `newObject` original. **A diferencia de Vue 2, el `newObject` original se deja intacto y no se volverá reactivo: asegúrate de acceder siempre al estado reactivo como una propiedad de `this`.**

</div>

<div class="composition-api">

## Declarando el Estado Reactivo \*\* {#declaring-reactive-state-1}

### `ref()` \*\* {#ref}

En la Composition API, la manera recomendada de declarar el estado reactivo es utilizando la función [`ref()`](/api/reactivity-core#ref):

```js
import { ref } from 'vue'

const count = ref(0)
```

`ref()` toma el argumento y lo retorna envuelto en un objeto ref con una propiedad `.value`:

```js
const count = ref(0)

console.log(count) // { value: 0 }
console.log(count.value) // 0

count.value++
console.log(count.value) // 1
```

> Mira también: [Escribir Refs](/guide/typescript/composition-api#typing-ref) <sup class="vt-badge ts" />

Para acceder a las refs en la template de un componente, las declaramos y retornamos desde una función `setup()` del componente:

```js{5,9-11}
import { ref } from 'vue'

export default {
  // `setup` es un hook especial dedicado para la Composition API.
  setup() {
    const count = ref(0)

    // expone la ref a la template
    return {
      count
    }
  }
}
```

```vue-html
<div>{{ count }}</div>
```

Observa que **no** necesitamos agregar `.value` cuando usamos la ref en la template. Por conveniencia, las refs son automáticamente desempaquetadas cuando son usadas dentro de las templates (con unas pocas [advertencias](#caveat-when-unwrapping-in-templates)).

También puedes mutar una ref directamente en los manejadores de eventos:

```vue-html{1}
<button @click="count++">
  {{ count }}
</button>
```

Para lógica más compleja, podemos declarar funciones que muten las refs en el mismo ámbito y las expongan como métodos al lado del estado:

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

Los métodos expuestos pueden ser usados entonces como manejadores de eventos:

```vue-html{1}
<button @click="increment">
  {{ count }}
</button>
```

Aquí está el ejemplo interactivo en [Codepen](https://codepen.io/vuejs-examples/pen/WNYbaqo), sin usar ninguna herramienta de construcción.

### `<script setup>` \*\* {#script-setup}

Exponer manualmente el estado y los métodos a través de `setup()` puede ser engorroso. Por suerte, se puede evitar cuando se utilizan [Componentes de un Solo Archivo (SFCs)](/guide/scaling-up/sfc). Podemos simplificar el uso con `<script setup>`:

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

[Pruébalo en la Zona de Práctica](https://play.vuejs.org/#eNo9jUEKgzAQRa8yZKMiaNcllvYe2dgwQqiZhDhxE3L3jrW4/DPvv1/UK8Zhz6juSm82uciwIef4MOR8DImhQMIFKiwpeGgEbQwZsoE2BhsyMUwH0d66475ksuwCgSOb0CNx20ExBCc77POase8NVUN6PBdlSwKjj+vMKAlAvzOzWJ52dfYzGXXpjPoBAKX856uopDGeFfnq8XKp+gWq4FAi)

Las importaciones de nivel superior y las funciones declaradas en el `<script setup>` son automáticamente usables en la template del mismo componente. Piensa en la template como una función de JavaScript declared en el mismo ámbito; naturalmente tiene acceso a todo lo que se declare junto a ella .

:::tip
Por el resto de la guía, utilizaremos principalmente la sintaxis SFC + `<script setup>` para los ejemplos de código de l a Composition API, ya que ese es el uso más común para los desarrolladores de Vue.

Si no utilizas SFC, puedes seguir utilizando Composition API con la opción [`setup()`](/api/composition-api-setup).
:::

### ¿Por qué Refs? \*\* {#why-refs}

Puede que te estés preguntando por qué necesitamos refs con el `.value` en lugar de variables planas. Para explicarlo, necesitaremos discutir brevemente cómo funciona el sistema de reactividad de Vue.

Cuando usas una ref en una template, y cambias el valor de la ref más tarde, Vue detecta automáticamente el cambio y actualiza el DOM en consecuencia. Esto es posible gracias a un sistema de reactividad basado en el seguimiento de dependencias. Cuando un componente se renderiza por primera vez, Vue **rastrea** cada referencia que se utilizó durante la renderización. Más tarde, cuando una referencia es mutada, esto **disparará** una nueva renderización para los componentes que la están rastreando.

En JavaScript estándar, no hay forma de detectar el acceso o mutación de variables planas. Sin embargo, podemos interceptar las operaciones get y set de las propiedades de un objeto utilizando métodos getter y setter.

La propiedad `.value` le da a Vue la oportunidad de detectar cuando una ref ha sido accedida o mutada. Debajo del capó, Vue realiza el seguimiento en su getter, y realiza la activación en su setter. Conceptualmente, puedes pensar en una ref como un objeto que se parece a esto:

```js
// pseudo código, no aplicación real
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

Otra característica interesante de las refs es que, a diferencia de las variables planas, puedes pasar refs a funciones manteniendo el acceso al último valor y la conexión de reactividad. Esto es particularmente útil cuando se refactoriza lógica compleja en código reutilizable.

El sistema de reactividad se trata con más detalle en la sección [Reactividad en Profundidad](/guide/extras/reactivity-in-depth).

</div>

<div class="options-api">

## Declarar Métodos \* {#declaring-methods}

<VueSchoolLink href="https://vueschool.io/lessons/methods-in-vue-3" title="Lección gratuita de Métodos de Vue.js"/>

Para agregar métodos a la instancia de un componente, usamos la opción `methods`. Ésta debería ser un objeto que contenga los métodos deseados:

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
    // ¡los métodos pueden ser llamados en los hooks del ciclo de vida u otros métodos!
    this.increment()
  }
}
```

Vue vincula automáticamente el valor `this` para los `methods` para que siempre se refiera a la instancia del componente. Esto asegura que un método conserve el valor `this` correcto si se usa como escuchador de eventos o callback. Deberías evitar el uso de funciones de flecha al definir `methods`, ya que eso evita que Vue vincule el valor `this` apropiado:

```js
export default {
  methods: {
    increment: () => {
      // MAL: ¡no hay acceso a `this` aquí!
    }
  }
}
```

Al igual que el resto de propiedades de la instancia del componente, los `methods` son accesibles desde la template del componente. Dentro de una template se utilizan normalmente como escuchadores de eventos:

```vue-html
<button @click="increment">{{ count }}</button>
```

[Pruébalo en la Zona de Práctica](https://play.vuejs.org/#eNplj9EKwyAMRX8l+LSx0e65uLL9hy+dZlTWqtg4BuK/z1baDgZicsPJgUR2d656B2QN45P02lErDH6c9QQKn10YCKIwAKqj7nAsPYBHCt6sCUDaYKiBS8lpLuk8/yNSb9XUrKg20uOIhnYXAPV6qhbF6fRvmOeodn6hfzwLKkx+vN5OyIFwdENHmBMAfwQia+AmBy1fV8E2gWBtjOUASInXBcxLvN4MLH0BCe1i4Q==)

En el ejemplo anterior, se llamará al método `increment` cuando se haga clic en `<button>`.

</div>

### Reactividad Profunda {#deep-reactivity}

<div class="options-api">

En Vue, el estado es profundamente reactivo por defecto. Esto significa que puedes esperar que los cambios se detecten incluso cuando mutes objetos o arrays anidados:

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
      // esto trabajarña como se espera.
      this.obj.nested.count++
      this.obj.arr.push('baz')
    }
  }
}
```

</div>

<div class="composition-api">

Las refs pueden contener cualquier tipo de valor, incluyendo objetos profundamente anidados, arrays o estructuras de datos integradas en JavaScript como `Map`.

Una ref hará que su valor sea profundamente reactivo. Esto significa que puedes esperar que los cambios sean detectados incluso cuando mutes objetos o arrays anidados:

```js
import { ref } from 'vue'

const obj = ref({
  nested: { count: 0 },
  arr: ['foo', 'bar']
})

function mutateDeeply() {
  // esto trabajarña como se espera.
  obj.value.nested.count++
  obj.value.arr.push('baz')
}
```

Los valores no primitivos se convierten en proxies reactivos mediante [`reactive()`](#reactive), que se explica más adelante.

También es posible excluir la reactividad profunda con [shallow refs](/api/reactivity-advanced#shallowref). En el caso de shallow refs, sólo se rastrea el acceso a `.value` para la reactividad. Las shallow refs pueden utilizarse para optimizar el rendimiento evitando el coste de observación de objetos grandes, o en casos en los que el estado interno es gestionado por una biblioteca externa.

Lecturas adicionales:

- [Reducir la Sobrecarga de Reactividad para Grandes Estructuras Inmutables](/guide/best-practices/performance#reduce-reactivity-overhead-for-large-immutable-structures)
- [Integración con Sistemas de Estado Externos](/guide/extras/reactivity-in-depth#integration-with-external-state-systems)

</div>

### Tiempo de Actualización del DOM {#dom-update-timing}

Cuando mutas el estado reactivo, el DOM se actualiza automáticamente. Sin embargo, se debería tener en cuenta que las actualizaciones del DOM no se aplican de forma sincrónica. En su lugar, Vue las almacena en búfer hasta la "siguiente marca" (next tick) del ciclo de actualización para garantizar que cada componente se actualice sólo una vez, independientemente de cuántos cambios de estado hayas realizado.

Para esperar a que se complete la actualización del DOM después de un cambio de estado, puedes usar la API global [nextTick()](/api/general#nexttick):

<div class="composition-api">

```js
import { nextTick } from 'vue'

async function increment() {
  count.value++
  await nextTick()
  // Ahora se actualiza el DOM
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
      // Ahora se actualiza el DOM
    }
  }
}
```

</div>

<div class="composition-api">

## `reactive()` \*\* {#reactive}

Hay otra forma de declarar el estado reactivo, con la API `reactive()`. A diferencia de una ref que envuelve el valor interno en un objeto especial, `reactive()` hace que un objeto en sí mismo sea reactivo:

```js
import { reactive } from 'vue'

const state = reactive({ count: 0 })
```

> Consulta también: [Escribir Reactive](/guide/typescript/composition-api#typing-reactive) <sup class="vt-badge ts" />

Uso en la template:

```vue-html
<button @click="state.count++">
  {{ state.count }}
</button>
```

Los objetos reactivos son [Proxies de JavaScript](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Proxy) y se comportan como objetos normales. La diferencia es que Vue es capaz de interceptar el acceso y la mutación de de un objeto reactivo para el seguimiento y la activación de la reactividad.

`reactive()` convierte el objeto en profundidad: los objetos anidados también son empaquetados con `reactive()` cuando se accede a ellos. Esto también es llamado internamente por `ref()` cuando el valor de la referencia es un objeto. De forma similar a las shallow refs, también existe la API [`shallowReactive()`](/api/reactivity-advanced#shallowreactive) para optar por no utilizar la reactividad profunda.

### Proxy Reactivo vs. Original \*\* {#reactive-proxy-vs-original-1}

Es importante tener en cuenta que el valor devuelto por `reactive()` es un [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) del objeto original, que no es igual al objeto original:

```js
const raw = {}
const proxy = reactive(raw)

// el proxy NO es igual al original.
console.log(proxy === raw) // false
```

Sólo el proxy es reactivo; mutar el objeto original no disparará actualizaciones. Por lo tanto, la mejor práctica cuando se trabaja con el sistema de reactividad de Vue es **utilizar exclusivamente las versiones proxy de tu estado**.

Para asegurar un acceso consistente al proxy, llamar a `reactive()` sobre el mismo objeto siempre devuelve el mismo proxy, y llamar a `reactive()` sobre un proxy existente también devuelve ese mismo proxy:

```js
// llamar a reactive() sobre el mismo objeto devuelve el mismo proxy
console.log(reactive(raw) === proxy) // true

// llamar a reactive() sobre un proxy se devuelve a sí mismo
console.log(reactive(proxy) === proxy) // true
```

Esta regla se aplica también a los objetos anidados. Debido a la reactividad profunda, los objetos anidados dentro de un objeto reactivo también son proxies:

```js
const proxy = reactive({})

const raw = {}
proxy.nested = raw

console.log(proxy.nested === raw) // false
```

### Limitaciones de `reactive()` \*\* {#limitations-of-reactive}

La API `reactive()` tiene algunas limitaciones:

1. **Tipos de valor limitados:** sólo funciona para tipos de objeto (objetos, arrays y [tipos de colección](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects#keyed_collections) como `Map` y `Set`). No puede contener [tipos primitivos](https://developer.mozilla.org/en-US/docs/Glossary/Primitive) como `string`, `number` o `boolean`.

2. **No se puede reemplazar el objeto entero:** dado que el seguimiento de la reactividad de Vue funciona sobre el acceso a propiedades, debemos mantener siempre la misma referencia al objeto reactivo. Esto significa que no podemos «reemplazar» fácilmente un objeto reactivo porque se pierde la conexión de reactividad con la primera referencia:

   ```js
   let state = reactive({ count: 0 })

   // la referencia anterior ({ count: 0 }) ya no es seguida
   // (¡se ha perdido la conexión de reactividad!)
   state = reactive({ count: 1 })
   ```

3. **No desestructurable:** cuando desestructuremos una propiedad de tipo primitivo de un objeto reactivo en variables locales, o cuando pasemos esa propiedad a una función, perderemos la conexión de reactividad:

   ```js
   const state = reactive({ count: 0 })

   // count se desconecta de state.count cuando se desestructura.
   let { count } = state
   // no afecta el estado original
   count++

   // la función recibe un número plano y
   // no podrá seguir los cambios en state.count
   // tenemos que pasar el objeto completo para mantener la reactividad
   callSomeFunction(state.count)
   ```

Debido a estas limitaciones, recomendamos utilizar `ref()` como API principal para declarar el estado reactivo.

## Detalles Adicionales de Desempaquetado de Ref \*\* {#additional-ref-unwrapping-details}

### Como Propiedad de Objeto Reactivo \*\* {#ref-unwrapping-as-reactive-object-property}

Una ref se desempaqueta automáticamente cuando se accede a ella o se muta como propiedad de un objeto reactivo. En otras palabras, se comporta como una propiedad normal:

```js
const count = ref(0)
const state = reactive({
  count
})

console.log(state.count) // 0

state.count = 1
console.log(count.value) // 1
```

Si se asigna una nueva ref a una propiedad vinculada a una ref existente, ésta reemplazará a la ref anterior:

```js
const otherCount = ref(2)

state.count = otherCount
console.log(state.count) // 2
// la ref original está ahora desconectada de state.count
console.log(count.value) // 1
```

El desempaquetado de ref. sólo ocurre cuando está anidado dentro de un objeto reactivo profundo. No se aplica cuando es accesado como una propiedad de un [objeto shallow reactive](/api/reactivity-advanced#shallowreactive).

### Advertencia en Arrays y Colecciones \*\* {#caveat-in-arrays-and-collections}

A diferencia de los objetos reactivos, no se realiza **ningún** desempaquetado cuando la ref es accedida como un elemento de un array reactivo o un tipo de colección nativa como `Map`:

```js
const books = reactive([ref('Guía de Vue 3')])
// necesita .value aquí
console.log(books[0].value)

const map = reactive(new Map([['count', ref(0)]]))
// necesita .value aquí
console.log(map.get('count').value)
```

### Advertencia al Desempaquetar en las Templates \*\* {#caveat-when-unwrapping-in-templates}

El desempaquetado de ref en templates sólo se aplica si la ref es una propiedad de nivel superior en el contexto de renderizado del template.

En el siguiente ejemplo, `count` y `object` son propiedades de nivel superior, pero `object.id` no lo es:

```js
const count = ref(0)
const object = { id: ref(1) }
```

Por lo tanto, esta expresión funciona como se esperaba:

```vue-html
{{ count + 1 }}
```

...mientras que ésta **NO**:

```vue-html
{{ object.id + 1 }}
```

El resultado renderizado será `[objeto Objeto]1` porque `objeto.id` no se desempaqueta al evaluar la expresión y sigue siendo un objeto ref. Para solucionar esto, podemos desestructurar `id` en una propiedad de nivel superior:

```js
const { id } = object
```

```vue-html
{{ id + 1 }}
```

Ahora el resultado renderizado será `2`.

Otra cosa a tener en cuenta es que una referencia se desempaqueta si es el valor final evaluado de una interpolación de texto (es decir, una etiqueta <code v-pre>{{ }}</code>), por lo que lo siguiente mostrará `1`:

```vue-html
{{ object.id }}
```

Esto es sólo una característica de conveniencia de la interpolación de texto y es equivalente a <code v-pre>{{ object.id.value }}</code>.

</div>

<div class="options-api">

### Métodos con Estado \* {#stateful-methods}

En algunos casos, podemos necesitar crear dinámicamente un método función, por ejemplo creando un manejador de eventos depurado:

```js
import { debounce } from 'lodash-es'

export default {
  methods: {
    // Depurar con Lodash
    click: debounce(function () {
      // ... responder al clic ...
    }, 500)
  }
}
```

Sin embargo, este enfoque es problemático para los componentes que se reutilizan porque una función depurada es **stateful**: mantiene algún estado interno en el tiempo transcurrido. Si varias instancias del componente comparten la misma función depurada, interferirán entre sí.

Para mantener la función depurada de cada instancia del componente independiente de las demás, podemos crear la versión depurada en el hook del ciclo de vida `created`:

```js
export default {
  created() {
    // cada instancia tiene ahora su propia copia del manejador depurado
    this.debouncedClick = _.debounce(this.click, 500)
  },
  unmounted() {
    // también es buena idea cancelar el temporizador
    // cuando se elimine el componente
    this.debouncedClick.cancel()
  },
  methods: {
    click() {
      // ... responder al clic ...
    }
  }
}
```

</div>
