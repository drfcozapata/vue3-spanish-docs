# Opciones: Composición {#options-composition}

## provide {#provide}

Proporciona valores que pueden ser inyectados por componentes descendientes.

- **Tipo**

  ```ts
  interface ComponentOptions {
    provide?: object | ((this: ComponentPublicInstance) => object)
  }
  ```

- **Detalles**

  `provide` y [`inject`](#inject) se utilizan juntos para permitir que un componente ancestro sirva como inyector de dependencias para todos sus descendientes, sin importar la profundidad de la jerarquía de componentes, siempre que estén en la misma cadena de padres.

  La opción `provide` debe ser un objeto o una función que devuelva un objeto. Este objeto contiene las propiedades que están disponibles para ser inyectadas en sus descendientes. Puedes usar Symbols como claves en este objeto.

- **Ejemplo**

  Uso básico:

  ```js
  const s = Symbol()

  export default {
    provide: {
      foo: 'foo',
      [s]: 'bar'
    }
  }
  ```

  Usando una función para proporcionar estado por componente:

  ```js
  export default {
    data() {
      return {
        msg: 'foo'
      }
    }
    provide() {
      return {
        msg: this.msg
      }
    }
  }
  ```

  Ten en cuenta que en el ejemplo anterior, el `msg` proporcionado NO será reactivo. Consulta [Trabajar con Reactividad](/guide/components/provide-inject#working-with-reactivity) para más detalles.

- **Consulta también** [Provide / Inject](/guide/components/provide-inject)

## inject {#inject}

Declara propiedades para inyectar en el componente actual, localizándolas desde los proveedores ancestros.

- **Tipo**

  ```ts
  interface ComponentOptions {
    inject?: ArrayInjectOptions | ObjectInjectOptions
  }

  type ArrayInjectOptions = string[]

  type ObjectInjectOptions = {
    [key: string | symbol]:
      | string
      | symbol
      | { from?: string | symbol; default?: any }
  }
  ```

- **Detalles**

  La opción `inject` debe ser:

  - Un array de cadenas, o
  - Un objeto donde las claves son el nombre de la vinculación local y el valor es:
    - La clave (cadena o Symbol) a buscar en las inyecciones disponibles, o
    - Un objeto donde:
      - La propiedad `from` es la clave (cadena o Symbol) a buscar en las inyecciones disponibles, y
      - La propiedad `default` se utiliza como valor de respaldo. Similar a los valores predeterminados de las `props`, se necesita una función de fábrica para los tipos de objeto para evitar compartir valores entre múltiples instancias de componentes.

  Una propiedad inyectada será `undefined` si no se proporcionó una propiedad coincidente ni un valor predeterminado.

  Ten en cuenta que las vinculaciones inyectadas NO son reactivas. Esto es intencional. Sin embargo, si el valor inyectado es un objeto reactivo, las propiedades de ese objeto sí permanecen reactivas. Consulta [Trabajar con Reactividad](/guide/components/provide-inject#working-with-reactivity) para más detalles.

- **Ejemplo**

  Uso básico:

  ```js
  export default {
    inject: ['foo'],
    created() {
      console.log(this.foo)
    }
  }
  ```

  Usando un valor inyectado como valor predeterminado para una `prop`:

  ```js
  const Child = {
    inject: ['foo'],
    props: {
      bar: {
        default() {
          return this.foo
        }
      }
    }
  }
  ```

  Usando un valor inyectado como entrada de datos:

  ```js
  const Child = {
    inject: ['foo'],
    data() {
      return {
        bar: this.foo
      }
    }
  }
  ```

  Las inyecciones pueden ser opcionales con un valor predeterminado:

  ```js
  const Child = {
    inject: {
      foo: { default: 'foo' }
    }
  }
  ```

  Si necesita ser inyectado desde una propiedad con un nombre diferente, usa `from` para denotar la propiedad de origen:

  ```js
  const Child = {
    inject: {
      foo: {
        from: 'bar',
        default: 'foo'
      }
    }
  }
  ```

  De forma similar a los valores predeterminados de las `prop`, necesitas usar una función de fábrica para valores no primitivos:

  ```js
  const Child = {
    inject: {
      foo: {
        from: 'bar',
        default: () => [1, 2, 3]
      }
    }
  }
  ```

- **Consulta también** [Provide / Inject](/guide/components/provide-inject)

## mixins {#mixins}

Un array de objetos de opciones para ser mezclados en el componente actual.

- **Tipo**

  ```ts
  interface ComponentOptions {
    mixins?: ComponentOptions[]
  }
  ```

- **Detalles**

  La opción `mixins` acepta un array de objetos `mixin`. Estos objetos `mixin` pueden contener opciones de instancia como los objetos de instancia normales, y se fusionarán con las opciones finales utilizando la lógica de fusión de opciones específica. Por ejemplo, si tu `mixin` contiene un `hook` `created` y el componente en sí también tiene uno, ambas funciones serán llamadas.

  Los `hooks` de `Mixin` se llaman en el orden en que se proporcionan, y se llaman antes de los `hooks` propios del componente.

  :::warning Ya no recomendado
  En Vue 2, los `mixins` eran el mecanismo principal para crear bloques reutilizables de lógica de componente. Aunque los `mixins` siguen siendo compatibles en Vue 3, las [funciones Composable usando la Composition API](/guide/reusability/composables) son ahora el enfoque preferido para la reutilización de código entre componentes.
  :::

- **Ejemplo**

  ```js
  const mixin = {
    created() {
      console.log(1)
    }
  }

  createApp({
    created() {
      console.log(2)
    },
    mixins: [mixin]
  })

  // => 1
  // => 2
  ```

## extends {#extends}

Un componente de "clase base" del que extender.

- **Tipo**

  ```ts
  interface ComponentOptions {
    extends?: ComponentOptions
  }
  ```

- **Detalles**

  Permite que un componente extienda a otro, heredando sus opciones de componente.

  Desde la perspectiva de la implementación, `extends` es casi idéntico a `mixins`. El componente especificado por `extends` será tratado como si fuera el primer `mixin`.

  Sin embargo, `extends` y `mixins` expresan intenciones diferentes. La opción `mixins` se utiliza principalmente para componer fragmentos de funcionalidad, mientras que `extends` se ocupa principalmente de la herencia.

  Al igual que con los `mixins`, cualquier opción (excepto `setup()`) se fusionará utilizando la estrategia de fusión relevante.

- **Ejemplo**

  ```js
  const CompA = { ... }

  const CompB = {
    extends: CompA,
    ...
  }
  ```

  :::warning No recomendado para Composition API
  `extends` está diseñado para la Options API y no maneja la fusión del `hook` `setup()`.

  En la Composition API, el modelo mental preferido para la reutilización de lógica es "componer" en lugar de "heredar". Si tienes lógica de un componente que necesita ser reutilizada en otro, considera extraer la lógica relevante en un [Composable](/guide/reusability/composables#composables).

  Si aún pretendes "extender" un componente usando la Composition API, puedes llamar al `setup()` del componente base en el `setup()` del componente que extiende:

  ```js
  import Base from './Base.js'
  export default {
    extends: Base,
    setup(props, ctx) {
      return {
        ...Base.setup(props, ctx),
        // local bindings
      }
    }
  }
  ```
  :::