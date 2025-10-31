# Manejo de Eventos {#event-handling}

<div class="options-api">
  <VueSchoolLink href="https://vueschool.io/lessons/user-events-in-vue-3" title="Lección gratuita sobre eventos en Vue.js"/>
</div>

<div class="composition-api">
  <VueSchoolLink href="https://vueschool.io/lessons/vue-fundamentals-capi-user-events-in-vue-3" title="Lección gratuita sobre eventos de usuario en Vue.js"/>
</div>

## Escuchando Eventos {#listening-to-events}

Podemos usar la directiva `v-on`, que usualmente abreviamos con el símbolo `@`, para escuchar eventos del DOM y ejecutar algo de JavaScript cuando estos se disparan. El uso sería `v-on:click="handler"` o, con el atajo, `@click="handler"`.

El valor del handler puede ser uno de los siguientes:

1.  **Handlers en línea:** JavaScript en línea que se ejecutará cuando el evento sea disparado (similar al atributo nativo `onclick`).

2.  **Handlers de método:** Un nombre de propiedad o ruta que apunta a un método definido en el componente.

## Handlers en Línea {#inline-handlers}

Los handlers en línea se usan típicamente en casos sencillos, por ejemplo:

<div class="composition-api">

```js
const count = ref(0)
```

</div>
<div class="options-api">

```js
data() {
  return {
    count: 0
  }
}
```

</div>

```vue-html
<button @click="count++">Add 1</button>
<p>Count is: {{ count }}</p>
```

<div class="composition-api">

[Pruébalo en el Playground](https://play.vuejs.org/#eNo9jssKgzAURH/lko0tgrbbEqX+Q5fZaLxiqHmQ3LgJ+fdqFZcD58xMYp1z1RqRvRgP0itHEJCia4VR2llPkMDjBBkmbzUUG1oII4y0JhBIGw2hh2Znbo+7MLw+WjZ/C4TaLT3hnogPkcgaeMtFyW8j2GmXpWBtN47w5PWBHLhrPzPCKfWDXRHmPsCAaOBfgSOkdH3IGUhpDBWv9/e8vsZZ/gFFhFJN)

</div>
<div class="options-api">

[Pruébalo en el Playground](https://play.vuejs.org/#eNo9jcEKgzAQRH9lyKlF0PYqqdR/6DGXaLYo1RjiRgrivzepIizLzu7sm1XUzuVLIFEKObe+d1wpS183eYahtw4DY1UWMJr15ZpmxYAnDt7uF0BxOwXL5Evc0kbxlmyxxZLFyY2CaXSDZkqKZROYJ4tnO/Tt56HEgckyJaraGNxlsVt2u6teHeF40s20EDo9oyGy+CPIYF1xULBt4H6kOZeFiwBZnOFi+wH0B1hk)

</div>

## Handlers de Método {#method-handlers}

Sin embargo, la lógica para muchos handlers de eventos será más compleja y probablemente no sea factible con handlers en línea. Es por eso que `v-on` también puede aceptar el nombre o la ruta de un método del componente que te gustaría llamar.

Por ejemplo:

<div class="composition-api">

```js
const name = ref('Vue.js')

function greet(event) {
  alert(`Hello ${name.value}!`)
  // `event` is the native DOM event
  if (event) {
    alert(event.target.tagName)
  }
}
```

</div>
<div class="options-api">

```js
data() {
  return {
    name: 'Vue.js'
  }
},
methods: {
  greet(event) {
    // `this` inside methods points to the current active instance
    alert(`Hello ${this.name}!`)
    // `event` is the native DOM event
    if (event) {
      alert(event.target.tagName)
    }
  }
}
```

</div>

```vue-html
<!-- `greet` is the name of the method defined above -->
<button @click="greet">Greet</button>
```

<div class="composition-api">

[Pruébalo en el Playground](https://play.vuejs.org/#eNpVj0FLxDAQhf/KMwjtXtq7dBcFQS/qzVMOrWFao2kSkkkvpf/dJIuCEBgm771vZnbx4H23JRJ3YogqaM+IxMlfpNWrd4GxI9CMA3NwK5psbaSVVjkbGXZaCediaJv3RN1XbE5FnZNVrJ3FEoi4pY0sn7BLC0yGArfjMxnjcLsXQrdNJtFxM+Ys0PcYa2CEjuBPylNYb4THtxdUobj0jH/YX3D963gKC5WyvGZ+xR7S5jf01yPzeblhWr2ZmErHw0dizivfK6PV91mKursUl6dSh/4qZ+vQ/+XE8QODonDi)

</div>
<div class="options-api">

[Pruébalo en el Playground](https://play.vuejs.org/#eNplUE1LxDAQ/StjEbYL0t5LXRQEvag3Tz00prNtNE1CMilC6X83SUkRhJDJfLz3Jm8tHo2pFo9FU7SOW2Ho0in8MdoSDHhlXhKsnQIYGLHyvL8BLJK3KmcAis3YwOnDY/XlTnt1i2G7i/eMNOnBNRkwWkQqcUFFByVAXUNPk3A9COXEgBkGRgtFDkgDTQjcWxuAwDiJBeMsMcUxszCJlsr+BaXUcLtGwiqut930579KST1IBd5Aqlgie3p/hdTIk+IK//bMGqleEbMjxjC+BZVDIv0+m9CpcNr6MDgkhLORjDBm1H56Iq3ggUvBv++7IhnUFZfnGNt6b4fRtj5wxfYL9p+Sjw==)

</div>

Un handler de método recibe automáticamente el objeto nativo `DOM Event` que lo dispara; en el ejemplo anterior, podemos acceder al elemento que despacha el evento a través de `event.target`.

<div class="composition-api">

Ver también: [Typing Event Handlers](/guide/typescript/composition-api#typing-event-handlers) <sup class="vt-badge ts" />

</div>
<div class="options-api">

Ver también: [Typing Event Handlers](/guide/typescript/options-api#typing-event-handlers) <sup class="vt-badge ts" />

</div>

### Detección de Método vs. En Línea {#method-vs-inline-detection}

El compilador de plantillas detecta los handlers de método comprobando si la cadena de valor de `v-on` es un identificador de JavaScript válido o una ruta de acceso a una propiedad. Por ejemplo, `foo`, `foo.bar` y `foo['bar']` se tratan como handlers de método, mientras que `foo()` y `count++` se tratan como handlers en línea.

## Llamando Métodos en Handlers en Línea {#calling-methods-in-inline-handlers}

En lugar de enlazar directamente a un nombre de método, también podemos llamar métodos en un handler en línea. Esto nos permite pasar argumentos personalizados al método en lugar del evento nativo:

<div class="composition-api">

```js
function say(message) {
  alert(message)
}
```

</div>
<div class="options-api">

```js
methods: {
  say(message) {
    alert(message)
  }
}
```

</div>

```vue-html
<button @click="say('hello')">Say hello</button>
<button @click="say('bye')">Say bye</button>
```

<div class="composition-api">

[Pruébalo en el Playground](https://play.vuejs.org/#eNp9jTEOwjAMRa8SeSld6I5CBWdg9ZJGBiJSN2ocpKjq3UmpFDGx+Vn//b/ANYTjOxGcQEc7uyAqkqTQI98TW3ETq2jyYaQYzYNatSArZTzNUn/IK7Ludr2IBYTG4I3QRqKHJFJ6LtY7+zojbIXNk7yfmhahv5msvqS7PfnHGjJVp9w/hu7qKKwfEd1NSg==)

</div>
<div class="options-api">

[Pruébalo en el Playground](https://play.vuejs.org/#eNptjUEKwjAQRa8yZFO7sfsSi57B7WzGdjTBtA3NVC2ldzehEFwIw8D7vM9f1cX742tmVSsd2sl6aXDgjx8ngY7vNDuBFQeAnsWMXagToQAEWg49h0APLncDAIUcT5LzlKJsqRBfPF3ljQjCvXcknEj0bRYZBzi3zrbPE6o0UBhblKiaKy1grK52J/oA//23IcmNBD8dXeVBtX0BF0pXsg==)

</div>

## Accediendo al Argumento Event en Handlers en Línea {#accessing-event-argument-in-inline-handlers}

A veces también necesitamos acceder al evento DOM original en un handler en línea. Puedes pasarlo a un método usando la variable especial `$event`, o usar una función de flecha en línea:

```vue-html
<!-- using $event special variable -->
<button @click="warn('Form cannot be submitted yet.', $event)">
  Submit
</button>

<!-- using inline arrow function -->
<button @click="(event) => warn('Form cannot be submitted yet.', event)">
  Submit
</button>
```

<div class="composition-api">

```js
function warn(message, event) {
  // now we have access to the native event
  if (event) {
    event.preventDefault()
  }
  alert(message)
}
```

</div>
<div class="options-api">

```js
methods: {
  warn(message, event) {
    // now we have access to the native event
    if (event) {
      event.preventDefault()
    }
    alert(message)
  }
}
```

</div>

## Modificadores de Evento {#event-modifiers}

Es una necesidad muy común llamar a `event.preventDefault()` o `event.stopPropagation()` dentro de los handlers de eventos. Aunque podemos hacer esto fácilmente dentro de los métodos, sería mejor si los métodos pudieran ser puramente sobre lógica de datos en lugar de tener que lidiar con los detalles de los eventos DOM.

Para abordar este problema, Vue proporciona **modificadores de evento** para `v-on`. Recuerda que los modificadores son sufijos de directiva denotados por un punto.

- `.stop`
- `.prevent`
- `.self`
- `.capture`
- `.once`
- `.passive`

```vue-html
<!-- the click event's propagation will be stopped -->
<a @click.stop="doThis"></a>

<!-- the submit event will no longer reload the page -->
<form @submit.prevent="onSubmit"></form>

<!-- modifiers can be chained -->
<a @click.stop.prevent="doThat"></a>

<!-- just the modifier -->
<form @submit.prevent></form>

<!-- only trigger handler if event.target is the element itself -->
<!-- i.e. not from a child element -->
<div @click.self="doThat">...</div>
```

::: tip
El orden importa al usar modificadores porque el código relevante se genera en el mismo orden. Por lo tanto, usar `@click.prevent.self` evitará la **acción predeterminada de `click` en el elemento mismo y en sus hijos**, mientras que `@click.self.prevent` solo evitará la acción predeterminada de `click` en el elemento mismo.
:::

Los modificadores `.capture`, `.once` y `.passive` reflejan las [opciones del método nativo `addEventListener`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#options):

```vue-html
<!-- use capture mode when adding the event listener     -->
<!-- i.e. an event targeting an inner element is handled -->
<!-- here before being handled by that element           -->
<div @click.capture="doThis">...</div>

<!-- the click event will be triggered at most once -->
<a @click.once="doThis"></a>

<!-- the scroll event's default behavior (scrolling) will happen -->
<!-- immediately, instead of waiting for `onScroll` to complete  -->
<!-- in case it contains `event.preventDefault()`                -->
<div @scroll.passive="onScroll">...</div>
```

El modificador `.passive` se utiliza típicamente con listeners de eventos táctiles para [mejorar el rendimiento en dispositivos móviles](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#improving_scroll_performance_using_passive_listeners).

::: tip
No uses `.passive` y `.prevent` juntos, porque `.passive` ya indica al navegador que _no_ tienes la intención de prevenir el comportamiento predeterminado del evento, y es probable que veas una advertencia del navegador si lo haces.
:::

## Modificadores de Tecla {#key-modifiers}

Al escuchar eventos de teclado, a menudo necesitamos verificar teclas específicas. Vue permite agregar modificadores de tecla para `v-on` o `@` al escuchar eventos de teclado:

```vue-html
<!-- only call `submit` when the `key` is `Enter` -->
<input @keyup.enter="submit" />
```

Puedes usar directamente cualquier nombre de tecla válido expuesto a través de [`KeyboardEvent.key`](https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values) como modificadores, convirtiéndolos a kebab-case.

```vue-html
<input @keyup.page-down="onPageDown" />
```

En el ejemplo anterior, el handler solo se llamará si `$event.key` es igual a `'PageDown'`.

### Alias de Teclas {#key-aliases}

Vue proporciona alias para las teclas más comúnmente usadas:

- `.enter`
- `.tab`
- `.delete` (captura las teclas "Delete" y "Backspace")
- `.esc`
- `.space`
- `.up`
- `.down`
- `.left`
- `.right`

### Teclas Modificadoras del Sistema {#system-modifier-keys}

Puedes usar los siguientes modificadores para disparar listeners de eventos de ratón o teclado solo cuando se presiona la tecla modificadora correspondiente:

- `.ctrl`
- `.alt`
- `.shift`
- `.meta`

::: tip Nota
En teclados Macintosh, `meta` es la tecla de comando (⌘). En teclados Windows, `meta` es la tecla de Windows (⊞). En teclados Sun Microsystems, `meta` se marca como un diamante sólido (◆). En ciertos teclados, específicamente MIT y los teclados de máquinas Lisp y sus sucesores, como el teclado Knight, el teclado space-cadet, `meta` se etiqueta como "META". En teclados Symbolics, `meta` se etiqueta como "META" o "Meta".
:::

Por ejemplo:

```vue-html
<!-- Alt + Enter -->
<input @keyup.alt.enter="clear" />

<!-- Ctrl + Click -->
<div @click.ctrl="doSomething">Do something</div>
```

::: tip
Ten en cuenta que las teclas modificadoras son diferentes de las teclas regulares y, cuando se usan con eventos `keyup`, deben estar presionadas cuando se emite el evento. En otras palabras, `keyup.ctrl` solo se disparará si sueltas una tecla mientras mantienes presionado `ctrl`. No se disparará si sueltas la tecla `ctrl` sola.
:::

### Modificador `.exact` {#exact-modifier}

El modificador `.exact` permite controlar la combinación exacta de modificadores del sistema necesaria para disparar un evento.

```vue-html
<!-- this will fire even if Alt or Shift is also pressed -->
<button @click.ctrl="onClick">A</button>

<!-- this will only fire when Ctrl and no other keys are pressed -->
<button @click.ctrl.exact="onCtrlClick">A</button>

<!-- this will only fire when no system modifiers are pressed -->
<button @click.exact="onClick">A</button>
```

## Modificadores de Botón del Ratón {#mouse-button-modifiers}

- `.left`
- `.right`
- `.middle`

Estos modificadores restringen el handler a eventos disparados por un botón específico del ratón.

Sin embargo, ten en cuenta que los nombres de los modificadores `.left`, `.right` y `.middle` se basan en la disposición típica del ratón para diestros, pero en realidad representan los disparadores de eventos de "main", "secondary" y "auxiliary" del dispositivo señalador, respectivamente, y no los botones físicos reales. Así, para una disposición de ratón para zurdos, el botón "main" podría ser físicamente el derecho, pero dispararía el handler del modificador `.left`. O un trackpad podría disparar el handler `.left` con un toque de un dedo, el handler `.right` con un toque de dos dedos y el handler `.middle` con un toque de tres dedos. De manera similar, otros dispositivos y fuentes de eventos que generan eventos de "ratón" podrían tener modos de disparo que no están relacionados en absoluto con "izquierda" y "derecha".
