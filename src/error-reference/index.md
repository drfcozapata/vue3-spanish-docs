<script setup>
import { ref, onMounted } from 'vue'
import { data } from './errors.data.ts'
import ErrorsTable from './ErrorsTable.vue'

const highlight = ref()
onMounted(() => {
  highlight.value = location.hash.slice(1)
})
</script>

# Referencia de Códigos de Error de Producción {#error-reference}

## Errores en Tiempo de Ejecución {#runtime-errors}

En compilaciones de producción, el tercer argumento pasado a las siguientes APIs de manejo de errores será un código corto en lugar de la cadena de información completa:

- [`app.config.errorHandler`](/api/application#app-config-errorhandler)
- [`onErrorCaptured`](/api/composition-api-lifecycle#onerrorcaptured) (API de Composición)
- [`errorCaptured`](/api/options-lifecycle#errorcaptured) (API de Opciones)

La siguiente tabla mapea los códigos a sus cadenas de información completas originales.

<ErrorsTable kind="runtime" :errors="data.runtime" :highlight="highlight" />

## Errores del Compilador {#compiler-errors}

La siguiente tabla proporciona un mapeo de los códigos de error del compilador de producción a sus mensajes originales.

<ErrorsTable kind="compiler" :errors="data.compiler" :highlight="highlight" />