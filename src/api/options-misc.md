# Opciones: Miscelánea {#options-misc}

## name {#name}

Declara explícitamente un nombre de visualización para el componente.

- **Tipo**

  ```ts
  interface ComponentOptions {
    name?: string
  }
  ```

- **Detalles**

  El nombre de un componente se utiliza para lo siguiente:

  - Autorreferencia recursiva en la propia plantilla del componente
  - Visualización en el árbol de inspección de componentes de Vue DevTools
  - Visualización en trazas de advertencia de componentes

  Cuando usas Componentes de Archivo Único (SFC), el componente ya infiere su propio nombre a partir del nombre del archivo. Por ejemplo, un archivo llamado `MyComponent.vue` tendrá el nombre de visualización inferido "MyComponent".

  Otro caso es que cuando un componente se registra globalmente con [`app.component`](/api/application#app-component), el ID global se establece automáticamente como su nombre.

  La opción `name` te permite anular el nombre inferido, o proporcionar explícitamente un nombre cuando no se puede inferir ninguno (por ejemplo, cuando no se utilizan herramientas de construcción, o un componente en línea que no es SFC).

  Hay un caso en el que `name` es explícitamente necesario: al hacer coincidir componentes cacheables en [`<KeepAlive>`](/guide/built-ins/keep-alive) a través de sus `props` `include / exclude`.

  :::tip
  Desde la versión 3.2.34, un componente de archivo único que utiliza `<script setup>` inferirá automáticamente su opción `name` basándose en el nombre del archivo, eliminando la necesidad de declarar manualmente el nombre incluso cuando se usa con `<KeepAlive>`.
  :::

## inheritAttrs {#inheritattrs}

Controla si el comportamiento predeterminado de traspaso de atributos del componente debe estar habilitado.

- **Tipo**

  ```ts
  interface ComponentOptions {
    inheritAttrs?: boolean // default: true
  }
  ```

- **Detalles**

  Por defecto, los enlaces de atributos del ámbito padre que no se reconocen como `props` se "traspasarán". Esto significa que cuando tenemos un componente de raíz única, estos enlaces se aplicarán al elemento raíz del componente hijo como atributos HTML normales. Al crear un componente que envuelve un elemento objetivo u otro componente, esto no siempre es el comportamiento deseado. Al establecer `inheritAttrs` en `false`, este comportamiento predeterminado puede deshabilitarse. Los atributos están disponibles a través de la propiedad de instancia `$attrs` y se pueden vincular explícitamente a un elemento no raíz utilizando `v-bind`.

- **Ejemplo**

  <div class="options-api">

  ```vue
  <script>
  export default {
    inheritAttrs: false,
    props: ['label', 'value'],
    emits: ['input']
  }
  </script>

  <template>
    <label>
      {{ label }}
      <input
        v-bind="$attrs"
        v-bind:value="value"
        v-on:input="$emit('input', $event.target.value)"
      />
    </label>
  </template>
  ```

  </div>
  <div class="composition-api">

  Al declarar esta opción en un componente que utiliza `<script setup>`, puedes usar la macro [`defineOptions`](/api/sfc-script-setup#defineoptions):

  ```vue
  <script setup>
  defineProps(['label', 'value'])
  defineEmits(['input'])
  defineOptions({
    inheritAttrs: false
  })
  </script>

  <template>
    <label>
      {{ label }}
      <input
        v-bind="$attrs"
        v-bind:value="value"
        v-on:input="$emit('input', $event.target.value)"
      />
    </label>
  </template>
  ```

  </div>

- **Ver también**

  - [Atributos de Traspaso](/guide/components/attrs)
  <div class="composition-api">

  - [Uso de `inheritAttrs` en `<script>` normal](/api/sfc-script-setup.html#usage-alongside-normal-script)
  </div>

## components {#components}

Un objeto que registra componentes para que estén disponibles en la instancia del componente.

- **Tipo**

  ```ts
  interface ComponentOptions {
    components?: { [key: string]: Component }
  }
  ```

- **Ejemplo**

  ```js
  import Foo from './Foo.vue'
  import Bar from './Bar.vue'

  export default {
    components: {
      // abreviatura
      Foo,
      // registrar bajo un nombre diferente
      RenamedBar: Bar
    }
  }
  ```

- **Ver también** [Registro de Componentes](/guide/components/registration)

## directives {#directives}

Un objeto que registra directivas para que estén disponibles en la instancia del componente.

- **Tipo**

  ```ts
  interface ComponentOptions {
    directives?: { [key: string]: Directive }
  }
  ```

- **Ejemplo**

  ```js
  export default {
    directives: {
      // habilita v-focus en la plantilla
      focus: {
        mounted(el) {
          el.focus()
        }
      }
    }
  }
  ```

  ```vue-html
  <input v-focus>
  ```

- **Ver también** [Directivas Personalizadas](/guide/reusability/custom-directives)