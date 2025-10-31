---
outline: deep
---

<script setup>
import { ref, onMounted } from 'vue'

const version = ref()

onMounted(async () => {
  const res = await fetch('https://api.github.com/repos/vuejs/core/releases/latest')
  version.value = (await res.json()).name
})
</script>

# Lanzamientos {#releases}

<p v-if="version">
La versión estable más reciente actual de Vue es <strong>{{ version }}</strong>.
</p>
<p v-else>
Comprobando la última versión...
</p>

Un registro completo de cambios de lanzamientos anteriores está disponible en [GitHub](https://github.com/vuejs/core/blob/main/CHANGELOG.md).

## Ciclo de Lanzamiento {#release-cycle}

Vue no tiene un ciclo de lanzamiento fijo.

- Los lanzamientos de parches se publican según sea necesario.

- Los lanzamientos menores siempre contienen nuevas características, con un plazo típico de 3 a 6 meses entre ellos. Los lanzamientos menores siempre pasan por una fase de prelanzamiento beta.

- Los lanzamientos mayores se anunciarán con antelación y pasarán por una fase de discusión temprana y fases de prelanzamiento alfa / beta.

## Casos Especiales de Versionado Semántico {#semantic-versioning-edge-cases}

Los lanzamientos de Vue siguen el [Versionado Semántico](https://semver.org/) con algunos casos especiales.

### Definiciones de TypeScript {#typescript-definitions}

Podemos enviar cambios incompatibles a las definiciones de TypeScript entre versiones **menores**. Esto se debe a que:

1. A veces, TypeScript mismo envía cambios incompatibles entre versiones menores, y es posible que tengamos que ajustar los tipos para admitir versiones más nuevas de TypeScript.

2. Ocasionalmente, podemos necesitar adoptar características que solo están disponibles en una versión más nueva de TypeScript, aumentando la versión mínima requerida de TypeScript.

Si estás utilizando TypeScript, puedes usar un rango semver que bloquee la versión menor actual y actualizar manualmente cuando se lance una nueva versión menor de Vue.

### Compatibilidad de Código Compilado con un Runtime Anterior {#compiled-code-compatibility-with-older-runtime}

Una versión **menor** más reciente del compilador de Vue puede generar código que no sea compatible con el runtime de Vue de una versión menor anterior. Por ejemplo, el código generado por el compilador de Vue 3.2 puede no ser totalmente compatible si es consumido por el runtime de Vue 3.1.

Esto solo es una preocupación para los autores de librerías, porque en las aplicaciones, la versión del compilador y la versión del runtime siempre son las mismas. Una falta de coincidencia de versiones solo puede ocurrir si distribuyes código de componentes de Vue precompilado como un paquete, y un consumidor lo usa en un proyecto que utiliza una versión anterior de Vue. Como resultado, tu paquete puede necesitar declarar explícitamente una versión menor mínima requerida de Vue.

## Prelanzamientos {#pre-releases}

Los lanzamientos menores suelen pasar por un número no fijo de lanzamientos beta. Los lanzamientos mayores pasarán por una fase alfa y una fase beta.

Además, publicamos lanzamientos canary cada semana desde las ramas `main` y `minor` en GitHub. Se publican como paquetes diferentes para evitar inflar los metadatos de npm del canal estable. Puedes instalarlos a través de `npx install-vue@canary` o `npx install-vue@canary-minor`, respectivamente.

Los prelanzamientos están destinados a pruebas de integración / estabilidad, y para que los primeros en adoptarlos proporcionen comentarios sobre características inestables. No uses prelanzamientos en producción. Todos los prelanzamientos se consideran inestables y pueden enviar cambios drásticos entre ellos, así que siempre fija las versiones exactas cuando uses prelanzamientos.

## Características Obsoletas {#deprecations}

Podemos, periódicamente, declarar obsoletas características que tienen reemplazos nuevos y mejores en lanzamientos menores. Las características obsoletas seguirán funcionando y serán eliminadas en el próximo lanzamiento mayor después de que hayan entrado en estado obsoleto.

## RFCs {#rfcs}

Las nuevas características con una superficie de API sustancial y los cambios importantes en Vue pasarán por el proceso de **Solicitud de Comentarios** (RFC). El proceso RFC tiene como objetivo proporcionar una ruta consistente y controlada para que las nuevas características entren en el framework, y dar a los usuarios la oportunidad de participar y ofrecer comentarios en el proceso de diseño.

El proceso RFC se lleva a cabo en el repositorio [vuejs/rfcs](https://github.com/vuejs/rfcs) en GitHub.

## Características Experimentales {#experimental-features}

Algunas características se envían y documentan en una versión estable de Vue, pero se marcan como experimentales. Las características experimentales suelen ser características que tienen una discusión RFC asociada con la mayoría de los problemas de diseño resueltos en papel, pero que aún carecen de comentarios del uso en el mundo real.

El objetivo de las características experimentales es permitir a los usuarios proporcionar comentarios sobre ellas probándolas en un entorno de producción, sin tener que usar una versión inestable de Vue. Las características experimentales en sí mismas se consideran inestables y solo deben usarse de manera controlada, con la expectativa de que la característica pueda cambiar entre cualquier tipo de lanzamiento.