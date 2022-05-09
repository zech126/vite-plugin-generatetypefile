export interface generateType{
  disable?: boolean;
  files?: Array<string>;
  tsConfigFilePath?: string;
  allowJs?: boolean;
  outDir?: string;
  declaration?: boolean;
  emitDeclarationOnly?:boolean;
  noEmitOnError?:boolean;
  skipAddingFilesFromTsConfig?: boolean;
  verbose?:boolean;
  success?: () => void;
}