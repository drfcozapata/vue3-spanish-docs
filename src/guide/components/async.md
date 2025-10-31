# Componentes Asíncronos {#async-components}

## Uso Básico {#basic-usage}

En aplicaciones grandes, puede que necesitemos dividir la aplicación en partes más pequeñas y cargar un componente desde el servidor solo cuando sea necesario. Para hacer esto posible, Vue tiene una función [`defineAsyncComponent`](/api/general#defineasynccomponent):

```js
import { defineAsyncComponent } from 'vue'

const AsyncComp = defineAsyncComponent(() => {
  return new Promise((resolve, reject) => {
    // ...load component from server
    resolve(/* loaded component */)
  })
})
// ... use `AsyncComp` like a normal component
```

Como puedes ver, `defineAsyncComponent` acepta una función cargadora que devuelve una `Promise`. La función de callback `resolve` de la `Promise` debe ser llamada cuando hayas recuperado la definición de tu componente del servidor. También puedes llamar a `reject(reason)` para indicar que la carga ha fallado.

[La importación dinámica de módulos ES](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import) también devuelve una `Promise`, así que la mayoría de las veces la usaremos en combinación con `defineAsyncComponent`. Bundlers como Vite y webpack también soportan esta sintaxis (y la usarán como puntos de división de bundle), así que podemos usarla para importar SFCs de Vue:

```js
import { defineAsyncComponent } from 'vue'

const AsyncComp = defineAsyncComponent(() =>
  import('./components/MyComponent.vue')
)
```

El `AsyncComp` resultante es un componente envoltorio que solo llama a la función cargadora cuando se renderiza realmente en la página. Además, pasará cualquier `props` y `slots` al componente interno, por lo que puedes usar el envoltorio asíncrono para reemplazar sin problemas el componente original mientras logras la carga perezosa.

Al igual que con los componentes normales, los componentes asíncronos pueden ser [registrados globalmente](/guide/components/registration#global-registration) usando `app.component()`:

```js
app.component('MyComponent', defineAsyncComponent(() =>
  import('./components/MyComponent.vue')
))
```

<div class="options-api">

También puedes usar `defineAsyncComponent` cuando [registras un componente localmente](/guide/components/registration#local-registration):

```vue
<script>
import { defineAsyncComponent } from 'vue'

export default {
  components: {
    AdminPage: defineAsyncComponent(() =>
      import('./components/AdminPageComponent.vue')
    )
  }
}
</script>

<template>
  <AdminPage />
</template>
```

</div>

<div class="composition-api">

También pueden definirse directamente dentro de su componente padre:

```vue
<script setup>
import { defineAsyncComponent } from 'vue'

const AdminPage = defineAsyncComponent(() =>
  import('./components/AdminPageComponent.vue')
)
</script>

<template>
  <AdminPage />
</template>
```

</div>

## Estados de Carga y Error {#loading-and-error-states}

Las operaciones asíncronas inevitablemente implican estados de carga y error - `defineAsyncComponent()` soporta el manejo de estos estados a través de opciones avanzadas:

```js
const AsyncComp = defineAsyncComponent({
  // the loader function
  loader: () => import('./Foo.vue'),

  // A component to use while the async component is loading
  loadingComponent: LoadingComponent,
  // Delay before showing the loading component. Default: 200ms.
  delay: 200,

  // A component to use if the load fails
  errorComponent: ErrorComponent,
  // The error component will be displayed if a timeout is
  // provided and exceeded. Default: Infinity.
  timeout: 3000
})
```

Si se proporciona un componente de carga, este se mostrará primero mientras se carga el componente interno. Hay un retraso predeterminado de 200ms antes de que se muestre el componente de carga - esto se debe a que en redes rápidas, un estado de carga instantáneo podría ser reemplazado demasiado rápido y terminar pareciendo un parpadeo.

Si se proporciona un componente de error, este se mostrará cuando la `Promise` devuelta por la función cargadora sea rechazada. También puedes especificar un `timeout` para mostrar el componente de error cuando la solicitud está tardando demasiado.

## Hidratación Perezosa <sup class="vt-badge" data-text="3.5+" /> {#lazy-hydration}

> Esta sección solo aplica si estás usando [Server-Side Rendering](/guide/scaling-up/ssr).

En Vue 3.5+, los componentes asíncronos pueden controlar cuándo se hidratan al proporcionar una estrategia de hidratación.

- Vue proporciona varias estrategias de hidratación incorporadas. Estas estrategias incorporadas deben importarse individualmente para que puedan ser `tree-shaken` si no se utilizan.

- El diseño es intencionadamente de bajo nivel para mayor flexibilidad. El `syntax sugar` del compilador puede construirse sobre esto en el futuro, ya sea en el `core` o en soluciones de nivel superior (por ejemplo, Nuxt).

### Hidratar en Inactividad {#hydrate-on-idle}

Hidrata vía `requestIdleCallback`:

```js
import { defineAsyncComponent, hydrateOnIdle } from 'vue'

const AsyncComp = defineAsyncComponent({
  loader: () => import('./Comp.vue'),
  hydrate: hydrateOnIdle(/* optionally pass a max timeout */)
})
```

### Hidratar al ser Visible {#hydrate-on-visible}

Hidrata cuando el/los elemento(s) se vuelven visibles vía `IntersectionObserver`.

```js
import { defineAsyncComponent, hydrateOnVisible } from 'vue'

const AsyncComp = defineAsyncComponent({
  loader: () => import('./Comp.vue'),
  hydrate: hydrateOnVisible()
})
```

Opcionalmente se puede pasar un objeto de opciones para el observador:

```js
hydrateOnVisible({ rootMargin: '100px' })
```

### Hidratar por Media Query {#hydrate-on-media-query}

Hidrata cuando la `media query` especificada coincide.

```js
import { defineAsyncComponent, hydrateOnMediaQuery } from 'vue'

const AsyncComp = defineAsyncComponent({
  loader: () => import('./Comp.vue'),
  hydrate: hydrateOnMediaQuery('(max-width:500px)')
})
```

### Hidratar en Interacción {#hydrate-on-interaction}

Hidrata cuando el/los evento(s) especificado(s) se activan en el/los elemento(s) del componente. El evento que desencadenó la hidratación también se reproducirá una vez que la hidratación esté completa.

```js
import { defineAsyncComponent, hydrateOnInteraction } from 'vue'

const AsyncComp = defineAsyncComponent({
  loader: () => import('./Comp.vue'),
  hydrate: hydrateOnInteraction('click')
})
```

También puede ser una lista de varios tipos de eventos:

```js
hydrateOnInteraction(['wheel', 'mouseover'])
```

### Estrategia Personalizada {#custom-strategy}

```ts
import { defineAsyncComponent, type HydrationStrategy } from 'vue'

const myStrategy: HydrationStrategy = (hydrate, forEachElement) => {
  // forEachElement is a helper to iterate through all the root elements
  // in the component's non-hydrated DOM, since the root can be a fragment
  // instead of a single element
  forEachElement(el => {
    // ...
  })
  // call `hydrate` when ready
  hydrate()
  return () => {
    // return a teardown function if needed
  }
}

const AsyncComp = defineAsyncComponent({
  loader: () => import('./Comp.vue'),
  hydrate: myStrategy
})
```

## Uso con Suspense {#using-with-suspense}

Los componentes asíncronos pueden usarse con el componente integrado `<Suspense>`. La interacción entre `<Suspense>` y los componentes asíncronos está documentada en el [capítulo dedicado a `<Suspense>`](/guide/built-ins/suspense).