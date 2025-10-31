# Composition API: setup() {#composition-api-setup}

## Uso Básico {#basic-usage}

El gancho `setup()` sirve como punto de entrada para el uso de la Composition API en los componentes en los siguientes casos:

1.  Uso de la Composition API sin un paso de construcción;
2.  Integración con código basado en Composition API en un componente de Options API.

:::info Nota
Si estás usando la Composition API con Componentes de Archivo Único, se recomienda encarecidamente [`<script setup>`](/api/sfc-script-setup) para una sintaxis más concisa y ergonómica.
:::

Podemos declarar estado reactivo usando las [APIs de Reactividad](./reactivity-core) y exponerlos a la plantilla devolviendo un objeto desde `setup()`. Las propiedades del objeto devuelto también estarán disponibles en la instancia del componente (si se usan otras opciones):

```vue
<script>
import { ref } from 'vue'

export default {
  setup() {
    const count = ref(0)

    // expose to template and other options API hooks
    return {
      count
    }
  },

  mounted() {
    console.log(this.count) // 0
  }
}
</script>

<template>
  <button @click="count++">{{ count }}</button>
</template>
```

Los [refs](/api/reactivity-core#ref) devueltos desde `setup` se [desenvuelven automáticamente de forma superficial](/guide/essentials/reactivity-fundamentals#deep-reactivity) cuando se acceden en la plantilla, por lo que no necesitas usar `.value` al acceder a ellos. También se desenvuelven de la misma manera cuando se acceden en `this`.

`setup()` en sí mismo no tiene acceso a la instancia del componente: `this` tendrá un valor de `undefined` dentro de `setup()`. Puedes acceder a los valores expuestos por la Composition API desde la Options API, pero no al revés.

`setup()` debe devolver un objeto _sincrónicamente_. El único caso en que se puede usar `async setup()` es cuando el componente es un descendiente de un componente [Suspense](../guide/built-ins/suspense).

## Accediendo a las Props {#accessing-props}

El primer argumento de la función `setup` es el argumento `props`. Tal como esperarías en un componente estándar, las `props` dentro de una función `setup` son reactivas y se actualizarán cuando se pasen nuevas `props`.

```js
export default {
  props: {
    title: String
  },
  setup(props) {
    console.log(props.title)
  }
}
```

Ten en cuenta que si desestructuras el objeto `props`, las variables desestructuradas perderán reactividad. Por lo tanto, se recomienda acceder siempre a las `props` en la forma `props.xxx`.

Si realmente necesitas desestructurar las `props`, o necesitas pasar una `prop` a una función externa manteniendo la reactividad, puedes hacerlo con las APIs de utilidad [toRefs()](./reactivity-utilities#torefs) y [toRef()](/api/reactivity-utilities#toref):

```js
import { toRefs, toRef } from 'vue'

export default {
  setup(props) {
    // turn `props` into an object of refs, then destructure
    const { title } = toRefs(props)
    // `title` is a ref that tracks `props.title`
    console.log(title.value)

    // OR, turn a single property on `props` into a ref
    const title = toRef(props, 'title')
  }
}
```

## Contexto de Setup {#setup-context}

El segundo argumento pasado a la función `setup` es un objeto de **Contexto de Setup**. El objeto de contexto expone otros valores que pueden ser útiles dentro de `setup`:

```js
export default {
  setup(props, context) {
    // Attributes (Non-reactive object, equivalent to $attrs)
    console.log(context.attrs)

    // Slots (Non-reactive object, equivalent to $slots)
    console.log(context.slots)

    // Emit events (Function, equivalent to $emit)
    console.log(context.emit)

    // Expose public properties (Function)
    console.log(context.expose)
  }
}
```

El objeto de contexto no es reactivo y puede ser desestructurado de forma segura:

```js
export default {
  setup(props, { attrs, slots, emit, expose }) {
    ...
  }
}
```

`attrs` y `slots` son objetos con estado que siempre se actualizan cuando el componente mismo se actualiza. Esto significa que debes evitar desestructurarlos y siempre referenciar las propiedades como `attrs.x` o `slots.x`. También ten en cuenta que, a diferencia de `props`, las propiedades de `attrs` y `slots` **no** son reactivas. Si tienes la intención de aplicar efectos secundarios basados en cambios en `attrs` o `slots`, debes hacerlo dentro de un gancho de ciclo de vida `onBeforeUpdate`.

### Exponiendo Propiedades Públicas {#exposing-public-properties}

`expose` es una función que se puede usar para limitar explícitamente las propiedades expuestas cuando la instancia del componente es accedida por un componente padre a través de [refs de plantilla](/guide/essentials/template-refs#ref-on-component):

```js{5,10}
export default {
  setup(props, { expose }) {
    // make the instance "closed" -
    // i.e. do not expose anything to the parent
    expose()

    const publicCount = ref(0)
    const privateCount = ref(0)
    // selectively expose local state
    expose({ count: publicCount })
  }
}
```

## Uso con Funciones de Renderizado {#usage-with-render-functions}

`setup` también puede devolver una [función de renderizado](/guide/extras/render-function) que puede utilizar directamente el estado reactivo declarado en el mismo ámbito:

```js{6}
import { h, ref } from 'vue'

export default {
  setup() {
    const count = ref(0)
    return () => h('div', count.value)
  }
}
```

Devolver una función de renderizado nos impide devolver cualquier otra cosa. Internamente eso no debería ser un problema, pero puede ser problemático si queremos exponer métodos de este componente al componente padre a través de `refs` de plantilla.

Podemos resolver este problema llamando a [`expose()`](#exposing-public-properties):

```js{8-10}
import { h, ref } from 'vue'

export default {
  setup(props, { expose }) {
    const count = ref(0)
    const increment = () => ++count.value

    expose({
      increment
    })

    return () => h('div', count.value)
  }
}
```

El método `increment` estaría entonces disponible en el componente padre a través de una `ref` de plantilla.