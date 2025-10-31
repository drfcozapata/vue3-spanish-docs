# API de Elementos Personalizados {#custom-elements-api}

## defineCustomElement() {#definecustomelement}

Este método acepta el mismo argumento que [`defineComponent`](#definecomponent), pero en su lugar devuelve un constructor de clase nativo de [Elemento Personalizado](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements).

- **Tipo**

  ```ts
  function defineCustomElement(
    component:
      | (ComponentOptions & CustomElementsOptions)
      | ComponentOptions['setup'],
    options?: CustomElementsOptions
  ): {
    new (props?: object): HTMLElement
  }

  interface CustomElementsOptions {
    styles?: string[]

    // the following options are 3.5+
    configureApp?: (app: App) => void
    shadowRoot?: boolean
    nonce?: string
  }
  ```

  > El tipo se ha simplificado para mayor legibilidad.

- **Detalles**

  Además de las opciones normales de componente, `defineCustomElement()` también admite una serie de opciones específicas para elementos personalizados:

  - **`styles`**: un array de cadenas CSS en línea para proporcionar CSS que debe inyectarse en el shadow root del elemento.

  - **`configureApp`** <sup class="vt-badge" data-text="3.5+"/>: una función que puede usarse para configurar la instancia de la aplicación Vue para el elemento personalizado.

  - **`shadowRoot`** <sup class="vt-badge" data-text="3.5+"/>: `boolean`, por defecto es `true`. Establécelo a `false` para renderizar el elemento personalizado sin un shadow root. Esto significa que las etiquetas `<style>` en SFCs de elementos personalizados ya no estarán encapsuladas.

  - **`nonce`** <sup class="vt-badge" data-text="3.5+"/>: `string`, si se proporciona, se establecerá como el atributo `nonce` en las etiquetas `style` inyectadas en el shadow root.

  Ten en cuenta que, en lugar de pasarse como parte del componente mismo, estas opciones también pueden pasarse a través de un segundo argumento:

  ```js
  import Element from './MyElement.ce.vue'

  defineCustomElement(Element, {
    configureApp(app) {
      // ...
    }
  })
  ```

  El valor de retorno es un constructor de elemento personalizado que puede registrarse usando [`customElements.define()`](https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry/define).

- **Ejemplo**

  ```js
  import { defineCustomElement } from 'vue'

  const MyVueElement = defineCustomElement({
    /* component options */
  })

  // Registra el elemento personalizado.
  customElements.define('my-vue-element', MyVueElement)
  ```

- **Véase también**

  - [Guía - Construyendo Elementos Personalizados con Vue](/guide/extras/web-components#building-custom-elements-with-vue)

  - Ten también en cuenta que `defineCustomElement()` requiere [configuración especial](/guide/extras/web-components#sfc-as-custom-element) cuando se usa con Componentes de Archivo Único.

## useHost() <sup class="vt-badge" data-text="3.5+"/> {#usehost}

Un asistente de Composition API que devuelve el elemento anfitrión del elemento personalizado de Vue actual.

## useShadowRoot() <sup class="vt-badge" data-text="3.5+"/> {#useshadowroot}

Un asistente de Composition API que devuelve el shadow root del elemento personalizado de Vue actual.

## this.$host <sup class="vt-badge" data-text="3.5+"/> {#this-host}

Una propiedad de Options API que expone el elemento anfitrión del elemento personalizado de Vue actual.