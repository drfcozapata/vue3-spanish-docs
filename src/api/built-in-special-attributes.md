# Atributos Especiales Integrados {#built-in-special-attributes}

## key {#key}

El atributo especial `key` se utiliza principalmente como una pista para el algoritmo del DOM virtual de Vue para identificar los `vnodes` al diferenciar la nueva lista de nodos de la lista antigua.

-   **Espera:** `number | string | symbol`

-   **Detalles**

    Sin claves, Vue utiliza un algoritmo que minimiza el movimiento de elementos y trata de parchear/reutilizar elementos del mismo tipo en su lugar tanto como sea posible. Con claves, reordenará los elementos basándose en el cambio de orden de las claves, y los elementos con claves que ya no estén presentes siempre serán eliminados / destruidos.

    Los hijos de un mismo padre común deben tener **claves únicas**. Las claves duplicadas causarán errores de renderizado.

    El caso de uso más común se combina con `v-for`:

    ```vue-html
    <ul>
      <li v-for="item in items" :key="item.id">...</li>
    </ul>
    ```

    También se puede utilizar para forzar el reemplazo de un elemento/componente en lugar de reutilizarlo. Esto puede ser útil cuando deseas:

    -   Activar correctamente los hooks del ciclo de vida de un componente
    -   Activar transiciones

    Por ejemplo:

    ```vue-html
    <transition>
      <span :key="text">{{ text }}</span>
    </transition>
    ```

    Cuando `text` cambia, el `<span>` siempre será reemplazado en lugar de parcheado, por lo que se activará una transición.

-   **Ver también** [Guía - Renderizado de Listas - Mantener el estado con `key`](/guide/essentials/list#maintaining-state-with-key)

## ref {#ref}

Denota una [referencia de plantilla](/guide/essentials/template-refs).

-   **Espera:** `string | Function`

-   **Detalles**

    `ref` se utiliza para registrar una referencia a un elemento o a un componente hijo.

    En la Options API, la referencia se registrará bajo el objeto `this.$refs` del componente:

    ```vue-html
    <!-- stored as this.$refs.p -->
    <p ref="p">hello</p>
    ```

    En la Composition API, la referencia se almacenará en un `ref` con un nombre coincidente:

    ```vue
    <script setup>
    import { useTemplateRef } from 'vue'

    const pRef = useTemplateRef('p')
    </script>

    <template>
      <p ref="p">hello</p>
    </template>
    ```

    Si se utiliza en un elemento DOM simple, la referencia será ese elemento; si se utiliza en un componente hijo, la referencia será la instancia del componente hijo.

    Alternativamente, `ref` puede aceptar un valor de función que proporciona control total sobre dónde almacenar la referencia:

    ```vue-html
    <ChildComponent :ref="(el) => child = el" />
    ```

    Una nota importante sobre el momento del registro de `ref`: debido a que las propias referencias se crean como resultado de la función de renderizado, debes esperar hasta que el componente esté montado antes de acceder a ellas.

    `this.$refs` tampoco es reactivo, por lo tanto, no debes intentar usarlo en plantillas para el enlace de datos.

-   **Ver también**
    -   [Guía - Referencias de Plantilla](/guide/essentials/template-refs)
    -   [Guía - Tipado de Referencias de Plantilla](/guide/typescript/composition-api#typing-template-refs) <sup class="vt-badge ts" />
    -   [Guía - Tipado de Referencias de Plantilla de Componentes](/guide/typescript/composition-api#typing-component-template-refs) <sup class="vt-badge ts" />

## is {#is}

Se utiliza para enlazar [componentes dinámicos](/guide/essentials/component-basics#dynamic-components).

-   **Espera:** `string | Component`

-   **Uso en elementos nativos**

    -   Solo compatible en 3.1+

    Cuando el atributo `is` se utiliza en un elemento HTML nativo, se interpretará como un [elemento integrado personalizado](https://html.spec.whatwg.org/multipage/custom-elements.html#custom-elements-customized-builtin-example), que es una característica nativa de la plataforma web.

    Existe, sin embargo, un caso de uso en el que es posible que necesites que Vue reemplace un elemento nativo con un componente de Vue, como se explica en [Consideraciones sobre el análisis de plantillas en el DOM](/guide/essentials/component-basics#in-dom-template-parsing-caveats). Puedes prefijar el valor del atributo `is` con `vue:` para que Vue renderice el elemento como un componente de Vue en su lugar:

    ```vue-html
    <table>
      <tr is="vue:my-row-component"></tr>
    </table>
    ```

-   **Ver también**

    -   [Elemento Especial Integrado - `<component>`](/api/built-in-special-elements#component)
    -   [Componentes Dinámicos](/guide/essentials/component-basics#dynamic-components)