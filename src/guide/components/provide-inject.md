# Provide / Inject {#provide-inject}

> Esta página asume que ya has leído la sección [Fundamentos de Componentes](/guide/essentials/component-basics). Léela primero si eres nuevo en los componentes.

## Prop Drilling {#prop-drilling}

Normalmente, cuando necesitamos pasar datos del componente padre a un componente hijo, utilizamos [props](/guide/components/props). Sin embargo, imagina el caso en el que tenemos un árbol de componentes grande, y un componente anidado profundamente necesita algo de un componente ancestro distante. Con solo `props`, tendríamos que pasar la misma `prop` a través de toda la cadena de padres:

![prop drilling diagram](./images/prop-drilling.png)

<!-- https://www.figma.com/file/yNDTtReM2xVgjcGVRzChss/prop-drilling -->

Observa que, aunque el componente `<Footer>` puede no preocuparse en absoluto por estas `props`, aún necesita declararlas y pasarlas para que `<DeepChild>` pueda acceder a ellas. Si hay una cadena de padres más larga, más componentes se verían afectados en el camino. Esto se llama "props drilling" y definitivamente no es divertido de manejar.

Podemos resolver el "props drilling" con `provide` e `inject`. Un componente padre puede actuar como un **proveedor de dependencia** para todos sus descendientes. Cualquier componente en el árbol descendiente, sin importar cuán profundo esté, puede **inyectar** dependencias proporcionadas por componentes en su cadena de padres.

![Provide/inject scheme](./images/provide-inject.png)

<!-- https://www.figma.com/file/PbTJ9oXis5KUawEOWdy2cE/provide-inject -->

## Provide {#provide}

<div class="composition-api">

Para proporcionar datos a los descendientes de un componente, utiliza la función [`provide()`](/api/composition-api-dependency-injection#provide):

```vue
<script setup>
import { provide } from 'vue'

provide(/* key */ 'message', /* value */ 'hello!')
</script>
```

Si no utilizas `<script setup>`, asegúrate de que `provide()` se llame sincrónicamente dentro de `setup()`:

```js
import { provide } from 'vue'

export default {
  setup() {
    provide(/* key */ 'message', /* value */ 'hello!')
  }
}
```

La función `provide()` acepta dos argumentos. El primer argumento se llama **clave de inyección**, que puede ser una cadena de texto o un `Symbol`. La clave de inyección es utilizada por los componentes descendientes para buscar el valor deseado a inyectar. Un solo componente puede llamar a `provide()` varias veces con diferentes claves de inyección para proporcionar distintos valores.

El segundo argumento es el valor proporcionado. El valor puede ser de cualquier tipo, incluyendo estado reactivo como `refs`:

```js
import { ref, provide } from 'vue'

const count = ref(0)
provide('key', count)
```

Proporcionar valores reactivos permite a los componentes descendientes que utilizan el valor proporcionado establecer una conexión reactiva con el componente proveedor.

</div>

<div class="options-api">

Para proporcionar datos a los descendientes de un componente, utiliza la opción [`provide`](/api/options-composition#provide):

```js
export default {
  provide: {
    message: 'hello!'
  }
}
```

Para cada propiedad en el objeto `provide`, la clave es utilizada por los componentes hijos para localizar el valor correcto a inyectar, mientras que el valor es lo que finalmente se inyecta.

Si necesitamos proporcionar estado por instancia, por ejemplo datos declarados a través de `data()`, entonces `provide` debe usar un valor de función:

```js{7-12}
export default {
  data() {
    return {
      message: 'hello!'
    }
  },
  provide() {
    // use function syntax so that we can access `this`
    return {
      message: this.message
    }
  }
}
```

Sin embargo, ten en cuenta que esto **no** hace que la inyección sea reactiva. Discutiremos [cómo hacer que las inyecciones sean reactivas](#working-with-reactivity) a continuación.

</div>

## Provide a nivel de aplicación {#app-level-provide}

Además de proporcionar datos en un componente, también podemos proporcionar a nivel de aplicación:

```js
import { createApp } from 'vue'

const app = createApp({})

app.provide(/* key */ 'message', /* value */ 'hello!')
```

Las `provides` a nivel de aplicación están disponibles para todos los componentes renderizados en la aplicación. Esto es especialmente útil al escribir [plugins](/guide/reusability/plugins), ya que los `plugins` normalmente no podrían proporcionar valores utilizando componentes.

## Inject {#inject}

<div class="composition-api">

Para inyectar datos proporcionados por un componente ancestro, utiliza la función [`inject()`](/api/composition-api-dependency-injection#inject):

```vue
<script setup>
import { inject } from 'vue'

const message = inject('message')
</script>
```

Si múltiples padres proporcionan datos con la misma clave, `inject` resolverá el valor del padre más cercano en la cadena de padres del componente.

Si el valor proporcionado es una `ref`, se inyectará tal cual y **no** se desenvolverá automáticamente. Esto permite que el componente inyector mantenga la conexión de reactividad con el componente proveedor.

[Ejemplo completo de provide + inject con Reactividad](https://play.vuejs.org/#eNqFUUFugzAQ/MrKF1IpxfeIVKp66Kk/8MWFDXYFtmUbpArx967BhURRU9/WOzO7MzuxV+fKcUB2YlWovXYRAsbBvQije2d9hAk8Xo7gvB11gzDDxdseCuIUG+ZN6a7JjZIvVRIlgDCcw+d3pmvTglz1okJ499I0C3qB1dJQT9YRooVaSdNiACWdQ5OICj2WwtTWhAg9hiBbhHNSOxQKu84WT8LkNQ9FBhTHXyg1K75aJHNUROxdJyNSBVBp44YI43NvG+zOgmWWYGt7dcipqPhGZEe2ef07wN3lltD+lWN6tNkV/37+rdKjK2rzhRTt7f3u41xhe37/xJZGAL2PLECXa9NKdD/a6QTTtGnP88LgiXJtYv4BaLHhvg==)

De nuevo, si no utilizas `<script setup>`, `inject()` solo debe llamarse sincrónicamente dentro de `setup()`:

```js
import { inject } from 'vue'

export default {
  setup() {
    const message = inject('message')
    return { message }
  }
}
```

</div>

<div class="options-api">

Para inyectar datos proporcionados por un componente ancestro, utiliza la opción [`inject`](/api/options-composition#inject):

```js
export default {
  inject: ['message'],
  created() {
    console.log(this.message) // injected value
  }
}
```

Las inyecciones se resuelven **antes** del propio estado del componente, por lo que puedes acceder a las propiedades inyectadas en `data()`:

```js
export default {
  inject: ['message'],
  data() {
    return {
      // initial data based on injected value
      fullMessage: this.message
    }
  }
}
```

Si múltiples padres proporcionan datos con la misma clave, `inject` resolverá el valor del padre más cercano en la cadena de padres del componente.

[Ejemplo completo de provide + inject](https://play.vuejs.org/#eNqNkcFqwzAQRH9l0EUthOhuRKH00FO/oO7B2JtERZaEvA4F43+vZCdOTAIJCImRdpi32kG8h7A99iQKobs6msBvpTNt8JHxcTC2wS76FnKrJpVLZelKR39TSUO7qreMoXRA7ZPPkeOuwHByj5v8EqI/moZeXudCIBL30Z0V0FLXVXsqIA9krU8R+XbMR9rS0mqhS4KpDbZiSgrQc5JKQqvlRWzEQnyvuc9YuWbd4eXq+TZn0IvzOeKr4FvsNcaK/R6Ocb9Uc4FvefpE+fMwP0wH8DU7wB77nIo6x6a2hvNEME5D0CpbrjnHf+8excI=)

### Alias de inyección \* {#injection-aliasing}

Cuando se utiliza la sintaxis de array para `inject`, las propiedades inyectadas se exponen en la instancia del componente utilizando la misma clave. En el ejemplo anterior, la propiedad se proporcionó bajo la clave `"message"`, y se inyectó como `this.message`. La clave local es la misma que la clave de inyección.

Si queremos inyectar la propiedad utilizando una clave local diferente, necesitamos usar la sintaxis de objeto para la opción `inject`:

```js
export default {
  inject: {
    /* local key */ localMessage: {
      from: /* injection key */ 'message'
    }
  }
}
```

Aquí, el componente localizará una propiedad proporcionada con la clave `"message"`, y luego la expondrá como `this.localMessage`.

</div>

### Valores por defecto de inyección {#injection-default-values}

Por defecto, `inject` asume que la clave inyectada se proporciona en algún lugar de la cadena de padres. En el caso de que la clave no se proporcione, habrá una advertencia en tiempo de ejecución.

Si queremos que una propiedad inyectada funcione con proveedores opcionales, necesitamos declarar un valor por defecto, similar a las `props`:

<div class="composition-api">

```js
// `value` will be "default value"
// if no data matching "message" was provided
const value = inject('message', 'default value')
```

En algunos casos, el valor por defecto puede necesitar ser creado llamando a una función o instanciando una nueva clase. Para evitar cálculos innecesarios o efectos secundarios en caso de que el valor opcional no se utilice, podemos usar una función de fábrica para crear el valor por defecto:

```js
const value = inject('key', () => new ExpensiveClass(), true)
```

El tercer parámetro indica que el valor por defecto debe tratarse como una función de fábrica.

</div>

<div class="options-api">

```js
export default {
  // object syntax is required
  // when declaring default values for injections
  inject: {
    message: {
      from: 'message', // this is optional if using the same key for injection
      default: 'default value'
    },
    user: {
      // use a factory function for non-primitive values that are expensive
      // to create, or ones that should be unique per component instance.
      default: () => ({ name: 'John' })
    }
  }
}
```

</div>

## Trabajar con Reactividad {#working-with-reactivity}

<div class="composition-api">

Cuando se utilizan valores `provide` / `inject` reactivos, **se recomienda mantener cualquier mutación del estado reactivo dentro del _proveedor_ siempre que sea posible**. Esto asegura que el estado proporcionado y sus posibles mutaciones estén colocalizados en el mismo componente, facilitando su mantenimiento en el futuro.

Puede haber momentos en los que necesitemos actualizar los datos desde un componente inyector. En tales casos, recomendamos proporcionar una función que sea responsable de mutar el estado:

```vue{7-9,13}
<!-- inside provider component -->
<script setup>
import { provide, ref } from 'vue'

const location = ref('North Pole')

function updateLocation() {
  location.value = 'South Pole'
}

provide('location', {
  location,
  updateLocation
})
</script>
```

```vue{5}
<!-- in injector component -->
<script setup>
import { inject } from 'vue'

const { location, updateLocation } = inject('location')
</script>

<template>
  <button @click="updateLocation">{{ location }}</button>
</template>
```

Finalmente, puedes envolver el valor proporcionado con [`readonly()`](/api/reactivity-core#readonly) si quieres asegurarte de que los datos pasados a través de `provide` no puedan ser mutados por el componente inyector.

```vue
<script setup>
import { ref, provide, readonly } from 'vue'

const count = ref(0)
provide('read-only-count', readonly(count))
</script>
```

</div>

<div class="options-api">

Para hacer que las inyecciones estén reactivamente vinculadas al proveedor, necesitamos proporcionar una propiedad `computed` utilizando la función [computed()](/api/reactivity-core#computed):

```js{12}
import { computed } from 'vue'

export default {
  data() {
    return {
      message: 'hello!'
    }
  },
  provide() {
    return {
      // explicitly provide a computed property
      message: computed(() => this.message)
    }
  }
}
```

[Ejemplo completo de provide + inject con Reactividad](https://play.vuejs.org/#eNqNUctqwzAQ/JVFFyeQxnfjBEoPPfULqh6EtYlV9EKWTcH43ytZtmPTQA0CsdqZ2dlRT16tPXctkoKUTeWE9VeqhbLGeXirheRwc0ZBds7HKkKzBdBDZZRtPXIYJlzqU40/I4LjjbUyIKmGEWw0at8UgZrUh1PscObZ4ZhQAA596/RcAShsGnbHArIapTRBP74O8Up060wnOO5QmP0eAvZyBV+L5jw1j2tZqsMp8yWRUHhUVjKPoQIohQ460L0ow1FeKJlEKEnttFweijJfiORElhCf5f3umObb0B9PU/I7kk17PJj7FlloN/2t7a2Pj/Zkdob+x8gV8ZlMs2de/8+14AXwkBngD9zgVqjg2rNXPvwjD+EdHnilrn8MvtvD1+Q==)

La función `computed()` se utiliza típicamente en componentes de la Composition API, pero también puede utilizarse para complementar ciertos casos de uso en la Options API. Puedes aprender más sobre su uso leyendo los [Fundamentos de Reactividad](/guide/essentials/reactivity-fundamentals) y las [Propiedades Computadas](/guide/essentials/computed) con la preferencia de API establecida en Composition API.

</div>

## Trabajar con Claves `Symbol` {#working-with-symbol-keys}

Hasta ahora, hemos estado usando claves de inyección de cadena de texto en los ejemplos. Si estás trabajando en una aplicación grande con muchos proveedores de dependencia, o estás creando componentes que van a ser utilizados por otros desarrolladores, es mejor usar claves de inyección [Symbol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol) para evitar posibles colisiones.

Se recomienda exportar los `Symbols` en un archivo dedicado:

```js [keys.js]
export const myInjectionKey = Symbol()
```

<div class="composition-api">

```js
// in provider component
import { provide } from 'vue'
import { myInjectionKey } from './keys.js'

provide(myInjectionKey, {
  /* data to provide */
})
```

```js
// in injector component
import { inject } from 'vue'
import { myInjectionKey } from './keys.js'

const injected = inject(myInjectionKey)
```

Ver también: [Tipado de Provide / Inject](/guide/typescript/composition-api#typing-provide-inject) <sup class="vt-badge ts" />

</div>

<div class="options-api">

```js
// in provider component
import { myInjectionKey } from './keys.js'

export default {
  provide() {
    return {
      [myInjectionKey]: {
        /* data to provide */
      }
    }
  }
}
```

```js
// in injector component
import { myInjectionKey } from './keys.js'

export default {
  inject: {
    injected: { from: myInjectionKey }
  }
}
```

</div>
