# Teleport {#teleport}

 <VueSchoolLink href="https://vueschool.io/lessons/vue-3-teleport" title="Lección gratuita de Teleport en Vue.js"/>

`<Teleport>` es un componente integrado que nos permite "teletransportar" una parte de la plantilla de un componente a un nodo del DOM que existe fuera de la jerarquía del DOM de ese componente.

## Uso Básico {#basic-usage}

A veces, una parte de la plantilla de un componente le pertenece lógicamente, pero desde un punto de vista visual, debería mostrarse en otro lugar del DOM, quizás incluso fuera de la aplicación de Vue.

El ejemplo más común de esto es al construir un modal de pantalla completa. Idealmente, queremos que el código para el botón del modal y el propio modal estén escritos dentro del mismo componente de archivo único, ya que ambos están relacionados con el estado de abierto/cerrado del modal. Pero eso significa que el modal se renderizará junto al botón, profundamente anidado en la jerarquía del DOM de la aplicación. Esto puede crear algunos problemas complicados al posicionar el modal mediante CSS.

Considera la siguiente estructura HTML.

```vue-html
<div class="outer">
  <h3>Vue Teleport Example</h3>
  <div>
    <MyModal />
  </div>
</div>
```

Y aquí está la implementación de `<MyModal>`:

<div class="composition-api">

```vue
<script setup>
import { ref } from 'vue'

const open = ref(false)
</script>

<template>
  <button @click="open = true">Open Modal</button>

  <div v-if="open" class="modal">
    <p>Hello from the modal!</p>
    <button @click="open = false">Close</button>
  </div>
</template>

<style scoped>
.modal {
  position: fixed;
  z-index: 999;
  top: 20%;
  left: 50%;
  width: 300px;
  margin-left: -150px;
}
</style>
```

</div>
<div class="options-api">

```vue
<script>
export default {
  data() {
    return {
      open: false
    }
  }
}
</script>

<template>
  <button @click="open = true">Open Modal</button>

  <div v-if="open" class="modal">
    <p>Hello from the modal!</p>
    <button @click="open = false">Close</button>
  </div>
</template>

<style scoped>
.modal {
  position: fixed;
  z-index: 999;
  top: 20%;
  left: 50%;
  width: 300px;
  margin-left: -150px;
}
</style>
```

</div>

El componente contiene un `<button>` para activar la apertura del modal, y un `<div>` con una `class` de `.modal`, que contendrá el contenido del modal y un botón para autocerrarse.

Al usar este componente dentro de la estructura HTML inicial, existen varios problemas potenciales:

- `position: fixed` solo posiciona el elemento relativo a la ventana gráfica cuando ningún elemento ancestro tiene la propiedad `transform`, `perspective` o `filter` establecida. Si, por ejemplo, intentamos animar el ancestro `<div class="outer">` con una transformación CSS, ¡rompería el diseño del modal!

- El `z-index` del modal está restringido por sus elementos contenedores. Si hay otro elemento que se superpone con `<div class="outer">` y tiene un `z-index` más alto, cubriría nuestro modal.

`<Teleport>` proporciona una manera limpia de solucionar estos problemas, permitiéndonos salir de la estructura del DOM anidada. Modifiquemos `<MyModal>` para usar `<Teleport>`:

```vue-html{3,8}
<button @click="open = true">Open Modal</button>

<Teleport to="body">
  <div v-if="open" class="modal">
    <p>Hello from the modal!</p>
    <button @click="open = false">Close</button>
  </div>
</Teleport>
```

El objetivo `to` de `<Teleport>` espera una cadena de selector CSS o un nodo del DOM real. Aquí, esencialmente le estamos diciendo a Vue que "**teletransporte** este fragmento de plantilla **a** la etiqueta **`body`**".

Puedes hacer clic en el botón de abajo e inspeccionar la etiqueta `<body>` a través de las herramientas de desarrollo de tu navegador:

<script setup>
import { ref } from 'vue'
const open = ref(false)
</script>

<div class="demo">
  <button @click="open = true">Abrir Modal</button>
  <ClientOnly>
    <Teleport to="body">
      <div v-if="open" class="demo modal-demo">
        <p style="margin-bottom:20px">¡Hola desde el modal!</p>
        <button @click="open = false">Cerrar</button>
      </div>
    </Teleport>
  </ClientOnly>
</div>

<style>
.modal-demo {
  position: fixed;
  z-index: 999;
  top: 20%;
  left: 50%;
  width: 300px;
  margin-left: -150px;
  background-color: var(--vt-c-bg);
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}
</style>

Puedes combinar `<Teleport>` con [`<Transition>`](./transition) para crear modales animados - consulta el [Ejemplo aquí](/examples/#modal).

:::tip
El objetivo `to` de `<Teleport>` debe estar ya en el DOM cuando el componente `<Teleport>` se monta. Idealmente, este debería ser un elemento fuera de toda la aplicación de Vue. Si apuntas a otro elemento renderizado por Vue, debes asegurarte de que ese elemento esté montado antes que el `<Teleport>`.
:::

## Uso con Componentes {#using-with-components}

`<Teleport>` solo altera la estructura del DOM renderizada; no afecta la jerarquía lógica de los componentes. Es decir, si `<Teleport>` contiene un componente, ese componente seguirá siendo un hijo lógico del componente padre que contiene el `<Teleport>`. El paso de `props` y la emisión de eventos seguirán funcionando de la misma manera.

Esto también significa que las inyecciones de un componente padre funcionan como se espera, y que el componente hijo estará anidado debajo del componente padre en las Vue Devtools, en lugar de ser colocado donde se movió el contenido real.

## Desactivar Teleport {#disabling-teleport}

En algunos casos, es posible que queramos desactivar condicionalmente `<Teleport>`. Por ejemplo, podríamos querer renderizar un componente como una superposición para escritorio, pero en línea en móvil. `<Teleport>` soporta la `prop` `disabled`, que puede activarse/desactivarse dinámicamente:

```vue-html
<Teleport :disabled="isMobile">
  ...
</Teleport>
```

Podríamos entonces actualizar dinámicamente `isMobile`.

## Múltiples Teleports en el Mismo Objetivo {#multiple-teleports-on-the-same-target}

Un caso de uso común sería un componente `<Modal>` reutilizable, con el potencial de tener múltiples instancias activas al mismo tiempo. Para este tipo de escenario, múltiples componentes `<Teleport>` pueden montar su contenido en el mismo elemento objetivo. El orden será un simple añadido, con los montajes posteriores ubicados después de los anteriores, pero todos dentro del elemento objetivo.

Dado el siguiente uso:

```vue-html
<Teleport to="#modals">
  <div>A</div>
</Teleport>
<Teleport to="#modals">
  <div>B</div>
</Teleport>
```

El resultado renderizado sería:

```html
<div id="modals">
  <div>A</div>
  <div>B</div>
</div>
```

## Teleport Diferido <sup class="vt-badge" data-text="3.5+" /> {#deferred-teleport}

En Vue 3.5 y superior, podemos usar la `prop` `defer` para diferir la resolución del objetivo de un Teleport hasta que otras partes de la aplicación se hayan montado. Esto permite que el Teleport apunte a un elemento contenedor que es renderizado por Vue, pero en una parte posterior del árbol de componentes:

```vue-html
<Teleport defer to="#late-div">...</Teleport>

<!-- en algún lugar más tarde en la plantilla -->
<div id="late-div"></div>
```

Ten en cuenta que el elemento objetivo debe renderizarse en el mismo ciclo de montaje / actualización que el Teleport; es decir, si el `<div>` se monta solo un segundo después, el Teleport seguirá reportando un error. El `defer` funciona de manera similar al hook del ciclo de vida `mounted`.

---

**Relacionado**

- [`<Teleport>` referencia de la API](/api/built-in-components#teleport)
- [Manejo de Teleports en SSR](/guide/scaling-up/ssr#teleports)