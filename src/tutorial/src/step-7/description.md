# Renderizado de Lista {#list-rendering}

Podemos usar la directiva `v-for` para renderizar una lista de elementos basándose en un array de origen:

```vue-html
<ul>
  <li v-for="todo in todos" :key="todo.id">
    {{ todo.text }}
  </li>
</ul>
```

Aquí `todo` es una variable local que representa el elemento del array que se está iterando actualmente. Solo es accesible en o dentro del elemento `v-for`, similar a un ámbito de función.

Observa cómo también estamos dando a cada objeto `todo` un `id` único, y lo estamos enlazando como el <a target="_blank" href="/api/built-in-special-attributes.html#key">atributo `key` especial</a> para cada `<li>`. La `key` permite a Vue mover con precisión cada `<li>` para que coincida con la posición de su objeto correspondiente en el array.

Hay dos maneras de actualizar la lista:

1. Llamar a [métodos de mutación](https://stackoverflow.com/questions/9009879/which-javascript-array-functions-are-mutating) en el array de origen:

   <div class="composition-api">

   ```js
   todos.value.push(newTodo)
   ```

     </div>
     <div class="options-api">

   ```js
   this.todos.push(newTodo)
   ```

   </div>

2. Reemplazar el array por uno nuevo:

   <div class="composition-api">

   ```js
   todos.value = todos.value.filter(/* ... */)
   ```

     </div>
     <div class="options-api">

   ```js
   this.todos = this.todos.filter(/* ... */)
   ```

   </div>

Aquí tenemos una lista de tareas `todo` sencilla: ¡intenta implementar la lógica para los métodos `addTodo()` y `removeTodo()` para hacer que funcione!

Más detalles sobre `v-for`: <a target="_blank" href="/guide/essentials/list.html">Guía - Renderizado de Lista</a>