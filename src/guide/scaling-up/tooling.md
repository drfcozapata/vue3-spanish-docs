<script setup>
import { VTCodeGroup, VTCodeGroupTab } from '@vue/theme'
</script>

# Herramientas {#tooling}

## Pruébalo Online {#try-it-online}

No necesitas instalar nada en tu máquina para probar los SFC de Vue; hay entornos de pruebas online que te permiten hacerlo directamente en el navegador:

- [Vue SFC Playground](https://play.vuejs.org)
  - Siempre desplegado desde el último commit
  - Diseñado para inspeccionar los resultados de la compilación de componentes
- [Vue + Vite on StackBlitz](https://vite.new/vue)
  - Entorno tipo IDE ejecutando un servidor de desarrollo Vite real en el navegador
  - Lo más parecido a una configuración local

También se recomienda usar estos entornos de pruebas online para proporcionar reproducciones al reportar errores.

## Andamiaje de Proyectos {#project-scaffolding}

### Vite {#vite}

[Vite](https://vitejs.dev/) es una herramienta de construcción ligera y rápida con soporte de primera clase para SFC de Vue. ¡Fue creado por Evan You, quien también es el autor de Vue!

Para empezar con Vite + Vue, simplemente ejecuta:

::: code-group

```sh [npm]
$ npm create vue@latest
```

```sh [pnpm]
$ pnpm create vue@latest
```
  
```sh [yarn]
# Para Yarn Modern (v2+)
$ yarn create vue@latest
  
# Para Yarn ^v4.11
$ yarn dlx create-vue@latest
```
  
```sh [bun]
$ bun create vue@latest
```

:::

Este comando instalará y ejecutará [create-vue](https://github.com/vuejs/create-vue), la herramienta oficial de andamiaje de proyectos de Vue.

- Para aprender más sobre Vite, consulta la [documentación de Vite](https://vitejs.dev).
- Para configurar el comportamiento específico de Vue en un proyecto Vite, por ejemplo, pasando opciones al compilador de Vue, consulta la documentación de [@vitejs/plugin-vue](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue#readme).

Ambos entornos de pruebas online mencionados anteriormente también soportan la descarga de archivos como un proyecto Vite.

### Vue CLI {#vue-cli}

[Vue CLI](https://cli.vuejs.org/) es la cadena de herramientas oficial basada en webpack para Vue. Ahora está en modo de mantenimiento y recomendamos iniciar nuevos proyectos con Vite a menos que dependas de características específicas solo de webpack. Vite proporcionará una experiencia de desarrollo superior en la mayoría de los casos.

Para obtener información sobre la migración de Vue CLI a Vite:

- [Guía de Migración de Vue CLI -> Vite de VueSchool.io](https://vueschool.io/articles/vuejs-tutorials/how-to-migrate-from-vue-cli-to-vite/)
- [Herramientas / Plugins que ayudan con la auto-migración](https://github.com/vitejs/awesome-vite#vue-cli)

### Nota sobre la Compilación de Plantillas en el Navegador {#note-on-in-browser-template-compilation}

Al usar Vue sin un paso de construcción, las plantillas de componentes se escriben directamente en el HTML de la página o como cadenas de JavaScript en línea. En tales casos, Vue necesita enviar el compilador de plantillas al navegador para realizar la compilación de plantillas sobre la marcha. Por otro lado, el compilador sería innecesario si precompilamos las plantillas con un paso de construcción. Para reducir el tamaño del paquete del cliente, Vue proporciona [diferentes "builds"](https://unpkg.com/browse/vue@3/dist/) optimizados para diferentes casos de uso.

- Los archivos de build que comienzan con `vue.runtime.*` son **builds solo en tiempo de ejecución**: no incluyen el compilador. Al usar estos builds, todas las plantillas deben ser precompiladas a través de un paso de construcción.

- Los archivos de build que no incluyen `.runtime` son **builds completos**: incluyen el compilador y soportan la compilación de plantillas directamente en el navegador. Sin embargo, aumentarán la carga útil en ~14kb.

Nuestras configuraciones de herramientas predeterminadas usan el build solo en tiempo de ejecución, ya que todas las plantillas en SFCs están precompiladas. Si, por alguna razón, necesitas la compilación de plantillas en el navegador incluso con un paso de construcción, puedes hacerlo configurando la herramienta de construcción para que `vue` sea un alias de `vue/dist/vue.esm-bundler.js` en su lugar.

Si estás buscando una alternativa más ligera para el uso sin paso de construcción, echa un vistazo a [petite-vue](https://github.com/vuejs/petite-vue).

## Soporte para IDE {#ide-support}

- La configuración de IDE recomendada es [VS Code](https://code.visualstudio.com/) + la [extensión Vue - Official](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (anteriormente Volar). La extensión proporciona resaltado de sintaxis, soporte de TypeScript e intellisense para expresiones de plantilla y `props` de componentes.

  :::tip
  Vue - Official reemplaza a [Vetur](https://marketplace.visualstudio.com/items?itemName=octref.vetur), nuestra extensión oficial anterior de VS Code para Vue 2. Si tienes Vetur instalado actualmente, asegúrate de deshabilitarlo en proyectos de Vue 3.
  :::

- [WebStorm](https://www.jetbrains.com/webstorm/) también proporciona un excelente soporte incorporado para SFCs de Vue.

- Otros IDEs que soportan el [Protocolo de Servicio de Lenguaje](https://microsoft.github.io/language-server-protocol/) (LSP) también pueden aprovechar las funcionalidades principales de Volar a través de LSP:

  - Soporte para Sublime Text a través de [LSP-Volar](https://github.com/sublimelsp/LSP-volar).

  - Soporte para vim / Neovim a través de [coc-volar](https://github.com/yaegassy/coc-volar).

  - Soporte para emacs a través de [lsp-mode](https://emacs-lsp.github.io/lsp-mode/page/lsp-volar/)

## Herramientas de Desarrollo del Navegador {#browser-devtools}

La extensión de herramientas de desarrollo del navegador de Vue te permite explorar el árbol de componentes de una aplicación Vue, inspeccionar el estado de los componentes individuales, rastrear eventos de gestión de estado y perfilar el rendimiento.

![devtools screenshot](./images/devtools.png)

- [Documentación](https://devtools.vuejs.org/)
- [Extensión de Chrome](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
- [Plugin de Vite](https://devtools.vuejs.org/guide/vite-plugin)
- [Aplicación Electron independiente](https://devtools.vuejs.org/guide/standalone)

## TypeScript {#typescript}

Artículo principal: [Uso de Vue con TypeScript](/guide/typescript/overview).

- La [extensión Vue - Official](https://github.com/vuejs/language-tools) proporciona verificación de tipos para SFCs usando bloques `<script lang="ts">`, incluyendo expresiones de plantilla y validación de `props` entre componentes.

- Usa [`vue-tsc`](https://github.com/vuejs/language-tools/tree/master/packages/tsc) para realizar la misma verificación de tipos desde la línea de comandos, o para generar archivos `d.ts` para SFCs.

## Pruebas {#testing}

Artículo principal: [Guía de Pruebas](/guide/scaling-up/testing).

- [Cypress](https://www.cypress.io/) se recomienda para pruebas E2E. También se puede usar para pruebas de componentes para SFCs de Vue a través del [Cypress Component Test Runner](https://docs.cypress.io/guides/component-testing/introduction).

- [Vitest](https://vitest.dev/) es un ejecutor de pruebas creado por los miembros del equipo de Vue / Vite que se centra en la velocidad. Está diseñado específicamente para aplicaciones basadas en Vite para proporcionar el mismo ciclo de retroalimentación instantánea para pruebas unitarias / de componentes.

- [Jest](https://jestjs.io/) se puede hacer funcionar con Vite a través de [vite-jest](https://github.com/sodatea/vite-jest). Sin embargo, esto solo se recomienda si tienes suites de pruebas existentes basadas en Jest que necesitas migrar a una configuración basada en Vite, ya que Vitest proporciona funcionalidades similares con una integración mucho más eficiente.

## Análisis de Código {#linting}

El equipo de Vue mantiene [eslint-plugin-vue](https://github.com/vuejs/eslint-plugin-vue), un plugin de [ESLint](https://eslint.org/) que soporta reglas de análisis de código específicas de SFC.

Los usuarios que usaban Vue CLI pueden estar acostumbrados a tener linters configurados a través de loaders de webpack. Sin embargo, al usar una configuración de construcción basada en Vite, nuestra recomendación general es:

1. `npm install -D eslint eslint-plugin-vue`, luego sigue la [guía de configuración](https://eslint.vuejs.org/user-guide/#usage) de `eslint-plugin-vue`.

2. Configura extensiones de IDE de ESLint, por ejemplo [ESLint para VS Code](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint), para que recibas retroalimentación del linter directamente en tu editor durante el desarrollo. Esto también evita costos innecesarios de análisis de código al iniciar el servidor de desarrollo.

3. Ejecuta ESLint como parte del comando de construcción de producción, para que recibas retroalimentación completa del linter antes de desplegar a producción.

4. (Opcional) Configura herramientas como [lint-staged](https://github.com/okonet/lint-staged) para analizar automáticamente los archivos modificados en cada `git commit`.

## Formato {#formatting}

- La extensión [Vue - Official](https://github.com/vuejs/language-tools) de VS Code proporciona formato para SFCs de Vue de forma predeterminada.

- Alternativamente, [Prettier](https://prettier.io/) proporciona soporte integrado para el formato de SFCs de Vue.

## Integraciones de Bloques Personalizados de SFC {#sfc-custom-block-integrations}

Los bloques personalizados se compilan en imports al mismo archivo Vue con diferentes consultas de solicitud. Depende de la herramienta de construcción subyacente manejar estas solicitudes de importación.

- Si usas Vite, se debe usar un plugin personalizado de Vite para transformar los bloques personalizados coincidentes en JavaScript ejecutable. [Ejemplo](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue#example-for-transforming-custom-blocks)

- Si usas Vue CLI o webpack plano, se debe configurar un loader de webpack para transformar los bloques coincidentes. [Ejemplo](https://vue-loader.vuejs.org/guide/custom-blocks.html)

## Paquetes de Nivel Inferior {#lower-level-packages}

### `@vue/compiler-sfc` {#vue-compiler-sfc}

- [Documentación](https://github.com/vuejs/core/tree/main/packages/compiler-sfc)

Este paquete es parte del monorepo central de Vue y siempre se publica con la misma versión que el paquete principal `vue`. Se incluye como una dependencia del paquete principal `vue` y se proxy bajo `vue/compiler-sfc` para que no necesites instalarlo individualmente.

El paquete en sí proporciona utilidades de nivel inferior para procesar SFCs de Vue y está destinado solo a autores de herramientas que necesitan soportar SFCs de Vue en herramientas personalizadas.

:::tip
Siempre prefiere usar este paquete a través del import profundo `vue/compiler-sfc`, ya que esto asegura que su versión esté sincronizada con el tiempo de ejecución de Vue.
:::

### `@vitejs/plugin-vue` {#vitejs-plugin-vue}

- [Documentación](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue)

Plugin oficial que proporciona soporte para SFCs de Vue en Vite.

### `vue-loader` {#vue-loader}

- [Documentación](https://vue-loader.vuejs.org/)

El loader oficial que proporciona soporte para SFCs de Vue en webpack. Si estás usando Vue CLI, consulta también la [documentación sobre cómo modificar las opciones de `vue-loader` en Vue CLI](https://cli.vuejs.org/guide/webpack.html#modifying-options-of-a-loader).

## Otros Entornos de Pruebas Online {#other-online-playgrounds}

- [VueUse Playground](https://play.vueuse.org)
- [Vue + Vite en Repl.it](https://replit.com/@templates/VueJS-with-Vite)
- [Vue en CodeSandbox](https://codesandbox.io/p/devbox/github/codesandbox/sandbox-templates/tree/main/vue-vite)
- [Vue en Codepen](https://codepen.io/pen/editor/vue)
- [Vue en WebComponents.dev](https://webcomponents.dev/create/cevue)

<!-- TODO ## Backend Framework Integrations -->