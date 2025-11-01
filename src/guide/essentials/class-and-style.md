# Enlaces de Clases y Estilos {#class-and-style-bindings}

Una necesidad común para el enlace de datos es manipular la lista de clases y los estilos en línea de un elemento. Dado que `class` y `style` son ambos atributos, podemos usar `v-bind` para asignarles un valor de cadena dinámicamente, al igual que con otros atributos. Sin embargo, intentar generar esos valores usando concatenación de cadenas puede ser molesto y propenso a errores. Por esta razón, Vue proporciona mejoras especiales cuando `v-bind` se usa con `class` y `style`. Además de cadenas, las expresiones también pueden evaluarse como objetos o arrays.

## Enlace de Clases HTML {#binding-html-classes}

<div class="options-api">
  <VueSchoolLink href="https://vueschool.io/lessons/dynamic-css-classes-with-vue-3" title="Lección Gratuita de Clases CSS Dinámicas con Vue.js"/>
</div>

<div class="composition-api">
  <VueSchoolLink href="https://vueschool.io/lessons/vue-fundamentals-capi-dynamic-css-classes-with-vue" title="Lección Gratuita de Clases CSS Dinámicas con Vue.js"/>
</div>

### Enlace a Objetos {#binding-to-objects}

Podemos pasar un objeto a `:class` (abreviatura de `v-bind:class`) para alternar dinámicamente clases:

```vue-html
<div :class="{ active: isActive }"></div>
```

La sintaxis anterior significa que la presencia de la clase `active` estará determinada por la [veracidad](https://developer.mozilla.org/en-US/docs/Glossary/Truthy) de la propiedad de datos `isActive`.

Puedes alternar múltiples clases teniendo más campos en el objeto. Además, la directiva `:class` también puede coexistir con el atributo `class` simple. Así que dado el siguiente estado:

<div class="composition-api">

```js
const isActive = ref(true)
const hasError = ref(false)
```

</div>

<div class="options-api">

```js
data() {
  return {
    isActive: true,
    hasError: false
  }
}
```

</div>

Y la siguiente plantilla:

```vue-html
<div
  class="static"
  :class="{ active: isActive, 'text-danger': hasError }"
></div>
```

Se renderizará:

```vue-html
<div class="static active"></div>
```

Cuando `isActive` o `hasError` cambien, la lista de clases se actualizará en consecuencia. Por ejemplo, si `hasError` se vuelve `true`, la lista de clases será `"static active text-danger"`.

El objeto enlazado no tiene por qué ser en línea:

<div class="composition-api">

```js
const classObject = reactive({
  active: true,
  'text-danger': false
})
```

</div>

<div class="options-api">

```js
data() {
  return {
    classObject: {
      active: true,
      'text-danger': false
    }
  }
}
```

</div>

```vue-html
<div :class="classObject"></div>
```

Esto renderizará:

```vue-html
<div class="active"></div>
```

También podemos enlazar a una [propiedad computada](./computed) que devuelva un objeto. Este es un patrón común y potente:

<div class="composition-api">

```js
const isActive = ref(true)
const error = ref(null)

const classObject = computed(() => ({
  active: isActive.value && !error.value,
  'text-danger': error.value && error.value.type === 'fatal'
}))
```

</div>

<div class="options-api">

```js
data() {
  return {
    isActive: true,
    error: null
  }
},
computed: {
  classObject() {
    return {
      active: this.isActive && !this.error,
      'text-danger': this.error && this.error.type === 'fatal'
    }
  }
}
```

</div>

```vue-html
<div :class="classObject"></div>
```

### Enlace a Arrays {#binding-to-arrays}

Podemos enlazar `:class` a un array para aplicar una lista de clases:

<div class="composition-api">

```js
const activeClass = ref('active')
const errorClass = ref('text-danger')
```

</div>

<div class="options-api">

```js
data() {
  return {
    activeClass: 'active',
    errorClass: 'text-danger'
  }
}
```

</div>

```vue-html
<div :class="[activeClass, errorClass]"></div>
```

Lo cual renderizará:

```vue-html
<div class="active text-danger"></div>
```

Si también deseas alternar una clase en la lista condicionalmente, puedes hacerlo con una expresión ternaria:

```vue-html
<div :class="[isActive ? activeClass : '', errorClass]"></div>
```

Esto siempre aplicará `errorClass`, pero `activeClass` solo se aplicará cuando `isActive` sea verdadero.

Sin embargo, esto puede ser un poco verboso si tienes múltiples clases condicionales. Por eso también es posible usar la sintaxis de objeto dentro de la sintaxis de array:

```vue-html
<div :class="[{ [activeClass]: isActive }, errorClass]"></div>
```

### Con Componentes {#with-components}

> Esta sección asume conocimientos de [Componentes](/guide/essentials/component-basics). Siéntete libre de omitirla y volver más tarde.

Cuando usas el atributo `class` en un componente con un solo elemento raíz, esas clases se añadirán al elemento raíz del componente y se fusionarán con cualquier clase existente ya en él.

Por ejemplo, si tenemos un componente llamado `MyComponent` con la siguiente plantilla:

```vue-html
<!-- plantilla del componente hijo -->
<p class="foo bar">¡Hola!</p>
```

Luego añade algunas clases al usarlo:

```vue-html
<!-- al usar el componente -->
<MyComponent class="baz boo" />
```

El HTML renderizado será:

```vue-html
<p class="foo bar baz boo">¡Hola!</p>
```

Lo mismo ocurre con los enlaces de clase:

```vue-html
<MyComponent :class="{ active: isActive }" />
```

Cuando `isActive` sea verdadero, el HTML renderizado será:

```vue-html
<p class="foo bar active">¡Hola!</p>
```

Si tu componente tiene múltiples elementos raíz, necesitarías definir qué elemento recibirá esta clase. Puedes hacerlo usando la propiedad de componente `$attrs`:

```vue-html
<!-- plantilla de MyComponent usando $attrs -->
<p :class="$attrs.class">¡Hola!</p>
<span>Este es un componente hijo</span>
```

```vue-html
<MyComponent class="baz" />
```

Renderizará:

```html
<p class="baz">¡Hola!</p>
<span>Este es un componente hijo</span>
```

Puedes aprender más sobre la herencia de atributos de componente en la sección [Atributos de Fallback](/guide/components/attrs).

## Enlace de Estilos en Línea {#binding-inline-styles}

### Enlace a Objetos {#binding-to-objects-1}

`:style` admite el enlace a valores de objeto JavaScript, lo que corresponde a la [propiedad `style` de un elemento HTML](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/style):

<div class="composition-api">

```js
const activeColor = ref('red')
const fontSize = ref(30)
```

</div>

<div class="options-api">

```js
data() {
  return {
    activeColor: 'red',
    fontSize: 30
  }
}
```

</div>

```vue-html
<div :style="{ color: activeColor, fontSize: fontSize + 'px' }"></div>
```

Aunque se recomiendan las claves en `camelCase`, `:style` también admite claves de propiedades CSS en `kebab-case` (corresponde a cómo se usan en CSS real), por ejemplo:

```vue-html
<div :style="{ 'font-size': fontSize + 'px' }"></div>
```

A menudo es una buena idea enlazar directamente a un objeto de estilo para que la plantilla sea más limpia:

<div class="composition-api">

```js
const styleObject = reactive({
  color: 'red',
  fontSize: '30px'
})
```

</div>

<div class="options-api">

```js
data() {
  return {
    styleObject: {
      color: 'red',
      fontSize: '13px'
    }
  }
}
```

</div>

```vue-html
<div :style="styleObject"></div>
```

De nuevo, el enlace de estilo de objeto se utiliza a menudo junto con propiedades computadas que devuelven objetos.

Las directivas `:style` también pueden coexistir con atributos `style` regulares, al igual que `:class`.

Template:

```vue-html
<h1 style="color: red" :style="'font-size: 1em'">hola</h1>
```

Renderizará:

```vue-html
<h1 style="color: red; font-size: 1em;">hola</h1>
```

### Enlace a Arrays {#binding-to-arrays-1}

Podemos enlazar `:style` a un array de múltiples objetos de estilo. Estos objetos se fusionarán y aplicarán al mismo elemento:

```vue-html
<div :style="[baseStyles, overridingStyles]"></div>
```

### Auto-prefijado {#auto-prefixing}

Cuando usas una propiedad CSS que requiere un [prefijo de proveedor](https://developer.mozilla.org/en-US/docs/Glossary/Vendor_Prefix) en `:style`, Vue añadirá automáticamente el prefijo apropiado. Vue hace esto comprobando en tiempo de ejecución qué propiedades de estilo son compatibles con el navegador actual. Si el navegador no es compatible con una propiedad particular, se probarán varias variantes prefijadas para intentar encontrar una que sea compatible.

### Múltiples Valores {#multiple-values}

Puedes proporcionar un array de múltiples valores (prefijados) a una propiedad de estilo, por ejemplo:

```vue-html
<div :style="{ display: ['-webkit-box', '-ms-flexbox', 'flex'] }"></div>
```

Esto solo renderizará el último valor del array que sea compatible con el navegador. En este ejemplo, renderizará `display: flex` para los navegadores que admitan la versión sin prefijo de flexbox.
