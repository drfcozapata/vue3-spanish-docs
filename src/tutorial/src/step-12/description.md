# Props {#props}

Un componente hijo puede aceptar entrada desde el padre vía **props**. Primero, necesita declarar las `props` que acepta:

<div class="composition-api">
<div class="sfc">

```vue [ChildComp.vue]
<script setup>
const props = defineProps({
  msg: String
})
</script>
```

Ten en cuenta que `defineProps()` es una macro de tiempo de compilación y no necesita ser importada. Una vez declarada, la `prop` `msg` puede ser usada en la plantilla del componente hijo. También puede ser accedida en JavaScript vía el objeto retornado de `defineProps()`.

</div>

<div class="html">

```js
// in child component
export default {
  props: {
    msg: String
  },
  setup(props) {
    // access props.msg
  }
}
```

Una vez declarada, la `prop` `msg` es expuesta en `this` y puede ser usada en la plantilla del componente hijo. Las `props` recibidas son pasadas a `setup()` como el primer argumento.

</div>

</div>

<div class="options-api">

```js
// in child component
export default {
  props: {
    msg: String
  }
}
```

Una vez declarada, la `prop` `msg` es expuesta en `this` y puede ser usada en la plantilla del componente hijo.

</div>

El padre puede pasar la `prop` al hijo al igual que los atributos. Para pasar un valor dinámico, también podemos usar la sintaxis de `v-bind`:

<div class="sfc">

```vue-html
<ChildComp :msg="greeting" />
```

</div>
<div class="html">

```vue-html
<child-comp :msg="greeting"></child-comp>
```

</div>

Ahora pruébalo tú mismo en el editor.