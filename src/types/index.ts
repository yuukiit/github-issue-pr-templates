export interface InstallOptions {
  all?: boolean;
  type?: string[];
  claude?: boolean;
  force?: boolean;
}

export interface TemplateInfo {
  name: string;
  file: string;
  type: string;
  description: string;
}

export interface CLICommand {
  name: string;
  description: string;
  action: (...args: any[]) => Promise<void> | void;
}

export interface RemoveOptions {
  all?: boolean;
  type?: string[];
  force?: boolean;
}

export interface UpdateOptions {
  force?: boolean;
}

export type TemplateType = 'bug' | 'feature' | 'question' | 'documentation' | 'performance' | 'typo' | 'pr' | 'claude' | 'contributing';

export interface TemplateConfig {
  sourceDir: string;
  targetDir: string;
  files: TemplateInfo[];
}