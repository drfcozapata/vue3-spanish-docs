# Enlaces de Formulario {#form-bindings}

Usando `v-bind` y `v-on` juntos, podemos crear enlaces bidireccionales en elementos de entrada de formulario:

```vue-html
<input :value="text" @input="onInput">
```

<div class="options-api">

```js
methods: {
  onInput(e) {
    // a v-on handler receives the native DOM event
    // as the argument.
    this.text = e.target.value
  }
}
```

</div>

<div class="composition-api">

```js
function onInput(e) {
  // a v-on handler receives the native DOM event
  // as the argument.
  text.value = e.target.value
}
```

</div>

Intenta escribir en el cuadro de entrada; deberías ver el texto en `<p>` actualizándose a medida que escribes.

Para simplificar los enlaces bidireccionales, Vue proporciona una directiva, `v-model`, que es esencialmente azúcar sintáctico para lo anterior:

```vue-html
<input v-model="text">
```

`v-model` sincroniza automáticamente el valor del `<input>` con el estado enlazado, por lo que ya no necesitamos usar un manejador de eventos para ello.

`v-model` funciona no solo en entradas de texto, sino también en otros tipos de entrada como casillas de verificación, botones de radio y selectores desplegables. Cubrimos más detalles en <a target="_blank" href="/guide/essentials/forms.html">Guía - Enlaces de Formulario</a>.

Ahora, intenta refactorizar el código para usar `v-model` en su lugar.