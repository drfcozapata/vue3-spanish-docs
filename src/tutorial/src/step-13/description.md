# Emisiones {#emits}

Además de recibir `props`, un `componente` hijo también puede `emitir` `eventos` al padre:

<div class="composition-api">
<div class="sfc">

```vue
<script setup>
// declarar eventos emitidos
const emit = defineEmits(['response'])

// emitir con argumento
emit('response', 'hello from child')
</script>
```

</div>

<div class="html">

```js
export default {
  // declarar eventos emitidos
  emits: ['response'],
  setup(props, { emit }) {
    // emitir con argumento
    emit('response', 'hello from child')
  }
}
```

</div>

</div>

<div class="options-api">

```js
export default {
  // declarar eventos emitidos
  emits: ['response'],
  created() {
    // emitir con argumento
    this.$emit('response', 'hello from child')
  }
}
```

</div>

El primer argumento para <span class="options-api">`this.$emit()`</span><span class="composition-api">`emit()`</span> es el nombre del `evento`. Cualquier argumento adicional se pasa al `listener` del `evento`.

El padre puede escuchar los `eventos` `emitidos` por el hijo usando `v-on` - aquí el `handler` recibe el argumento extra de la llamada `emit` del hijo y lo asigna al estado local:

<div class="sfc">

```vue-html
<ChildComp @response="(msg) => childMsg = msg" />
```

</div>
<div class="html">

```vue-html
<child-comp @response="(msg) => childMsg = msg"></child-comp>
```

</div>

Ahora pruébalo tú mismo en el editor.