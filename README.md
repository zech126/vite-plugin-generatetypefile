# 安装
yarn add vite-plugin-generatetypefile -D

或

npm i vite-plugin-generatetypefile -D

cnpm install vite-plugin-generatetypefile -D

# vite 使用
```js
  import { defineConfig } from 'vite';
  import vue from '@vitejs/plugin-vue';
  import vitePluginGenerateTypeFile from "vite-plugin-generatetypefile";

  export default defineConfig({
    plugins: [
      vue(),
      vitePluginGenerateTypeFile()
    ]
  })
  // 或
  export default defineConfig({
    plugins: [
      vue(),
      vitePluginGenerateTypeFile({
        disable: false,
        files: ['src/**/*.ts'],
        tsConfigFilePath: './tsconfig.json',
        outDir: 'dist',
        allowJs: true,
        declaration: true,
        emitDeclarationOnly:true,
        noEmitOnError:true,
        skipAddingFilesFromTsConfig: true,
        success: () => {}
      })
    ]
  })
```