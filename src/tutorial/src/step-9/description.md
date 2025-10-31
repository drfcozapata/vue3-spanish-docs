# Ciclo de Vida y Refs de Plantilla {#lifecycle-and-template-refs}

Hasta ahora, Vue ha estado manejando todas las actualizaciones del DOM por nosotros, gracias a la reactividad y la renderización declarativa. Sin embargo, inevitablemente habrá casos en los que necesitemos trabajar manualmente con el DOM.

Podemos solicitar una **ref de plantilla** - es decir, una referencia a un elemento en la plantilla - usando el <a target="_blank" href="/api/built-in-special-attributes.html#ref">atributo especial `ref`</a>:

```vue-html
<p ref="pElementRef">hello</p>
```

<div class="composition-api">

Para acceder a la `ref`, necesitamos declarar<span class="html"> y exponer</span> una `ref` con un nombre que coincida:

<div class="sfc">

```js
const pElementRef = ref(null)
```

</div>
<div class="html">

```js
setup() {
  const pElementRef = ref(null)

  return {
    pElementRef
  }
}
```

</div>

Observa que la `ref` se inicializa con el valor `null`. Esto se debe a que el elemento aún no existe cuando <span class="sfc">`<script setup>`</span><span class="html">`setup()`</span> se ejecuta. La `ref` de plantilla solo es accesible después de que el componente está **montado**.

Para ejecutar código después del montaje, podemos usar la función `onMounted()`:

<div class="sfc">

```js
import { onMounted } from 'vue'

onMounted(() => {
  // component is now mounted.
})
```

</div>
<div class="html">

```js
import { onMounted } from 'vue'

createApp({
  setup() {
    onMounted(() => {
      // component is now mounted.
    })
  }
})
```

</div>
</div>

<div class="options-api">

El elemento se expondrá en `this.$refs` como `this.$refs.pElementRef`. Sin embargo, solo puedes acceder a él después de que el componente está **montado**.

Para ejecutar código después del montaje, podemos usar la opción `mounted`:

<div class="sfc">

```js
export default {
  mounted() {
    // component is now mounted.
  }
}
```

</div>
<div class="html">

```js
createApp({
  mounted() {
    // component is now mounted.
  }
})
```

</div>
</div>

Esto se llama un **hook de ciclo de vida** - nos permite registrar una función de devolución de llamada para que se ejecute en ciertos momentos del ciclo de vida del componente. Hay otros hooks como <span class="options-api">`created` y `updated`</span><span class="composition-api">`onUpdated` y `onUnmounted`</span>. Consulta el <a target="_blank" href="/guide/essentials/lifecycle.html#lifecycle-diagram">Diagrama del Ciclo de Vida</a> para más detalles.

Ahora, intenta añadir <span class="options-api">un hook `mounted`</span><span class="composition-api">un hook `onMounted`</span>, accede al `<p>` a través de <span class="options-api">`this.$refs.pElementRef`</span><span class="composition-api">`pElementRef.value`</span>, y realiza algunas operaciones DOM directas sobre él (por ejemplo, cambiando su `textContent`).