# Registro de Componentes {#component-registration}

> Esta página asume que ya has leído los [Fundamentos de Componentes](/guide/essentials/component-basics). Léelo primero si eres nuevo en los componentes.

<VueSchoolLink href="https://vueschool.io/lessons/vue-3-global-vs-local-vue-components" title="Lección Gratuita de Registro de Componentes Vue.js"/>

Un componente Vue necesita ser "registrado" para que Vue sepa dónde localizar su implementación cuando se encuentre en una plantilla. Hay dos maneras de registrar componentes: global y local.

## Registro Global {#global-registration}

Podemos hacer que los componentes estén disponibles globalmente en la [aplicación Vue](/guide/essentials/application) actual usando el método `.component()`:

```js
import { createApp } from 'vue'

const app = createApp({})

app.component(
  // the registered name
  'MyComponent',
  // the implementation
  {
    /* ... */
  }
)
```

Si usas SFCs, registrarás los archivos `.vue` importados:

```js
import MyComponent from './App.vue'

app.component('MyComponent', MyComponent)
```

El método `.component()` puede encadenarse:

```js
app
  .component('ComponentA', ComponentA)
  .component('ComponentB', ComponentB)
  .component('ComponentC', ComponentC)
```

Los componentes registrados globalmente pueden usarse en la plantilla de cualquier componente dentro de esta aplicación:

```vue-html
<!-- this will work in any component inside the app -->
<ComponentA/>
<ComponentB/>
<ComponentC/>
```

Esto incluso se aplica a todos los subcomponentes, lo que significa que los tres componentes también estarán disponibles _dentro el uno del otro_.

## Registro Local {#local-registration}

Aunque es conveniente, el registro global tiene algunos inconvenientes:

1.  El registro global evita que los sistemas de construcción eliminen componentes no utilizados (también conocido como "tree-shaking"). Si registras globalmente un componente pero finalmente no lo usas en ninguna parte de tu aplicación, este se incluirá igualmente en el bundle final.

2.  El registro global hace que las relaciones de dependencia sean menos explícitas en aplicaciones grandes. Dificulta la localización de la implementación de un componente hijo desde un componente padre que lo utiliza. Esto puede afectar la mantenibilidad a largo plazo, de forma similar al uso de demasiadas variables globales.

El registro local limita la disponibilidad de los componentes registrados solo al componente actual. Esto hace que la relación de dependencia sea más explícita y es más amigable con el tree-shaking.

<div class="composition-api">

Cuando se usa SFC con `<script setup>`, los componentes importados pueden usarse localmente sin registro:

```vue
<script setup>
import ComponentA from './ComponentA.vue'
</script>

<template>
  <ComponentA />
</template>
```

En entornos sin `<script setup>`, necesitarás usar la opción `components`:

```js
import ComponentA from './ComponentA.js'

export default {
  components: {
    ComponentA
  },
  setup() {
    // ...
  }
}
```

</div>
<div class="options-api">

El registro local se realiza usando la opción `components`:

```vue
<script>
import ComponentA from './ComponentA.vue'

export default {
  components: {
    ComponentA
  }
}
</script>

<template>
  <ComponentA />
</template>
```

</div>

Para cada propiedad en el objeto `components`, la clave será el nombre registrado del componente, mientras que el valor contendrá la implementación del componente. El ejemplo anterior usa la sintaxis abreviada de propiedades de ES2015 y es equivalente a:

```js
export default {
  components: {
    ComponentA: ComponentA
  }
  // ...
}
```

Ten en cuenta que **los componentes registrados localmente _no_ están disponibles también en los componentes descendientes**. En este caso, `ComponentA` estará disponible solo para el componente actual, no para ninguno de sus componentes hijos o descendientes.

## Convención de Nombres de Componentes {#component-name-casing}

A lo largo de la guía, estamos usando nombres PascalCase al registrar componentes. Esto se debe a que:

1.  Los nombres PascalCase son identificadores JavaScript válidos. Esto facilita la importación y el registro de componentes en JavaScript. También ayuda a los IDEs con el autocompletado.

2.  `<PascalCase />` hace más obvio que se trata de un componente Vue en lugar de un elemento HTML nativo en las plantillas. También diferencia los componentes Vue de los elementos personalizados (web components).

Este es el estilo recomendado cuando se trabaja con SFC o plantillas de cadena. Sin embargo, como se discute en [Advertencias de Análisis de Plantillas en el DOM](/guide/essentials/component-basics#in-dom-template-parsing-caveats), las etiquetas PascalCase no son utilizables en plantillas en el DOM.

Afortunadamente, Vue admite la resolución de etiquetas kebab-case a componentes registrados usando PascalCase. Esto significa que un componente registrado como `MyComponent` puede ser referenciado dentro de una plantilla Vue (o dentro de un elemento HTML renderizado por Vue) tanto a través de `<MyComponent>` como de `<my-component>`. Esto nos permite usar el mismo código de registro de componentes JavaScript independientemente de la fuente de la plantilla.