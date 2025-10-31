# Reglas de Prioridad B: Altamente Recomendadas {#priority-b-rules-strongly-recommended}

::: warning Nota
Esta Guía de Estilo de Vue.js está desactualizada y necesita ser revisada. Si tienes alguna pregunta o sugerencia, por favor [abre una incidencia](https://github.com/vuejs/docs/issues/new).
:::

Se ha descubierto que estas reglas mejoran la legibilidad y/o la experiencia del desarrollador en la mayoría de los proyectos. Tu código seguirá funcionando si las incumples, pero las infracciones deben ser raras y bien justificadas.

## Archivos de componente {#component-files}

**Siempre que un sistema de compilación esté disponible para concatenar archivos, cada componente debe estar en su propio archivo.**

Esto te ayuda a encontrar más rápidamente un componente cuando necesitas editarlo o revisar cómo usarlo.

<div class="style-example style-example-bad">
<h3>Mal</h3>

```js
app.component('TodoList', {
  // ...
})

app.component('TodoItem', {
  // ...
})
```

</div>

<div class="style-example style-example-good">
<h3>Bien</h3>

```
components/
|- TodoList.js
|- TodoItem.js
```

```
components/
|- TodoList.vue
|- TodoItem.vue
```

</div>

## Nomenclatura de archivos de componente de un solo archivo (Single-File Component) {#single-file-component-filename-casing}

**Los nombres de archivo de los [Single-File Components](/guide/scaling-up/sfc) deben ser siempre PascalCase o siempre kebab-case.**

PascalCase funciona mejor con la función de autocompletado en los editores de código, ya que es consistente con la forma en que referenciamos los componentes en JS(X) y las plantillas, siempre que sea posible. Sin embargo, los nombres de archivo con mayúsculas y minúsculas mezcladas a veces pueden generar problemas en sistemas de archivos que no distinguen entre mayúsculas y minúsculas, por lo que kebab-case también es perfectamente aceptable.

<div class="style-example style-example-bad">
<h3>Mal</h3>

```
components/
|- mycomponent.vue
```

```
components/
|- myComponent.vue
```

</div>

<div class="style-example style-example-good">
<h3>Bien</h3>

```
components/
|- MyComponent.vue
```

```
components/
|- my-component.vue
```

</div>

## Nombres de componentes base {#base-component-names}

**Los componentes base (también conocidos como componentes presentacionales, tontos o puros) que aplican un estilo y convenciones específicas de la aplicación, deben comenzar todos con un prefijo específico, como `Base`, `App` o `V`.**

::: details Explicación Detallada
Estos componentes sientan las bases para un estilo y comportamiento consistentes en tu aplicación. **Solo** pueden contener:

- Elementos HTML,
- otros componentes base, y
- componentes de UI de terceros.

Pero **nunca** contendrán estado global (por ejemplo, de un store de [Pinia](https://pinia.vuejs.org/)).

Sus nombres a menudo incluyen el nombre de un elemento que envuelven (por ejemplo, `BaseButton`, `BaseTable`), a menos que no exista un elemento para su propósito específico (por ejemplo, `BaseIcon`). Si construyes componentes similares para un contexto más específico, casi siempre consumirán estos componentes (por ejemplo, `BaseButton` puede usarse en `ButtonSubmit`).

Algunas ventajas de esta convención:

- Cuando se organizan alfabéticamente en los editores, todos los componentes base de tu aplicación aparecen juntos, lo que facilita su identificación.

- Dado que los nombres de los componentes siempre deben ser de varias palabras, esta convención evita que tengas que elegir un prefijo arbitrario para envoltorios de componentes simples (por ejemplo, `MyButton`, `VueButton`).

- Dado que estos componentes se usan con tanta frecuencia, es posible que simplemente quieras hacerlos globales en lugar de importarlos en todas partes. Un prefijo lo hace posible con Webpack:

  ```js
  const requireComponent = require.context(
    './src',
    true,
    /Base[A-Z]\w+\.(vue|js)$/
  )
  requireComponent.keys().forEach(function (fileName) {
    let baseComponentConfig = requireComponent(fileName)
    baseComponentConfig =
      baseComponentConfig.default || baseComponentConfig
    const baseComponentName =
      baseComponentConfig.name ||
      fileName.replace(/^.+\//, '').replace(/\.\w+$/, '')
    app.component(baseComponentName, baseComponentConfig)
  })
  ```

  :::

<div class="style-example style-example-bad">
<h3>Mal</h3>

```
components/
|- MyButton.vue
|- VueTable.vue
|- Icon.vue
```

</div>

<div class="style-example style-example-good">
<h3>Bien</h3>

```
components/
|- BaseButton.vue
|- BaseTable.vue
|- BaseIcon.vue
```

```
components/
|- AppButton.vue
|- AppTable.vue
|- AppIcon.vue
```

```
components/
|- VButton.vue
|- VTable.vue
|- VIcon.vue
```

</div>

## Nombres de componentes fuertemente acoplados {#tightly-coupled-component-names}

**Los componentes hijos que están fuertemente acoplados con su padre deben incluir el nombre del componente padre como prefijo.**

Si un componente solo tiene sentido en el contexto de un único componente padre, esa relación debe ser evidente en su nombre. Dado que los editores suelen organizar los archivos alfabéticamente, esto también mantiene estos archivos relacionados juntos.

::: details Explicación Detallada
Podrías verte tentado a resolver este problema anidando los componentes hijos en directorios con el nombre de su padre. Por ejemplo:

```
components/
|- TodoList/
   |- Item/
      |- index.vue
      |- Button.vue
   |- index.vue
```

o:

```
components/
|- TodoList/
   |- Item/
      |- Button.vue
   |- Item.vue
|- TodoList.vue
```

Esto no es recomendable, ya que resulta en:

- Muchos archivos con nombres similares, lo que dificulta el cambio rápido de archivos en los editores de código.
- Muchos subdirectorios anidados, lo que aumenta el tiempo que lleva navegar por los componentes en la barra lateral de un editor.
  :::

<div class="style-example style-example-bad">
<h3>Mal</h3>

```
components/
|- TodoList.vue
|- TodoItem.vue
|- TodoButton.vue
```

```
components/
|- SearchSidebar.vue
|- NavigationForSearchSidebar.vue
```

</div>

<div class="style-example style-example-good">
<h3>Bien</h3>

```
components/
|- TodoList.vue
|- TodoListItem.vue
|- TodoListItemButton.vue
```

```
components/
|- SearchSidebar.vue
|- SearchSidebarNavigation.vue
```

</div>

## Orden de las palabras en los nombres de los componentes {#order-of-words-in-component-names}

**Los nombres de los componentes deben comenzar con las palabras de nivel más alto (a menudo las más generales) y terminar con palabras modificadoras descriptivas.**

::: details Explicación Detallada
Quizás te preguntes:

> "¿Por qué obligaríamos a los nombres de los componentes a usar un lenguaje menos natural?"

En el inglés natural, los adjetivos y otros descriptores suelen aparecer antes de los sustantivos, mientras que las excepciones requieren palabras de conexión. Por ejemplo:

- Coffee _with_ milk (Café _con_ leche)
- Soup _of the_ day (Sopa _del_ día)
- Visitor _to the_ museum (Visitante _del_ museo)

Definitivamente puedes incluir estas palabras de conexión en los nombres de los componentes si lo deseas, pero el orden sigue siendo importante.

También ten en cuenta que **lo que se considera de "nivel más alto" será contextual a tu aplicación**. Por ejemplo, imagina una aplicación con un formulario de búsqueda. Puede incluir componentes como este:

```
components/
|- ClearSearchButton.vue
|- ExcludeFromSearchInput.vue
|- LaunchOnStartupCheckbox.vue
|- RunSearchButton.vue
|- SearchInput.vue
|- TermsCheckbox.vue
```

Como puedes notar, es bastante difícil ver qué componentes son específicos de la búsqueda. Ahora renombremos los componentes de acuerdo con la regla:

```
components/
|- SearchButtonClear.vue
|- SearchButtonRun.vue
|- SearchInputExcludeGlob.vue
|- SearchInputQuery.vue
|- SettingsCheckboxLaunchOnStartup.vue
|- SettingsCheckboxTerms.vue
```

Dado que los editores suelen organizar los archivos alfabéticamente, todas las relaciones importantes entre componentes son ahora evidentes de un vistazo.

Podrías verte tentado a resolver este problema de manera diferente, anidando todos los componentes de búsqueda bajo un directorio "search", y luego todos los componentes de configuración bajo un directorio "settings". Solo recomendamos considerar este enfoque en aplicaciones muy grandes (por ejemplo, más de 100 componentes), por las siguientes razones:

- Generalmente, lleva más tiempo navegar por subdirectorios anidados que desplazarse por un único directorio `components`.
- Los conflictos de nombres (por ejemplo, múltiples componentes `ButtonDelete.vue`) dificultan la navegación rápida a un componente específico en un editor de código.
- La refactorización se vuelve más difícil, porque la búsqueda y reemplazo a menudo no son suficientes para actualizar las referencias relativas a un componente movido.
  :::

<div class="style-example style-example-bad">
<h3>Mal</h3>

```
components/
|- ClearSearchButton.vue
|- ExcludeFromSearchInput.vue
|- LaunchOnStartupCheckbox.vue
|- RunSearchButton.vue
|- SearchInput.vue
|- TermsCheckbox.vue
```

</div>

<div class="style-example style-example-good">
<h3>Bien</h3>

```
components/
|- SearchButtonClear.vue
|- SearchButtonRun.vue
|- SearchInputQuery.vue
|- SearchInputExcludeGlob.vue
|- SettingsCheckboxTerms.vue
|- SettingsCheckboxLaunchOnStartup.vue
```

</div>

## Componentes de autocierre {#self-closing-components}

**Los componentes sin contenido deben autocerrarse en [Single-File Components](/guide/scaling-up/sfc), plantillas de cadena y [JSX](/guide/extras/render-function#jsx-tsx), pero nunca en plantillas in-DOM.**

Los componentes que se autocierran comunican que no solo no tienen contenido, sino que **están destinados** a no tener contenido. Es la diferencia entre una página en blanco en un libro y una etiquetada como "Esta página se dejó en blanco intencionalmente". Tu código también es más limpio sin la etiqueta de cierre innecesaria.

Desafortunadamente, HTML no permite que los elementos personalizados se autocierren, solo los [elementos "void" oficiales](https://www.w3.org/TR/html/syntax.html#void-elements). Por eso, la estrategia solo es posible cuando el compilador de plantillas de Vue puede acceder a la plantilla antes del DOM, para luego servir el HTML que cumple con las especificaciones del DOM.

<div class="style-example style-example-bad">
<h3>Mal</h3>

```vue-html
<!-- En Single-File Components, plantillas de cadena y JSX -->
<MyComponent></MyComponent>
```

```vue-html
<!-- En plantillas in-DOM -->
<my-component/>
```

</div>

<div class="style-example style-example-good">
<h3>Bien</h3>

```vue-html
<!-- En Single-File Components, plantillas de cadena y JSX -->
<MyComponent/>
```

```vue-html
<!-- En plantillas in-DOM -->
<my-component></my-component>
```

</div>

## Uso de mayúsculas/minúsculas en nombres de componentes en plantillas {#component-name-casing-in-templates}

**En la mayoría de los proyectos, los nombres de los componentes siempre deben estar en PascalCase en [Single-File Components](/guide/scaling-up/sfc) y plantillas de cadena, pero en kebab-case en plantillas in-DOM.**

PascalCase tiene algunas ventajas sobre kebab-case:

- Los editores pueden autocompletar los nombres de los componentes en las plantillas, porque PascalCase también se usa en JavaScript.
- `<MyComponent>` es visualmente más distinto de un elemento HTML de una sola palabra que `<my-component>`, porque hay dos diferencias de caracteres (las dos mayúsculas), en lugar de solo una (un guion).
- Si utilizas algún elemento personalizado no Vue en tus plantillas, como un web component, PascalCase asegura que tus componentes Vue permanezcan claramente visibles.

Desafortunadamente, debido a la insensibilidad a mayúsculas y minúsculas de HTML, las plantillas in-DOM aún deben usar kebab-case.

También ten en cuenta que si ya has invertido mucho en kebab-case, la consistencia con las convenciones de HTML y la posibilidad de usar el mismo formato en todos tus proyectos puede ser más importante que las ventajas mencionadas anteriormente. En esos casos, **usar kebab-case en todas partes también es aceptable.**

<div class="style-example style-example-bad">
<h3>Mal</h3>

```vue-html
<!-- En Single-File Components y plantillas de cadena -->
<mycomponent/>
```

```vue-html
<!-- En Single-File Components y plantillas de cadena -->
<myComponent/>
```

```vue-html
<!-- En plantillas in-DOM -->
<MyComponent></MyComponent>
```

</div>

<div class="style-example style-example-good">
<h3>Bien</h3>

```vue-html
<!-- En Single-File Components y plantillas de cadena -->
<MyComponent/>
```

```vue-html
<!-- En plantillas in-DOM -->
<my-component></my-component>
```

O

```vue-html
<!-- En todas partes -->
<my-component></my-component>
```

</div>

## Uso de mayúsculas/minúsculas en nombres de componentes en JS/JSX {#component-name-casing-in-js-jsx}

**Los nombres de los componentes en JS/[JSX](/guide/extras/render-function#jsx-tsx) siempre deben estar en PascalCase, aunque pueden estar en kebab-case dentro de cadenas para aplicaciones más simples que solo utilizan el registro global de componentes a través de `app.component`.**

::: details Explicación Detallada
En JavaScript, PascalCase es la convención para clases y constructores de prototipos, esencialmente, cualquier cosa que pueda tener instancias distintas. Los componentes de Vue también tienen instancias, por lo que tiene sentido usar también PascalCase. Como beneficio adicional, el uso de PascalCase dentro de JSX (y las plantillas) permite a los lectores del código distinguir más fácilmente entre componentes y elementos HTML.

Sin embargo, para aplicaciones que usan **solamente** definiciones de componentes globales a través de `app.component`, recomendamos kebab-case en su lugar. Las razones son:

- Es raro que los componentes globales se referencien en JavaScript, por lo que seguir una convención para JavaScript tiene menos sentido.
- Estas aplicaciones siempre incluyen muchas plantillas in-DOM, donde [kebab-case **debe** usarse](#component-name-casing-in-templates).
  :::

<div class="style-example style-example-bad">
<h3>Mal</h3>

```js
app.component('myComponent', {
  // ...
})
```

```js
import myComponent from './MyComponent.vue'
```

```js
export default {
  name: 'myComponent'
  // ...
}
```

```js
export default {
  name: 'my-component'
  // ...
}
```

</div>

<div class="style-example style-example-good">
<h3>Bien</h3>

```js
app.component('MyComponent', {
  // ...
})
```

```js
app.component('my-component', {
  // ...
})
```

```js
import MyComponent from './MyComponent.vue'
```

```js
export default {
  name: 'MyComponent'
  // ...
}
```

</div>

## Nombres de componentes con palabras completas {#full-word-component-names}

**Los nombres de los componentes deben preferir palabras completas en lugar de abreviaturas.**

El autocompletado en los editores hace que el costo de escribir nombres más largos sea muy bajo, mientras que la claridad que proporcionan es invaluable. Las abreviaturas poco comunes, en particular, siempre deben evitarse.

<div class="style-example style-example-bad">
<h3>Mal</h3>

```
components/
|- SdSettings.vue
|- UProfOpts.vue
```

</div>

<div class="style-example style-example-good">
<h3>Bien</h3>

```
components/
|- StudentDashboardSettings.vue
|- UserProfileOptions.vue
```

</div>

## Uso de mayúsculas/minúsculas en los nombres de las props {#prop-name-casing}

**Los nombres de las `props` siempre deben usar camelCase durante la declaración. Cuando se usan dentro de plantillas in-DOM, las `props` deben ser kebab-cased. Las plantillas de Single-File Components y [JSX](/guide/extras/render-function#jsx-tsx) pueden usar `props` en kebab-case o camelCase. El uso de mayúsculas/minúsculas debe ser consistente: si eliges usar `props` en camelCase, asegúrate de no usar `props` en kebab-case en tu aplicación.**

<div class="style-example style-example-bad">
<h3>Mal</h3>

<div class="options-api">

```js
props: {
  'greeting-text': String
}
```

</div>

<div class="composition-api">

```js
const props = defineProps({
  'greeting-text': String
})
```

</div>

```vue-html
// para plantillas in-DOM
<welcome-message greetingText="hi"></welcome-message>
```

</div>

<div class="style-example style-example-good">
<h3>Bien</h3>

<div class="options-api">

```js
props: {
  greetingText: String
}
```

</div>

<div class="composition-api">

```js
const props = defineProps({
  greetingText: String
})
```

</div>

```vue-html
// para SFC - por favor, asegúrate de que tu estilo de mayúsculas/minúsculas sea consistente en todo el proyecto
// puedes usar cualquiera de las convenciones, pero no recomendamos mezclar dos estilos diferentes
<WelcomeMessage greeting-text="hi"/>
// o
<WelcomeMessage greetingText="hi"/>
```

```vue-html
// para plantillas in-DOM
<welcome-message greeting-text="hi"></welcome-message>
```

</div>

## Elementos con múltiples atributos {#multi-attribute-elements}

**Los elementos con múltiples atributos deben ocupar varias líneas, con un atributo por línea.**

En JavaScript, dividir objetos con múltiples propiedades en varias líneas se considera ampliamente una buena convención, porque es mucho más fácil de leer. Nuestras plantillas y [JSX](/guide/extras/render-function#jsx-tsx) merecen la misma consideración.

<div class="style-example style-example-bad">
<h3>Mal</h3>

```vue-html
<img src="https://vuejs.org/images/logo.png" alt="Vue Logo">
```

```vue-html
<MyComponent foo="a" bar="b" baz="c"/>
```

</div>

<div class="style-example style-example-good">
<h3>Bien</h3>

```vue-html
<img
  src="https://vuejs.org/images/logo.png"
  alt="Vue Logo"
>
```

```vue-html
<MyComponent
  foo="a"
  bar="b"
  baz="c"
/>
```

</div>

## Expresiones simples en plantillas {#simple-expressions-in-templates}

**Las plantillas de los componentes solo deben incluir expresiones simples, con expresiones más complejas refactorizadas en propiedades `computed` o `methods`.**

Las expresiones complejas en tus plantillas las hacen menos declarativas. Debemos esforzarnos por describir _qué_ debe aparecer, no _cómo_ estamos calculando ese valor. Las propiedades `computed` y los `methods` también permiten reutilizar el código.

<div class="style-example style-example-bad">
<h3>Mal</h3>

```vue-html
{{
  fullName.split(' ').map((word) => {
    return word[0].toUpperCase() + word.slice(1)
  }).join(' ')
}}
```

</div>

<div class="style-example style-example-good">
<h3>Bien</h3>

```vue-html
<!-- En una plantilla -->
{{ normalizedFullName }}
```

<div class="options-api">

```js
// La expresión compleja se ha movido a una propiedad computed
computed: {
  normalizedFullName() {
    return this.fullName.split(' ')
      .map(word => word[0].toUpperCase() + word.slice(1))
      .join(' ')
  }
}
```

</div>

<div class="composition-api">

```js
// La expresión compleja se ha movido a una propiedad computed
const normalizedFullName = computed(() =>
  fullName.value
    .split(' ')
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ')
)
```

</div>

</div>

## Propiedades computed simples {#simple-computed-properties}

**Las propiedades `computed` complejas deben dividirse en tantas propiedades más simples como sea posible.**

::: details Explicación Detallada
Las propiedades `computed` más simples y bien nombradas son:

- **Más fáciles de probar**

  Cuando cada propiedad `computed` contiene solo una expresión muy simple, con muy pocas dependencias, es mucho más fácil escribir pruebas que confirmen que funciona correctamente.

- **Más fáciles de leer**

  Simplificar las propiedades `computed` te obliga a dar a cada valor un nombre descriptivo, incluso si no se reutiliza. Esto hace que sea mucho más fácil para otros desarrolladores (y para ti en el futuro) concentrarse en el código que les interesa y entender lo que está sucediendo.

- **Más adaptables a los requisitos cambiantes**

  Cualquier valor que pueda nombrarse podría ser útil para la vista. Por ejemplo, podríamos decidir mostrar un mensaje que le diga al usuario cuánto dinero ahorró. También podríamos decidir calcular el impuesto sobre las ventas, pero quizás mostrarlo por separado, en lugar de como parte del precio final.

  Las propiedades `computed` pequeñas y enfocadas hacen menos suposiciones sobre cómo se utilizará la información, por lo que requieren menos refactorización a medida que cambian los requisitos.
  :::

<div class="style-example style-example-bad">
<h3>Mal</h3>

<div class="options-api">

```js
computed: {
  price() {
    const basePrice = this.manufactureCost / (1 - this.profitMargin)
    return (
      basePrice -
      basePrice * (this.discountPercent || 0)
    )
  }
}
```

</div>

<div class="composition-api">

```js
const price = computed(() => {
  const basePrice = manufactureCost.value / (1 - profitMargin.value)
  return basePrice - basePrice * (discountPercent.value || 0)
})
```

</div>

</div>

<div class="style-example style-example-good">
<h3>Bien</h3>

<div class="options-api">

```js
computed: {
  basePrice() {
    return this.manufactureCost / (1 - this.profitMargin)
  },

  discount() {
    return this.basePrice * (this.discountPercent || 0)
  },

  finalPrice() {
    return this.basePrice - this.discount
  }
}
```

</div>

<div class="composition-api">

```js
const basePrice = computed(
  () => manufactureCost.value / (1 - profitMargin.value)
)

const discount = computed(
  () => basePrice.value * (discountPercent.value || 0)
)

const finalPrice = computed(() => basePrice.value - discount.value)
```

</div>

</div>

## Valores de atributos entre comillas {#quoted-attribute-values}

**Los valores de atributos HTML no vacíos siempre deben estar entre comillas (simples o dobles, la que no se use en JS).**

Aunque los valores de atributos sin espacios no requieren comillas en HTML, esta práctica a menudo lleva a _evitar_ los espacios, haciendo que los valores de los atributos sean menos legibles.

<div class="style-example style-example-bad">
<h3>Mal</h3>

```vue-html
<input type=text>
```

```vue-html
<AppSidebar :style={width:sidebarWidth+'px'}>
```

</div>

<div class="style-example style-example-good">
<h3>Bien</h3>

```vue-html
<input type="text">
```

```vue-html
<AppSidebar :style="{ width: sidebarWidth + 'px' }">
```

</div>

## Atajos de directivas {#directive-shorthands}

**Los atajos de directivas (`:` para `v-bind:`, `@` para `v-on:` y `#` para `v-slot`) deben usarse siempre o nunca.**

<div class="style-example style-example-bad">
<h3>Mal</h3>

```vue-html
<input
  v-bind:value="newTodoText"
  :placeholder="newTodoInstructions"
>
```

```vue-html
<input
  v-on:input="onInput"
  @focus="onFocus"
>
```

```vue-html
<template v-slot:header>
  <h1>Aquí podría haber un título de página</h1>
</template>

<template #footer>
  <p>Aquí hay información de contacto</p>
</template>
```

</div>

<div class="style-example style-example-good">
<h3>Bien</h3>

```vue-html
<input
  :value="newTodoText"
  :placeholder="newTodoInstructions"
>
```

```vue-html
<input
  v-bind:value="newTodoText"
  v-bind:placeholder="newTodoInstructions"
>
```

```vue-html
<input
  @input="onInput"
  @focus="onFocus"
>
```

```vue-html
<input
  v-on:input="onInput"
  v-on:focus="onFocus"
>
```

```vue-html
<template v-slot:header>
  <h1>Aquí podría haber un título de página</h1>
</template>

<template v-slot:footer>
  <p>Aquí hay información de contacto</p>
</template>
```

```vue-html
<template #header>
  <h1>Aquí podría haber un título de página</h1>
</template>

<template #footer>
  <p>Aquí hay información de contacto</p>
</template>
```

</div>