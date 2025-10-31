---
outline: deep
---

# Atributos de Fallthrough {#fallthrough-attributes}

> Esta página asume que ya has leído lo básico sobre [Componentes](/guide/essentials/component-basics). Léelo primero si eres nuevo en los componentes.

## Herencia de Atributos {#attribute-inheritance}

Un "atributo de fallthrough" es un atributo o un `v-on` event listener que se pasa a un componente, pero que no está declarado explícitamente en las [props](./props) o [emits](./events#declaring-emitted-events) del componente receptor. Ejemplos comunes de esto incluyen los atributos `class`, `style` e `id`.

Cuando un componente renderiza un único elemento raíz, los atributos de fallthrough se añadirán automáticamente a los atributos del elemento raíz. Por ejemplo, dado un componente `<MyButton>` con la siguiente plantilla:

```vue-html
<!-- template of <MyButton> -->
<button>Click Me</button>
```

Y un padre usando este componente con:

```vue-html
<MyButton class="large" />
```

El DOM renderizado final sería:

```html
<button class="large">Click Me</button>
```

Aquí, `<MyButton>` no declaró `class` como una prop aceptada. Por lo tanto, `class` se trata como un atributo de fallthrough y se añade automáticamente al elemento raíz de `<MyButton>`.

### Fusión de `class` y `style` {#class-and-style-merging}

Si el elemento raíz del componente hijo ya tiene atributos `class` o `style` existentes, se fusionarán con los valores `class` y `style` que se heredan del padre. Supongamos que cambiamos la plantilla de `<MyButton>` en el ejemplo anterior a:

```vue-html
<!-- template of <MyButton> -->
<button class="btn">Click Me</button>
```

Entonces el DOM renderizado final ahora sería:

```html
<button class="btn large">Click Me</button>
```

### Herencia de Listeners `v-on` {#v-on-listener-inheritance}

La misma regla se aplica a los `v-on` event listeners:

```vue-html
<MyButton @click="onClick" />
```

El listener `click` se añadirá al elemento raíz de `<MyButton>`, es decir, al elemento nativo `<button>`. Cuando se haga clic en el `<button>` nativo, se activará el método `onClick` del componente padre. Si el `<button>` nativo ya tiene un listener `click` enlazado con `v-on`, entonces ambos listeners se activarán.

### Herencia de Componentes Anidados {#nested-component-inheritance}

Si un componente renderiza otro componente como su nodo raíz, por ejemplo, refactorizamos `<MyButton>` para renderizar un `<BaseButton>` como su raíz:

```vue-html
<!-- template of <MyButton/> that simply renders another component -->
<BaseButton />
```

Entonces los atributos de fallthrough recibidos por `<MyButton>` se reenviarán automáticamente a `<BaseButton>`.

Ten en cuenta que:

1.  Los atributos reenviados no incluyen ningún atributo que esté declarado como `props`, o `v-on` listeners de eventos declarados por `<MyButton>` - en otras palabras, las `props` y los listeners declarados han sido "consumidos" por `<MyButton>`.

2.  Los atributos reenviados pueden ser aceptados como `props` por `<BaseButton>`, si son declarados por este.

## Deshabilitar la Herencia de Atributos {#disabling-attribute-inheritance}

Si **no** quieres que un componente herede atributos automáticamente, puedes establecer `inheritAttrs: false` en las opciones del componente.

<div class="composition-api">

Desde la versión 3.3 también puedes usar [`defineOptions`](/api/sfc-script-setup#defineoptions) directamente en `<script setup>`:

```vue
<script setup>
defineOptions({
  inheritAttrs: false
})
// ...setup logic
</script>
```

</div>

El escenario común para deshabilitar la herencia de atributos es cuando los atributos necesitan aplicarse a otros elementos además del nodo raíz. Al establecer la opción `inheritAttrs` en `false`, puedes tener control total sobre dónde deben aplicarse los atributos de fallthrough.

Estos atributos de fallthrough pueden ser accedidos directamente en las expresiones de plantilla como `$attrs`:

```vue-html
<span>Fallthrough attributes: {{ $attrs }}</span>
```

El objeto `$attrs` incluye todos los atributos que no están declarados por las opciones `props` o `emits` del componente (por ejemplo, `class`, `style`, `v-on` listeners, etc.).

Algunas notas:

-   A diferencia de las `props`, los atributos de fallthrough conservan su casing original en JavaScript, por lo que un atributo como `foo-bar` debe ser accedido como `$attrs['foo-bar']`.

-   Un `v-on` event listener como `@click` se expondrá en el objeto como una función bajo `$attrs.onClick`.

Usando nuestro ejemplo de componente `<MyButton>` de la [sección anterior](#attribute-inheritance) - a veces podemos necesitar envolver el elemento `<button>` real con un `<div>` extra para propósitos de estilo:

```vue-html
<div class="btn-wrapper">
  <button class="btn">Click Me</button>
</div>
```

Queremos que todos los atributos de fallthrough como `class` y los listeners `v-on` se apliquen al `<button>` interno, no al `<div>` externo. Podemos lograr esto con `inheritAttrs: false` y `v-bind="$attrs"`:

```vue-html{2}
<div class="btn-wrapper">
  <button class="btn" v-bind="$attrs">Click Me</button>
</div>
```

Recuerda que [`v-bind` sin un argumento](/guide/essentials/template-syntax#dynamically-binding-multiple-attributes) enlaza todas las propiedades de un objeto como atributos del elemento objetivo.

## Herencia de Atributos en Nodos Raíz Múltiples {#attribute-inheritance-on-multiple-root-nodes}

A diferencia de los componentes con un único nodo raíz, los componentes con múltiples nodos raíz no tienen un comportamiento automático de fallthrough de atributos. Si `$attrs` no están enlazados explícitamente, se emitirá una advertencia en tiempo de ejecución.

```vue-html
<CustomLayout id="custom-layout" @click="changeValue" />
```

Si `<CustomLayout>` tiene la siguiente plantilla multi-raíz, habrá una advertencia porque Vue no puede estar seguro de dónde aplicar los atributos de fallthrough:

```vue-html
<header>...</header>
<main>...</main>
<footer>...</footer>
```

La advertencia se suprimirá si `$attrs` se enlaza explícitamente:

```vue-html{2}
<header>...</header>
<main v-bind="$attrs">...</main>
<footer>...</footer>
```

## Acceder a los Atributos de Fallthrough en JavaScript {#accessing-fallthrough-attributes-in-javascript}

<div class="composition-api">

Si es necesario, puedes acceder a los atributos de fallthrough de un componente en `<script setup>` usando la API `useAttrs()`:

```vue
<script setup>
import { useAttrs } from 'vue'

const attrs = useAttrs()
</script>
```

Si no estás usando `<script setup>`, `attrs` se expondrá como una propiedad del contexto `setup()`:

```js
export default {
  setup(props, ctx) {
    // fallthrough attributes are exposed as ctx.attrs
    console.log(ctx.attrs)
  }
}
```

Ten en cuenta que, aunque el objeto `attrs` siempre refleja los últimos atributos de fallthrough, no es reactivo (por razones de rendimiento). No puedes usar `watchers` para observar sus cambios. Si necesitas reactividad, usa una `prop`. Alternativamente, puedes usar `onUpdated()` para realizar efectos secundarios con los últimos `attrs` en cada actualización.

</div>

<div class="options-api">

Si es necesario, puedes acceder a los atributos de fallthrough de un componente a través de la propiedad de instancia `$attrs`:

```js
export default {
  created() {
    console.log(this.$attrs)
  }
}
```

</div>