---
outline: deep
---

<script setup>
import { ref } from 'vue'
const message = ref('')
const multilineText = ref('')
const checked = ref(false)
const checkedNames = ref([])
const picked = ref('')
const selected = ref('')
const multiSelected = ref([])
const dynamicSelected = ref('A')
const options = ref([
  { text: 'One', value: 'A' },
  { text: 'Two', value: 'B' },
  { text: 'Three', value: 'C' }
])
</script>

# Enlaces de Entrada de Formulario {#form-input-bindings}

<div class="options-api">
  <VueSchoolLink href="https://vueschool.io/lessons/user-inputs-vue-devtools-in-vue-3" title="Lección Gratuita sobre Entradas de Usuario con Vue.js"/>
</div>

<div class="composition-api">
  <VueSchoolLink href="https://vueschool.io/lessons/vue-fundamentals-capi-user-inputs-in-vue" title="Lección Gratuita sobre Entradas de Usuario con Vue.js"/>
</div>

Al trabajar con formularios en el frontend, a menudo necesitamos sincronizar el estado de los elementos de entrada del formulario con el estado correspondiente en JavaScript. Puede ser engorroso configurar manualmente los enlaces de valor y los oyentes de eventos de cambio:

```vue-html
<input
  :value="text"
  @input="event => text = event.target.value">
```

La directiva `v-model` nos ayuda a simplificar lo anterior a:

```vue-html
<input v-model="text">
```

Además, `v-model` se puede usar en inputs de diferentes tipos, elementos `<textarea>` y `<select>`. Se expande automáticamente a diferentes pares de propiedades DOM y eventos según el elemento en el que se utilice:

- Los `<input>` con tipos de texto y los elementos `<textarea>` usan la propiedad `value` y el evento `input`;
- Los `<input type="checkbox">` y los `<input type="radio">` usan la propiedad `checked` y el evento `change`;
- Los `<select>` usan `value` como una prop y `change` como un evento.

:::tip Nota
`v-model` ignorará los atributos `value`, `checked` o `selected` iniciales encontrados en cualquier elemento de formulario. Siempre tratará el estado JavaScript enlazado actual como la fuente de verdad. Debes declarar el valor inicial en el lado de JavaScript, usando <span class="options-api">la opción [`data`](/api/options-state.html#data)</span><span class="composition-api">[las APIs de reactividad](/api/reactivity-core.html#reactivity-api-core)</span>.
:::

## Uso Básico {#basic-usage}

### Texto {#text}

```vue-html
<p>Message is: {{ message }}</p>
<input v-model="message" placeholder="edit me" />
```

<div class="demo">
  <p>El mensaje es: {{ message }}</p>
  <input v-model="message" placeholder="edítame" />
</div>

<div class="composition-api">

[Pruébalo en el Playground](https://play.vuejs.org/#eNo9jUEOgyAQRa8yYUO7aNkbNOkBegM2RseWRGACoxvC3TumxuX/+f+9ql5Ez31D1SlbpuyJoSBvNLjoA6XMUCHjAg2WnAJomWoXXZxSLAwBSxk/CP2xuWl9d9GaP0YAEhgDrSOjJABLw/s8+NJBrde/NWsOpWPrI20M+yOkGdfeqXPiFAhowm9aZ8zS4+wPv/RGjtZcJtV+YpNK1g==)

</div>
<div class="options-api">

[Pruébalo en el Playground](https://play.vuejs.org/#eNo9jdEKwjAMRX8l9EV90L2POvAD/IO+lDVqoetCmw6h9N/NmBuEJPeSc1PVg+i2FFS90nlMnngwEb80JwaHL1sCQzURwFm258u2AyTkkuKuACbM2b6xh9Nps9o6pEnp7ggWwThRsIyiADQNz40En3uodQ+C1nRHK8HaRyoMy3WaHYa7Uf8To0CCRvzMwWESH51n4cXvBNTd8Um1H0FuTq0=)

</div>

<span id="vmodel-ime-tip"></span>
:::tip Nota
Para lenguajes que requieren un [IME](https://en.wikipedia.org/wiki/Input_method) (chino, japonés, coreano, etc.), notarás que `v-model` no se actualiza durante la composición del IME. Si también deseas responder a estas actualizaciones, usa tu propio oyente de eventos `input` y un enlace `value` en lugar de usar `v-model`.
:::

### Texto Multilínea {#multiline-text}

```vue-html
<span>Multiline message is:</span>
<p style="white-space: pre-line;">{{ message }}</p>
<textarea v-model="message" placeholder="add multiple lines"></textarea>
```

<div class="demo">
  <span>El mensaje multilínea es:</span>
  <p style="white-space: pre-line;">{{ multilineText }}</p>
  <textarea v-model="multilineText" placeholder="añade múltiples líneas"></textarea>
</div>

<div class="composition-api">

[Pruébalo en el Playground](https://play.vuejs.org/#eNo9jktuwzAMRK9CaON24XrvKgZ6gN5AG8FmGgH6ECKdJjB891D5LYec9zCb+SH6Oq9oRmN5roEEGGWlyeWQqFSBDSoeYYdjLQk6rXYuuzyXzAIJmf0fwqF1Prru02U7PDQq0CCYKHrBlsQy+Tz9rlFCDBnfdOBRqfa7twhYrhEPzvyfgmCvnxlHoIp9w76dmbbtDe+7HdpaBQUv4it6OPepLBjV8Gw5AzpjxlOJC1a9+2WB1IZQRGhWVqsdXgb1tfDcbvYbJDRqLQ==)

</div>
<div class="options-api">

[Pruébalo en el Playground](https://play.vuejs.org/#eNo9jk2OwyAMha9isenMIpN9hok0B+gN2FjBbZEIscDpj6LcvaZpKiHg2X6f32L+mX+uM5nO2DLkwNK7RHeesoCnE85RYHEJwKPg1/f2B8gkc067AhipFDxTB4fDVlrro5ce237AKoRGjihUldjCmPqjLgkxJNoxEEqnrtp7TTEUeUT6c+Z2CUKNdgbdxZmaavt1pl+Wj3ldbcubUegumAnh2oyTp6iE95QzoDEGukzRU9Y6eg9jDcKRoFKLUm27E5RXxTu7WZ89/G4E)

</div>

Ten en cuenta que la interpolación dentro de `<textarea>` no funcionará. Usa `v-model` en su lugar.

```vue-html
<!-- malo -->
<textarea>{{ text }}</textarea>

<!-- bueno -->
<textarea v-model="text"></textarea>
```

### Casilla de Verificación {#checkbox}

Casilla de verificación única, valor booleano:

```vue-html
<input type="checkbox" id="checkbox" v-model="checked" />
<label for="checkbox">{{ checked }}</label>
```

<div class="demo">
  <input type="checkbox" id="checkbox-demo" v-model="checked" />
  <label for="checkbox-demo">{{ checked }}</label>
</div>

<div class="composition-api">

[Pruébalo en el Playground](https://play.vuejs.org/#eNpVjssKgzAURH/lko3tonVfotD/yEaTKw3Ni3gjLSH/3qhUcDnDnMNk9gzhviRkD8ZnGXUgmJFS6IXTNvhIkCHiBAWm6C00ddoIJ5z0biaQL5RvVNCtmwvFhFfheLuLqqIGQhvMQLgm4tqFREDfgJ1gGz36j2Cg1TkvN+sVmn+JqnbtrjDDiAYmH09En/PxphTebqsK8PY4wMoPslBUxQ==)

</div>
<div class="options-api">

[Pruébalo en el Playground](https://play.vuejs.org/#eNpVjtEKgzAMRX8l9Gl72Po+OmH/0ZdqI5PVNnSpOEr/fVVREEKSc0kuN4sX0X1KKB5Cfbs4EDfa40whMljsTXIMWXsAa9hcrtsOEJFT9DsBdG/sPmgfwDHhJpZl1FZLycO6AuNIzjAuxGrwlBj4R/jUYrVpw6wFDPbM020MFt0uoq2a3CycadFBH+Lpo8l5jwWlKLle1QcljwCi/AH7gFic)

</div>

También podemos enlazar múltiples casillas de verificación al mismo array o valor de [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set):

<div class="composition-api">

```js
const checkedNames = ref([])
```

</div>
<div class="options-api">

```js
export default {
  data() {
    return {
      checkedNames: []
    }
  }
}
```

</div>

```vue-html
<div>Checked names: {{ checkedNames }}</div>

<input type="checkbox" id="jack" value="Jack" v-model="checkedNames" />
<label for="jack">Jack</label>

<input type="checkbox" id="john" value="John" v-model="checkedNames" />
<label for="john">John</label>

<input type="checkbox" id="mike" value="Mike" v-model="checkedNames" />
<label for="mike">Mike</label>
```

<div class="demo">
  <div>Nombres seleccionados: {{ checkedNames }}</div>

  <input type="checkbox" id="demo-jack" value="Jack" v-model="checkedNames" />
  <label for="demo-jack">Jack</label>

  <input type="checkbox" id="demo-john" value="John" v-model="checkedNames" />
  <label for="demo-john">John</label>

  <input type="checkbox" id="demo-mike" value="Mike" v-model="checkedNames" />
  <label for="demo-mike">Mike</label>
</div>

En este caso, el array `checkedNames` siempre contendrá los valores de las casillas de verificación actualmente marcadas.

<div class="composition-api">

[Pruébalo en el Playground](https://play.vuejs.org/#eNqVkUtqwzAURbfy0CTtoNU8KILSWaHdQNWBIj8T1fohyybBeO+RbOc3i2e+vHvuMWggHyG89x2SLWGtijokaDF1gQunbfAxwQARaxihjt7CJlc3wgmnvGsTqAOqBqsfabGFXSm+/P69CsfovJVXckhog5EJcwJgle7558yBK+AWhuFxaRwZLbVCZ0K70CVIp4A7Qabi3h8FAV3l/C9Vk797abpy/lrim/UVmkt/Gc4HOv+EkXs0UPt4XeCFZHQ6lM4TZn9w9+YlrjFPCC/kKrPVDd6Zv5e4wjwv8ELezIxeX4qMZwHduAs=)

</div>
<div class="options-api">

[Pruébalo en el Playground](https://play.vuejs.org/#eNqVUc1qxCAQfpXBU3tovS9WKL0V2hdoenDjLGtjVNwxbAl592rMpru3DYjO5/cnOLLXEJ6HhGzHxKmNJpBsHJ6DjwQaDypZgrFxAFqRenisM0BEStFdEEB7xLZD/al6PO3g67veT+XIW16Cr+kZEPbBKsKMAIQ2g3yrAeBqwjjeRMI0CV5kxZ0dxoVEQL8BXxo2C/f+3DAwOuMf1XZ5HpRNhX5f4FPvNdqLfgnOBK+PsGqPFg4+rgmyOAWPiaK5o9kf3XXzArc0zxZZnJuae9PhVfPHAjc01wRZnP/Ngq8/xaY/yMW74g==)

</div>

### Botón de Radio {#radio}

```vue-html
<div>Picked: {{ picked }}</div>

<input type="radio" id="one" value="One" v-model="picked" />
<label for="one">One</label>

<input type="radio" id="two" value="Two" v-model="picked" />
<label for="two">Two</label>
```

<div class="demo">
  <div>Seleccionado: {{ picked }}</div>

  <input type="radio" id="one" value="One" v-model="picked" />
  <label for="one">Uno</label>

  <input type="radio" id="two" value="Two" v-model="picked" />
  <label for="two">Dos</label>
</div>

<div class="composition-api">

[Pruébalo en el Playground](https://play.vuejs.org/#eNqFkDFuwzAMRa9CaHE7tNoDxUBP0A4dtTgWDQiRJUKmHQSG7x7KhpMMAbLxk3z/g5zVD9H3NKI6KDO02RPDgDxSbaPvKWWGGTJ2sECXUw+VrFY22timODCQb8/o4FhWPqrfiNWnjUZvRmIhgrGn0DCKAjDOT/XfCh1gnnd+WYwukwJYNj7SyMBXwqNVuXE+WQXeiUgRpZyaMJaR5BX11SeHQfTmJi1dnNiE5oQBupR3shbC6LX9Posvpdyz/jf1OksOe85ayVqIR5bR9z+o5Qbc6oCk)

</div>
<div class="options-api">

[Pruébalo en el Playground](https://play.vuejs.org/#eNqNkEEOAiEMRa/SsFEXyt7gJJ5AFy5ng1ITIgLBMmomc3eLOONSEwJ9Lf//pL3YxrjqMoq1ULdTspGa1uMjhkRg8KyzI+hbD2A06fmi1gAJKSc/EkC0pwuaNcx2Hme1OZSHLz5KTtYMhNfoNGEhUsZ2zf6j7vuPEQyDkmVSBPzJ+pgJ6Blx04qkjQ2tAGsYgkcuO+1yGXF6oeU1GHTM1Y1bsoY5fUQH55BGZcMKJd/t31l0L+WYdaj0V9Zb2bDim6XktAcxvADR+YWb)

</div>

### Seleccionar {#select}

Selección única:

```vue-html
<div>Selected: {{ selected }}</div>

<select v-model="selected">
  <option disabled value="">Please select one</option>
  <option>A</option>
  <option>B</option>
  <option>C</option>
</select>
```

<div class="demo">
  <div>Seleccionado: {{ selected }}</div>
  <select v-model="selected">
    <option disabled value="">Por favor selecciona uno</option>
    <option>A</option>
    <option>B</option>
    <option>C</option>
  </select>
</div>

<div class="composition-api">

[Pruébalo en el Playground](https://play.vuejs.org/#eNp1j7EOgyAQhl/lwmI7tO4Nmti+QJOuLFTPxASBALoQ3r2H2jYOjvff939wkTXWXucJ2Y1x37rBBvAYJlsLPYzWuAARHPaQoHdmhILQQmihW6N9RhW2ATuoMnQqirPQvFw9ZKAh4GiVDEgTAPdW6hpeW+sGMf4VKVEz73Mvs8sC5thoOlSVYF9SsEVGiLFhMBq6wcu3IsUs1YREEvFUKD1udjAaebnS+27dHOT3g/yxy+nHywM08PJ3KksfXwJ2dA==)

</div>
<div class="options-api">

[Pruébalo en el Playground](https://play.vuejs.org/#eNp1j1ELgyAUhf/KxZe2h633cEHbHxjstReXdxCYSt5iEP333XIJPQSinuN3jjqJyvvrOKAohAxN33oqa4tf73oCjR81GIKptgBakTqd4x6gRxp6uymAgAbyQhVAruXReeOEg8NbMg7LxRhKwAZPDKlvBK8WlKXTDPnFzOI7naMF46p9HcarFxtVgBRpyn1lnQbVBvwwWjMgMyycTToAr47wZnUeaR3mfL6sC/H/iPnc/vXS9gIfP0UTH/ACgWeYE=)

</div>

:::tip Nota
Si el valor inicial de tu expresión `v-model` no coincide con ninguna de las opciones, el elemento `<select>` se renderizará en un estado "no seleccionado". En iOS, esto provocará que el usuario no pueda seleccionar el primer elemento porque iOS no dispara un evento `change` en este caso. Por lo tanto, se recomienda proporcionar una opción deshabilitada con un valor vacío, como se demostró en el ejemplo anterior.
:::

Selección múltiple (enlazada a array):

```vue-html
<div>Selected: {{ selected }}</div>

<select v-model="selected" multiple>
  <option>A</option>
  <option>B</option>
  <option>C</option>
</select>
```

<div class="demo">
  <div>Seleccionado: {{ multiSelected }}</div>

  <select v-model="multiSelected" multiple>
    <option>A</option>
    <option>B</option>
    <option>C</option>
  </select>
</div>

<div class="composition-api">

[Pruébalo en el Playground](https://play.vuejs.org/#eNp1kL2OwjAQhF9l5Ya74i7QBhMJeARKTIESIyz5Z5VsAsjyu7NOQEBB5xl/M7vaKNaI/0OvRSlkV7cGCTpNPVbKG4ehJYjQ6hMkOLXBwYzRmfLK18F3GbW6Jt3AKkM/+8Ov8rKYperiBBWmH9kiaFYBszFDtHpkSYnwVpCSL/JtDDE4+DH8uNNqulHiCSoDrLRm0UyWzAckEX61l8Xh9+psv/vbD563HCSxk8bY0y45u47AJ2D/HHyDm4MU0dC5hMZ/jdal8Gg8wJkS6A3nRew4=)

</div>
<div class="options-api">

[Pruébalo en el Playground](https://play.vuejs.org/#eNp1UEEOgjAQ/MqmJz0oeMVKgj7BI3AgdI1NCjSwIIbwdxcqRA4mTbsznd2Z7CAia49diyIQsslrbSlMSuxtVRMofGStIRiSEkBllO32rgaokdq6XBBAgwZzQhVAnDpunB6++EhvncyAsLAmI2QEIJXuwvvaPAzrJBhH6U2/UxMLHQ/doagUmksiFmEioOCU2ho3krWVJV2VYSS9b7Xlr3/424bn1LMDA+n9hGbY0Hs2c4J4sU/dPl5a0TOAk+/b/rwsYO4Q4wdtRX7l)

</div>

Las opciones de selección se pueden renderizar dinámicamente con `v-for`:

<div class="composition-api">

```js
const selected = ref('A')

const options = ref([
  { text: 'One', value: 'A' },
  { text: 'Two', value: 'B' },
  { text: 'Three', value: 'C' }
])
```

</div>
<div class="options-api">

```js
export default {
  data() {
    return {
      selected: 'A',
      options: [
        { text: 'One', value: 'A' },
        { text: 'Two', value: 'B' },
        { text: 'Three', value: 'C' }
      ]
    }
  }
}
```

</div>

```vue-html
<div>Selected: {{ selected }}</div>

<select v-model="selected">
  <option v-for="option in options" :value="option.value">
    {{ option.text }}
  </option>
</select>
```

<div class="demo">
  <div>Seleccionado: {{ dynamicSelected }}</div>
  
  <select v-model="dynamicSelected">
    <option v-for="option in options" :value="option.value">
      {{ option.text }}
    </option>
  </select>
</div>

<div class="composition-api">

[Pruébalo en el Playground](https://play.vuejs.org/#eNp9kj9vwjAQxb/KyUtaiYahGwpIgBjaoVSFre6AkguEOnZkOwEpynfv2flDqlZkyt37+fye7ZotiyKsSmQzFplYZ4UFg7YsFlxmeaG0hRo0ptBAqlUOAaEBl1zGShqHCowtJjB30EOwDB5voipsRj+d9skl0CyLVzuDYCsxmEB1ECVStQygmfzS9xc10ld/9ZPG8YQ1EVx+0e7RtI1BAaiwmBfiYNFVNkqyarHrLM+grm/+myaaOtUtAojaPlRPuUpQzDnrQc4IAfqiNh0hqdIEdGUm+9icwcy7G8TQl8MESlN3cOhSkYdu9LTteo7i+K2piKZDGjZh1tApp9kxPBsl6fZqR3MWq7zIBOpt74JytmM5OwihLq++Z3WJ/kT9mhPG3//0z+bqepy9azSoK/I+aPagj2hbebN7I/8jkU6tFETfET/QKFE6jy22KmVCtkecd/vi32Amj3uzuVqUpg/ljDqyfRec0btc34l+s/scPvt1XDas+QENov3B)

</div>
<div class="options-api">

[Pruébalo en el Playground](https://play.vuejs.org/#eNp9ksFuwjAMhl/FyoVNYuWwG+omAeKwHcY0uC07VK2BspBUiVuQKt59Tkq6Hjakqortz87/J2nFrKqSpkYxFanLbVnRs9R4rowlKHCb1YqglRqgyCi7u+/WABaptjpGAA4V5oTFFEaz0ThmTUWl0W4KnzED0ALhmZhbaRyNoclUjaELLn3fgNqczICa/0ftLQ6nLZiL2Fe3CDH/+EsnvVMOCI+Vygh9RGlRNs/r3kzb9s7gckknvuqbANIuD83D0RSonqSIoBSM+B3Tzj4jW2MZuIaljuciBUyD4r6YhLCfwA7bK5x4p6zhOnrSZQPHdsLWHKST3o0YC3K50dtylxyc0XzB4bakyM2xKhXaVVTBPruxUmRKmdNryJGt8XrW3LPH/PuP/MGdfU6Kd4sObcPa+xpldofUlZfrN9Y/KPKp1YrpG8UPdEbVXmOHzWtdsOwBF9S+HP1jLfVu45ZnQu2iKS80XHrgpeBXvrhh/VfuY/IYH4u4/AD+8ADR)

</div>

## Enlaces de Valor {#value-bindings}

Para las opciones de radio, casilla de verificación y selección, los valores de enlace de `v-model` suelen ser cadenas estáticas (o booleanos para la casilla de verificación):

```vue-html
<!-- `picked` es una cadena "a" cuando está marcado -->
<input type="radio" v-model="picked" value="a" />

<!-- `toggle` es `true` o `false` -->
<input type="checkbox" v-model="toggle" />

<!-- `selected` es una cadena "abc" cuando la primera opción está seleccionada -->
<select v-model="selected">
  <option value="abc">ABC</option>
</select>
```

Pero a veces podemos querer enlazar el valor a una propiedad dinámica en la instancia activa actual. Podemos usar `v-bind` para lograr eso. Además, usar `v-bind` nos permite enlazar el valor de input a valores que no son cadenas.

### Casilla de Verificación {#checkbox-1}

```vue-html
<input
  type="checkbox"
  v-model="toggle"
  true-value="yes"
  false-value="no" />
```

`true-value` y `false-value` son atributos específicos de Vue que solo funcionan con `v-model`. Aquí, el valor de la propiedad `toggle` se establecerá en `'yes'` cuando la casilla esté marcada, y en `'no'` cuando esté desmarcada. También puedes enlazarlos a valores dinámicos usando `v-bind`:

```vue-html
<input
  type="checkbox"
  v-model="toggle"
  :true-value="dynamicTrueValue"
  :false-value="dynamicFalseValue" />
```

:::tip Consejo
Los atributos `true-value` y `false-value` no afectan el atributo `value` del input, porque los navegadores no incluyen las casillas desmarcadas en los envíos de formularios. Para garantizar que uno de dos valores se envíe en un formulario (por ejemplo, "sí" o "no"), usa inputs de radio en su lugar.
:::

### Botón de Radio {#radio-1}

```vue-html
<input type="radio" v-model="pick" :value="first" />
<input type="radio" v-model="pick" :value="second" />
```

`pick` se establecerá al valor de `first` cuando el primer input de radio esté marcado, y se establecerá al valor de `second` cuando el segundo esté marcado.

### Opciones de Selección {#select-options}

```vue-html
<select v-model="selected">
  <!-- literal de objeto en línea -->
  <option :value="{ number: 123 }">123</option>
</select>
```

`v-model` también admite enlaces de valor de tipos que no son cadenas. En el ejemplo anterior, cuando se selecciona la opción, `selected` se establecerá al valor literal del objeto `{ number: 123 }`.

## Modificadores {#modifiers}

### `.lazy` {#lazy}

Por defecto, `v-model` sincroniza la entrada con los datos después de cada evento `input` (con la excepción de la composición IME como [se mencionó anteriormente](#vmodel-ime-tip)). Puedes añadir el modificador `lazy` para sincronizar después de los eventos `change` en su lugar:

```vue-html
<!-- sincronizado después de "change" en lugar de "input" -->
<input v-model.lazy="msg" />
```

### `.number` {#number}

Si deseas que la entrada del usuario se convierta automáticamente a un número, puedes añadir el modificador `number` a tus inputs gestionados por `v-model`:

```vue-html
<input v-model.number="age" />
```

Si el valor no puede ser parseado con `parseFloat()`, se utiliza el valor original (string) en su lugar. En particular, si el input está vacío (por ejemplo, después de que el usuario borre el campo de input), se devuelve una cadena vacía. Este comportamiento difiere de la [propiedad DOM `valueAsNumber`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement#valueasnumber).

El modificador `number` se aplica automáticamente si el input tiene `type="number"`.

### `.trim` {#trim}

Si deseas que los espacios en blanco de la entrada del usuario se recorten automáticamente, puedes añadir el modificador `trim` a tus inputs gestionados por `v-model`:

```vue-html
<input v-model.trim="msg" />
```

## `v-model` con Componentes {#v-model-with-components}

> Si aún no estás familiarizado con los componentes de Vue, puedes omitir esto por ahora.

Los tipos de input integrados de HTML no siempre satisfarán tus necesidades. Afortunadamente, los componentes de Vue te permiten construir inputs reutilizables con un comportamiento completamente personalizado. ¡Estos inputs incluso funcionan con `v-model`! Para saber más, lee sobre [Uso con `v-model`](/guide/components/v-model) en la guía de Componentes.
