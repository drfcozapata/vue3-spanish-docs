---
pageClass: api
---

# Componentes Integrados {#built-in-components}

:::info Registro y Uso
Los componentes integrados se pueden usar directamente en las plantillas sin necesidad de ser registrados. También son "tree-shakeable": solo se incluyen en la construcción cuando se usan.

Cuando se usan en [funciones de renderizado](/guide/extras/render-function), deben importarse explícitamente. Por ejemplo:

```js
import { h, Transition } from 'vue'

h(Transition, {
  /* props */
})
```

:::

## `<Transition>` {#transition}

Proporciona efectos de transición animados a un **único** elemento o componente.

- **Props**

  ```ts
  interface TransitionProps {
    /**
     * Se utiliza para generar automáticamente nombres de clase CSS de transición.
     * Por ejemplo, `name: 'fade'` se expandirá automáticamente a `.fade-enter`,
     * `.fade-enter-active`, etc.
     */
    name?: string
    /**
     * Si se deben aplicar las clases CSS de transición.
     * Predeterminado: true
     */
    css?: boolean
    /**
     * Especifica el tipo de eventos de transición a esperar para
     * determinar el momento de finalización de la transición.
     * El comportamiento predeterminado es la detección automática del tipo que
     * tiene una duración más larga.
     */
    type?: 'transition' | 'animation'
    /**
     * Especifica duraciones explícitas de la transición.
     * El comportamiento predeterminado es esperar el primer evento `transitionend`
     * o `animationend` en el elemento raíz de la transición.
     */
    duration?: number | { enter: number; leave: number }
    /**
     * Controla la secuencia de tiempo de las transiciones de salida/entrada.
     * El comportamiento predeterminado es simultáneo.
     */
    mode?: 'in-out' | 'out-in' | 'default'
    /**
     * Si se debe aplicar la transición en el renderizado inicial.
     * Predeterminado: false
     */
    appear?: boolean

    /**
     * Props para personalizar las clases de transición.
     * Usa kebab-case en las plantillas, por ejemplo, enter-from-class="xxx"
     */
    enterFromClass?: string
    enterActiveClass?: string
    enterToClass?: string
    appearFromClass?: string
    appearActiveClass?: string
    appearToClass?: string
    leaveFromClass?: string
    leaveActiveClass?: string
    leaveToClass?: string
  }
  ```

- **Eventos**

  - `@before-enter`
  - `@before-leave`
  - `@enter`
  - `@leave`
  - `@appear`
  - `@after-enter`
  - `@after-leave`
  - `@after-appear`
  - `@enter-cancelled`
  - `@leave-cancelled` (solo para `v-show`)
  - `@appear-cancelled`

- **Ejemplo**

  Elemento simple:

  ```vue-html
  <Transition>
    <div v-if="ok">toggled content</div>
  </Transition>
  ```

  Forzando una transición cambiando el atributo `key`:

  ```vue-html
  <Transition>
    <div :key="text">{{ text }}</div>
  </Transition>
  ```

  Componente dinámico, con modo de transición + animar al aparecer:

  ```vue-html
  <Transition name="fade" mode="out-in" appear>
    <component :is="view"></component>
  </Transition>
  ```

  Escuchando los eventos de transición:

  ```vue-html
  <Transition @after-enter="onTransitionComplete">
    <div v-show="ok">toggled content</div>
  </Transition>
  ```

- **Ver también** [Guía - Transition](/guide/built-ins/transition)

## `<TransitionGroup>` {#transitiongroup}

Proporciona efectos de transición para **múltiples** elementos o componentes en una lista.

- **Props**

  `<TransitionGroup>` acepta las mismas `props` que `<Transition>` excepto `mode`, además de dos `props` adicionales:

  ```ts
  interface TransitionGroupProps extends Omit<TransitionProps, 'mode'> {
    /**
     * Si no se define, se renderiza como un fragmento.
     */
    tag?: string
    /**
     * Para personalizar la clase CSS aplicada durante las transiciones de movimiento.
     * Usa kebab-case en las plantillas, por ejemplo, move-class="xxx"
     */
    moveClass?: string
  }
  ```

- **Eventos**

  `<TransitionGroup>` emite los mismos eventos que `<Transition>`.

- **Detalles**

  Por defecto, `<TransitionGroup>` no renderiza un elemento DOM contenedor, pero se puede definir uno a través de la `prop` `tag`.

  Ten en cuenta que cada hijo en un `<transition-group>` debe tener una [**clave única**](/guide/essentials/list#maintaining-state-with-key) para que las animaciones funcionen correctamente.

  `<TransitionGroup>` soporta transiciones de movimiento a través de `transform` de CSS. Cuando la posición de un hijo en la pantalla ha cambiado después de una actualización, se le aplicará una clase CSS de movimiento (generada automáticamente a partir del atributo `name` o configurada con la `prop` `move-class`). Si la propiedad `transform` de CSS es "transicionable" cuando se aplica la clase de movimiento, el elemento se animará suavemente a su destino utilizando la [técnica FLIP](https://aerotwist.com/blog/flip-your-animations/).

- **Ejemplo**

  ```vue-html
  <TransitionGroup tag="ul" name="slide">
    <li v-for="item in items" :key="item.id">
      {{ item.text }}
    </li>
  </TransitionGroup>
  ```

- **Ver también** [Guía - TransitionGroup](/guide/built-ins/transition-group)

## `<KeepAlive>` {#keepalive}

Almacena en caché los componentes alternados dinámicamente que están envueltos en su interior.

- **Props**

  ```ts
  interface KeepAliveProps {
    /**
     * Si se especifica, solo los componentes cuyos nombres coincidan con
     * `include` serán almacenados en caché.
     */
    include?: MatchPattern
    /**
     * Cualquier componente con un nombre que coincida con `exclude`
     * no será almacenado en caché.
     */
    exclude?: MatchPattern
    /**
     * El número máximo de instancias de componentes a almacenar en caché.
     */
    max?: number | string
  }

  type MatchPattern = string | RegExp | (string | RegExp)[]
  ```

- **Detalles**

  Cuando se envuelve alrededor de un componente dinámico, `<KeepAlive>` almacena en caché las instancias de componentes inactivos sin destruirlos.

  Solo puede haber una instancia de componente activa como hijo directo de `<KeepAlive>` en cualquier momento.

  Cuando un componente se alterna dentro de `<KeepAlive>`, sus hooks de ciclo de vida `activated` y `deactivated` serán invocados de acuerdo, proporcionando una alternativa a `mounted` y `unmounted`, los cuales no son llamados. Esto se aplica tanto al hijo directo de `<KeepAlive>` como a todos sus descendientes.

- **Ejemplo**

  Uso básico:

  ```vue-html
  <KeepAlive>
    <component :is="view"></component>
  </KeepAlive>
  ```

  Cuando se usa con ramas `v-if` / `v-else`, solo debe haber un componente renderizado a la vez:

  ```vue-html
  <KeepAlive>
    <comp-a v-if="a > 1"></comp-a>
    <comp-b v-else></comp-b>
  </KeepAlive>
  ```

  Usado junto con `<Transition>`:

  ```vue-html
  <Transition>
    <KeepAlive>
      <component :is="view"></component>
    </KeepAlive>
  </Transition>
  ```

  Usando `include` / `exclude`:

  ```vue-html
  <!-- cadena delimitada por comas -->
  <KeepAlive include="a,b">
    <component :is="view"></component>
  </KeepAlive>

  <!-- regex (usar `v-bind`) -->
  <KeepAlive :include="/a|b/">
    <component :is="view"></component>
  </KeepAlive>

  <!-- Array (usar `v-bind`) -->
  <KeepAlive :include="['a', 'b']">
    <component :is="view"></component>
  </KeepAlive>
  ```

  Uso con `max`:

  ```vue-html
  <KeepAlive :max="10">
    <component :is="view"></component>
  </KeepAlive>
  ```

- **Ver también** [Guía - KeepAlive](/guide/built-ins/keep-alive)

## `<Teleport>` {#teleport}

Renderiza el contenido de su `slot` en otra parte del DOM.

- **Props**

  ```ts
  interface TeleportProps {
    /**
     * Requerido. Especifica el contenedor de destino.
     * Puede ser un selector o un elemento real.
     */
    to: string | HTMLElement
    /**
     * Cuando es `true`, el contenido permanecerá en su ubicación
     * original en lugar de ser movido al contenedor de destino.
     * Se puede cambiar dinámicamente.
     */
    disabled?: boolean
    /**
     * Cuando es `true`, el Teleport se pospondrá hasta que otras
     * partes de la aplicación se hayan mounted antes de
     * resolver su destino. (3.5+)
     */
    defer?: boolean
  }
  ```

- **Ejemplo**

  Especificando el contenedor de destino:

  ```vue-html
  <Teleport to="#some-id" />
  <Teleport to=".some-class" />
  <Teleport to="[data-teleport]" />
  ```

  Deshabilitando condicionalmente:

  ```vue-html
  <Teleport to="#popup" :disabled="displayVideoInline">
    <video src="./my-movie.mp4">
  </Teleport>
  ```

  Posponer la resolución del destino <sup class="vt-badge" data-text="3.5+" />:

  ```vue-html
  <Teleport defer to="#late-div">...</Teleport>

  <!-- en algún lugar más adelante en la plantilla -->
  <div id="late-div"></div>
  ```

- **Ver también** [Guía - Teleport](/guide/built-ins/teleport)

## `<Suspense>` <sup class="vt-badge experimental" /> {#suspense}

Utilizado para orquestar dependencias asíncronas anidadas en un árbol de componentes.

- **Props**

  ```ts
  interface SuspenseProps {
    timeout?: string | number
    suspensible?: boolean
  }
  ```

- **Eventos**

  - `@resolve`
  - `@pending`
  - `@fallback`

- **Detalles**

  `<Suspense>` acepta dos `slots`: el `slot` `#default` y el `slot` `#fallback`. Mostrará el contenido del `slot` `fallback` mientras renderiza el `slot` `default` en memoria.

  Si encuentra dependencias asíncronas ([Componentes Asíncronos](/guide/components/async) y componentes con [`async setup()`](/guide/built-ins/suspense#async-setup)) mientras renderiza el `slot` `default`, esperará hasta que todas se resuelvan antes de mostrar el `slot` `default`.

  Al configurar el Suspense como `suspensible`, todo el manejo de dependencias asíncronas será gestionado por el Suspense padre. Ver [detalles de implementación](https://github.com/vuejs/core/pull/6736)

- **Ver también** [Guía - Suspense](/guide/built-ins/suspense)
