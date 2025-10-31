# Ranuras {#slots}

Además de pasar datos a través de `props`, el componente padre también puede pasar fragmentos de plantilla al hijo a través de **ranuras**:

<div class="sfc">

```vue-html
<ChildComp>
  This is some slot content!
</ChildComp>
```

</div>
<div class="html">

```vue-html
<child-comp>
  This is some slot content!
</child-comp>
```

</div>

En el componente hijo, puede renderizar el contenido de ranura del padre usando el elemento `<slot>` como salida:

<div class="sfc">

```vue-html
<!-- in child template -->
<slot/>
```

</div>
<div class="html">

```vue-html
<!-- in child template -->
<slot></slot>
```

</div>

El contenido dentro de la salida `<slot>` será tratado como "contenido de respaldo": se mostrará si el padre no pasó ningún contenido de ranura:

```vue-html
<slot>Fallback content</slot>
```

Actualmente no estamos pasando ningún contenido de ranura a `<ChildComp>`, así que deberías ver el contenido de respaldo. Vamos a proporcionar algo de contenido de ranura al hijo mientras hacemos uso del estado `msg` del padre.