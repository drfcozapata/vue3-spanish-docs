<script setup>
import SwitchComponent from './keep-alive-demos/SwitchComponent.vue'
</script>

# KeepAlive {#keepalive}

`<KeepAlive>` es un componente incorporado que nos permite almacenar en caché condicionalmente instancias de componente al cambiar dinámicamente entre múltiples componentes.

## Uso Básico {#basic-usage}

En el capítulo Fundamentos de Componentes, introdujimos la sintaxis para [Componentes Dinámicos](/guide/essentials/component-basics#dynamic-components), utilizando el elemento especial `<component>`:

```vue-html
<component :is="activeComponent" />
```

Por defecto, una instancia de componente activa será desmontada cuando se cambie a otro. Esto hará que cualquier estado modificado que contenga se pierda. Cuando este componente se muestre de nuevo, se creará una nueva instancia con solo el estado inicial.

En el ejemplo siguiente, tenemos dos componentes con estado: A contiene un contador, mientras que B contiene un mensaje sincronizado con un input a través de `v-model`. Intenta actualizar el estado de uno de ellos, cambia a otro y luego vuelve a él:

<SwitchComponent />

Notarás que cuando se vuelve a él, el estado modificado anterior se habrá restablecido.

Crear una nueva instancia de componente al cambiar es un comportamiento normalmente útil, pero en este caso, nos gustaría realmente que las dos instancias de componente se preservaran incluso cuando estén inactivas. Para resolver este problema, podemos envolver nuestro componente dinámico con el componente incorporado `<KeepAlive>`:

```vue-html
<!-- ¡Los componentes inactivos se almacenarán en caché! -->
<KeepAlive>
  <component :is="activeComponent" />
</KeepAlive>
```

Ahora, el estado persistirá a través de los cambios de componente:

<SwitchComponent use-KeepAlive />

<div class="composition-api">

[Pruébalo en el Playground](https://play.vuejs.org/#eNqtUsFOwzAM/RWrl4IGC+cqq2h3RFw495K12YhIk6hJi1DVf8dJSllBaAJxi+2XZz8/j0lhzHboeZIl1NadMA4sd73JKyVaozsHI9hnJmX+feJHmODY6RZS/JEuiL1uTTEXtiREnnINKFeAcgZUqtbKOqj7ruPKwe6s2VVguq4UJXEynAkDx1sjmeMYAdBGDFBLZu2uShre6ioJeaxIduAyp0KZ3oF7MxwRHWsEQmC4bXXDJWbmxpjLBiZ7DwptMUFyKCiJNP/BWUbO8gvnA+emkGKIgkKqRrRWfh+Z8MIWwpySpfbxn6wJKMGV4IuSs0UlN1HVJae7bxYvBuk+2IOIq7sLnph8P9u5DJv5VfpWWLaGqTzwZTCOM/M0IaMvBMihd04ruK+lqF/8Ajxms8EFbCiJxR8khsP6ncQosLWnWV6a/kUf2nqu75Fby04chA0iPvaYryhz6NBRLjdtajpHZTWPio=)

</div>
<div class="options-api">

[Pruébalo en el Playground](https://play.vuejs.org/#eNqtU8tugzAQ/JUVl7RKWveMXFTIseofcHHAiaSasPxArRD/3rVNSEhbpVUrIWB3x7PM7uBIcFb3veNJmlBTaaFsVraiUZ22sO0alcNedw2s7kmIPHS1ABQLQDEBAMqWvwVQzffMSQuDz1aI6VreWpPCEBtsJppx4wE1s+zmNoIBNLdOt8cIjzut8XAKq3A0NAIY/QNveFEyi8DA8kZJZjlGALQWPVSSGfNYJjVvujIJeaxItuMyo6JVzoJ9VxwRmtUCIdDfNV3NJWam5j7HpPOY8BEYkwxySiLLP1AWkbK4oHzmXOVS9FFOSM3jhFR4WTNfRslcO54nSwJKcCD4RsnZmJJNFPXJEl8t88quOuc39fCrHalsGyWcnJL62apYNoq12UQ8DLEFjCMy+kKA7Jy1XQtPlRTVqx+Jx6zXOJI1JbH4jejg3T+KbswBzXnFlz9Tjes/V/3CjWEHDsL/OYNvdCE8Wu3kLUQEhy+ljh+brFFu)

</div>

:::tip
Cuando se usa en [plantillas en el DOM](/guide/essentials/component-basics#in-dom-template-parsing-caveats), debe ser referenciado como `<keep-alive>`.
:::

## Incluir / Excluir {#include-exclude}

Por defecto, `<KeepAlive>` almacenará en caché cualquier instancia de componente en su interior. Podemos personalizar este comportamiento a través de las props `include` y `exclude`. Ambas props pueden ser una cadena delimitada por comas, una `RegExp` o un array que contenga cualquiera de los dos tipos:

```vue-html
<!-- cadena delimitada por comas -->
<KeepAlive include="a,b">
  <component :is="view" />
</KeepAlive>

<!-- regex (usar v-bind) -->
<KeepAlive :include="/a|b/">
  <component :is="view" />
</KeepAlive>

<!-- Array (usar v-bind) -->
<KeepAlive :include="['a', 'b']">
  <component :is="view" />
</KeepAlive>
```

La coincidencia se comprueba con la opción [`name`](/api/options-misc#name) del componente, por lo que los componentes que necesiten ser almacenados en caché condicionalmente por `KeepAlive` deben declarar explícitamente una opción `name`.

:::tip
Desde la versión 3.2.34, un componente de archivo único que use `<script setup>` inferirá automáticamente su opción `name` basándose en el nombre del archivo, eliminando la necesidad de declarar el nombre manualmente.
:::

## Máximo de Instancias Almacenadas en Caché {#max-cached-instances}

Podemos limitar el número máximo de instancias de componente que pueden ser almacenadas en caché a través de la prop `max`. Cuando se especifica `max`, `<KeepAlive>` se comporta como una [caché LRU](<https://en.wikipedia.org/wiki/Cache_replacement_policies#Least_recently_used_(LRU)>): si el número de instancias almacenadas en caché está a punto de exceder el recuento máximo especificado, la instancia almacenada en caché menos recientemente accedida será destruida para dejar espacio a la nueva.

```vue-html
<KeepAlive :max="10">
  <component :is="activeComponent" />
</KeepAlive>
```

## Ciclo de Vida de una Instancia Almacenada en Caché {#lifecycle-of-cached-instance}

Cuando una instancia de componente se elimina del DOM pero forma parte de un árbol de componentes almacenado en caché por `<KeepAlive>`, pasa a un estado de **desactivado** en lugar de ser desmontada. Cuando una instancia de componente se inserta en el DOM como parte de un árbol en caché, es **activada**.

<div class="composition-api">

Un componente mantenido vivo puede registrar hooks de ciclo de vida para estos dos estados usando [`onActivated()`](/api/composition-api-lifecycle#onactivated) y [`onDeactivated()`](/api/composition-api-lifecycle#ondeactivated):

```vue
<script setup>
import { onActivated, onDeactivated } from 'vue'

onActivated(() => {
  // llamado en el montaje inicial
  // y cada vez que se reinserta desde la caché
})

onDeactivated(() => {
  // llamado cuando se elimina del DOM y se pone en la caché
  // y también cuando se desmonta
})
</script>
```

</div>
<div class="options-api">

Un componente mantenido vivo puede registrar hooks de ciclo de vida para estos dos estados usando los hooks [`activated`](/api/options-lifecycle#activated) y [`deactivated`](/api/options-lifecycle#deactivated):

```js
export default {
  activated() {
    // llamado en el montaje inicial
    // y cada vez que se reinserta desde la caché
  },
  deactivated() {
    // llamado cuando se elimina del DOM y se pone en la caché
    // y también cuando se desmonta
  }
}
```

</div>

Ten en cuenta que:

- <span class="composition-api">`onActivated`</span><span class="options-api">`activated`</span> también se llama en el montaje, y <span class="composition-api">`onDeactivated`</span><span class="options-api">`deactivated`</span> en el desmontaje.

- Ambos hooks funcionan no solo para el componente raíz almacenado en caché por `<KeepAlive>`, sino también para los componentes descendientes en el árbol en caché.

---

**Relacionado**

- [Referencia de la API de `<KeepAlive>`](/api/built-in-components#keepalive)
