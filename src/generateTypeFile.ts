import { generateType } from './types';
import { ResolvedConfig } from 'vite';
const chalk = require("chalk");
const path = require('path')
const fs = require('fs')
const glob = require('fast-glob')
const { Project } = require('ts-morph')

export default async function generateTypeFile(options:generateType, config:ResolvedConfig) {
  if (options.disable) return;
  // 这部分内容具体可以查阅 ts-morph 的文档
  // 这里仅需要知道这是用来处理 ts 文件并生成类型声明文件即可
  const project = new Project({
    compilerOptions: {
      declaration: options.declaration,
      emitDeclarationOnly: options.emitDeclarationOnly,
      noEmitOnError: options.noEmitOnError,
      allowJs: options.allowJs, // 如果想兼容 js 语法需要加上
      outDir: options.outDir || config.build.outDir || 'dist' // 可以设置自定义的打包文件夹，如 'types'
    },
    // config.build.outDir || 'dist'
    tsConfigFilePath: path.resolve(path.join(config.root), options.tsConfigFilePath),
    skipAddingFilesFromTsConfig: options.skipAddingFilesFromTsConfig
  })

  // 获取 src 下的 .ts 文件
  const files = await glob(options.files);
  
  const sourceFiles:Array<any> = [];

  await Promise.all(
    files.map(async (file:any) => {
      // 添加声明文件
      // console.log(file)
      sourceFiles.push(project.addSourceFileAtPath(file));
    })
  )

  const diagnostics = project.getPreEmitDiagnostics();

  // 输出解析过程中的错误信息
  console.log(project.formatDiagnosticsWithColorAndContext(diagnostics));

  project.emitToMemory();
  let filePathList = [];
  // 随后将解析完的文件写到对应文件下
  for (const sourceFile of sourceFiles) {
    const emitOutput = sourceFile.getEmitOutput();
    for (const outputFile of emitOutput.getOutputFiles()) {
      const filePath = outputFile.getFilePath();
      filePathList.push(filePath);
      await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
      await fs.promises.writeFile(filePath, outputFile.getText(), 'utf8');
    }
  }
  options.verbose && filePathList.length > 0 && handleOutputLogger(config, filePathList);
}
// 日志输出
function handleOutputLogger (config: ResolvedConfig, filePath:Array<string>) {
  config.logger.info(`\n${chalk.cyan('✨ [vite-plugin-generatetypefile]:compressed file successfully: ')}`);
  filePath.forEach((name) => {
    config.logger.info(`${chalk.blueBright(name)}`)
  })
  config.logger.info('\n');
}