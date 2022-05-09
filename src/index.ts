import type { Plugin, ResolvedConfig } from 'vite';
import { generateType } from './types';
import generateTypeFile from './generateTypeFile';

let config: ResolvedConfig;

export default function compression(options:generateType = {}):Plugin {
  return {
    // 插件名称
    name: 'vite:compressionZip',
    // 该插件在 plugin-vue 插件之后执行
    enforce: 'post',
    // 获取配置
    configResolved (resolvedConfig) {
      config = resolvedConfig;
    },
    // build 时执行
    apply: 'build',
    // 在 vite 本地服务关闭前，rollup 输出文件到目录前调用
    closeBundle () {
      const generateOptions:generateType = {
        disable: false,
        files: ['src/**/*.ts'],
        tsConfigFilePath: './tsconfig.json',
        allowJs: true,
        declaration: true,
        emitDeclarationOnly:true,
        noEmitOnError:true,
        skipAddingFilesFromTsConfig: true,
        verbose: true,
        success: () => {}
      };
      generateTypeFile({...generateOptions, ...options}, config);
    }
  }
}
