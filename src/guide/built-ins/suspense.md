---
outline: deep
---

# Suspense {#suspense}

:::warning Característica experimental
`<Suspense>` es una característica experimental. No se garantiza que alcance un estado estable y la API puede cambiar antes de que lo haga.
:::

`<Suspense>` es un componente integrado para orquestar dependencias asíncronas en un árbol de componentes. Puede renderizar un estado de carga mientras espera que se resuelvan múltiples dependencias asíncronas anidadas en el árbol de componentes.

## Dependencias Asíncronas {#async-dependencies}

Para explicar el problema que `<Suspense>` intenta resolver y cómo interactúa con estas dependencias asíncronas, imaginemos una jerarquía de componentes como la siguiente:

```
<Suspense>
└─ <Dashboard>
   ├─ <Profile>
   │  └─ <FriendStatus> (component with async setup())
   └─ <Content>
      ├─ <ActivityFeed> (async component)
      └─ <Stats> (async component)
```

En el árbol de componentes, hay múltiples componentes anidados cuyo renderizado depende de que algún recurso asíncrono se resuelva primero. Sin `<Suspense>`, cada uno de ellos deberá manejar sus propios estados de carga/error y cargado. En el peor de los casos, podríamos ver tres indicadores de carga en la página, con el contenido mostrándose en diferentes momentos.

El componente `<Suspense>` nos brinda la capacidad de mostrar estados de carga/error de nivel superior mientras esperamos que se resuelvan estas dependencias asíncronas anidadas.

Hay dos tipos de dependencias asíncronas que `<Suspense>` puede esperar:

1. Componentes con un hook `setup()` asíncrono. Esto incluye componentes que usan `<script setup>` con expresiones `await` de nivel superior.

2. [Componentes Asíncronos](/guide/components/async).

### `async setup()` {#async-setup}

El hook `setup()` de un componente de Composition API puede ser asíncrono:

```js
export default {
  async setup() {
    const res = await fetch(...)
    const posts = await res.json()
    return {
      posts
    }
  }
}
```

Si se usa `<script setup>`, la presencia de expresiones `await` de nivel superior convierte automáticamente el componente en una dependencia asíncrona:

```vue
<script setup>
const res = await fetch(...)
const posts = await res.json()
</script>

<template>
  {{ posts }}
</template>
```

### Componentes Asíncronos {#async-components}

Los componentes asíncronos son **"suspensibles"** por defecto. Esto significa que si tiene un `<Suspense>` en la cadena de padres, será tratado como una dependencia asíncrona de ese `<Suspense>`. En este caso, el estado de carga será controlado por `<Suspense>`, y las opciones propias de carga, error, retardo y `timeout` del componente serán ignoradas.

El componente asíncrono puede optar por salir del control de `Suspense` y dejar que el componente controle siempre su propio estado de carga especificando `suspensible: false` en sus opciones.

## Estado de Carga {#loading-state}

El componente `<Suspense>` tiene dos slots: `#default` y `#fallback`. Ambos slots solo permiten **un** nodo hijo inmediato. El nodo en el slot `default` se muestra si es posible. Si no, se mostrará el nodo en el slot `fallback` en su lugar.

```vue-html
<Suspense>
  <!-- componente con dependencias asíncronas anidadas -->
  <Dashboard />

  <!-- estado de carga a través del slot #fallback -->
  <template #fallback>
    Loading...
  </template>
</Suspense>
```

En el renderizado inicial, `<Suspense>` renderizará el contenido de su slot `default` en memoria. Si se encuentran dependencias asíncronas durante el proceso, entrará en un estado **pendiente**. Durante el estado pendiente, se mostrará el contenido de `fallback`. Cuando todas las dependencias asíncronas encontradas se hayan resuelto, `<Suspense>` entrará en un estado **resuelto** y se mostrará el contenido del slot `default` resuelto.

Si no se encontraron dependencias asíncronas durante el renderizado inicial, `<Suspense>` pasará directamente a un estado resuelto.

Una vez en un estado resuelto, `<Suspense>` solo volverá a un estado pendiente si se reemplaza el nodo raíz del slot `#default`. Las nuevas dependencias asíncronas anidadas más profundamente en el árbol **no** harán que `<Suspense>` vuelva a un estado pendiente.

Cuando ocurre una reversión, el contenido de `fallback` no se mostrará inmediatamente. En su lugar, `<Suspense>` mostrará el contenido `#default` anterior mientras espera que se resuelva el nuevo contenido y sus dependencias asíncronas. Este comportamiento se puede configurar con la prop `timeout`: `<Suspense>` cambiará al contenido de `fallback` si tarda más de `timeout` milisegundos en renderizar el nuevo contenido `default`. Un valor de `timeout` de `0` hará que el contenido de `fallback` se muestre inmediatamente cuando se reemplace el contenido `default`.

## Eventos {#events}

El componente `<Suspense>` emite 3 eventos: `pending`, `resolve` y `fallback`. El evento `pending` ocurre al entrar en un estado pendiente. El evento `resolve` se emite cuando el nuevo contenido ha terminado de resolverse en el slot `default`. El evento `fallback` se dispara cuando se muestra el contenido del slot `fallback`.

Los eventos podrían usarse, por ejemplo, para mostrar un indicador de carga frente al DOM antiguo mientras se cargan los nuevos componentes.

## Manejo de Errores {#error-handling}

`<Suspense>` actualmente no proporciona manejo de errores a través del componente en sí; sin embargo, puedes usar la opción [`errorCaptured`](/api/options-lifecycle#errorcaptured) o el hook [`onErrorCaptured()`](/api/composition-api-lifecycle#onerrorcaptured) para capturar y manejar errores asíncronos en el componente padre de `<Suspense>`.

## Combinación con Otros Componentes {#combining-with-other-components}

Es común querer usar `<Suspense>` en combinación con los componentes [`<Transition>`](./transition) y [`<KeepAlive>`](./keep-alive). El orden de anidamiento de estos componentes es importante para que todos funcionen correctamente.

Además, estos componentes a menudo se usan junto con el componente `<RouterView>` de [Vue Router](https://router.vuejs.org/).

El siguiente ejemplo muestra cómo anidar estos componentes para que todos se comporten como se espera. Para combinaciones más simples, puedes eliminar los componentes que no necesites:

```vue-html
<RouterView v-slot="{ Component }">
  <template v-if="Component">
    <Transition mode="out-in">
      <KeepAlive>
        <Suspense>
          <!-- contenido principal -->
          <component :is="Component"></component>

          <!-- estado de carga -->
          <template #fallback>
            Loading...
          </template>
        </Suspense>
      </KeepAlive>
    </Transition>
  </template>
</RouterView>
```

Vue Router tiene soporte integrado para la [carga perezosa de componentes](https://router.vuejs.org/guide/advanced/lazy-loading.html) usando importaciones dinámicas. Estos son distintos de los componentes asíncronos y actualmente no activarán `<Suspense>`. Sin embargo, todavía pueden tener componentes asíncronos como descendientes y estos pueden activar `<Suspense>` de la manera habitual.

## Suspense Anidado {#nested-suspense}

- Solo soportado en 3.3+

Cuando tenemos múltiples componentes asíncronos (común para rutas anidadas o basadas en layout) como esto:

```vue-html
<Suspense>
  <component :is="DynamicAsyncOuter">
    <component :is="DynamicAsyncInner" />
  </component>
</Suspense>
```

`<Suspense>` crea un límite que resolverá todos los componentes asíncronos en el árbol, como se espera. Sin embargo, cuando cambiamos `DynamicAsyncOuter`, `<Suspense>` lo espera correctamente, pero cuando cambiamos `DynamicAsyncInner`, el `DynamicAsyncInner` anidado renderiza un nodo vacío hasta que se ha resuelto (en lugar del anterior o el slot `fallback`).

Para resolver eso, podríamos tener un suspense anidado para manejar el parche para el componente anidado, como:

```vue-html
<Suspense>
  <component :is="DynamicAsyncOuter">
    <Suspense suspensible> <!-- esto -->
      <component :is="DynamicAsyncInner" />
    </Suspense>
  </component>
</Suspense>
```

Si no estableces la prop `suspensible`, el `<Suspense>` interno será tratado como un componente síncrono por el `<Suspense>` padre. Eso significa que tiene su propio slot `fallback` y si ambos componentes `Dynamic` cambian al mismo tiempo, podría haber nodos vacíos y múltiples ciclos de parcheo mientras el `<Suspense>` hijo está cargando su propio árbol de dependencias, lo cual podría no ser deseable. Cuando se establece, todo el manejo de dependencias asíncronas se entrega al `<Suspense>` padre (incluidos los eventos emitidos) y el `<Suspense>` interno sirve únicamente como otro límite para la resolución de dependencias y el parcheo.

---

**Relacionado**

- [Referencia de la API de `<Suspense>`](/api/built-in-components#suspense)