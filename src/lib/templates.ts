import path from 'path';
import chalk from 'chalk';
import type { TemplateInfo, TemplateType } from '../types';

export const TEMPLATE_CONFIGS: TemplateInfo[] = [
  {
    name: 'バグレポート',
    file: 'bug_report.md',
    type: 'bug',
    description: 'バグや不具合を報告するためのテンプレート'
  },
  {
    name: '機能要求',
    file: 'feature_request.md',
    type: 'feature', 
    description: '新しい機能やアイデアを提案するためのテンプレート'
  },
  {
    name: 'Typo・誤字脱字修正',
    file: 'typo_fix.md',
    type: 'typo',
    description: '文言の誤字脱字や表記ゆれの修正を報告するためのテンプレート'
  },
  {
    name: '質問・問い合わせ',
    file: 'question.md',
    type: 'question',
    description: '使い方や仕様に関する質問をするためのテンプレート'
  },
  {
    name: 'ドキュメント改善',
    file: 'documentation.md',
    type: 'documentation',
    description: 'ドキュメントの改善や追加を提案するためのテンプレート'
  },
  {
    name: 'パフォーマンス改善',
    file: 'performance.md',
    type: 'performance',
    description: 'パフォーマンスに関する問題や改善提案をするためのテンプレート'
  }
];

export const OTHER_TEMPLATES: TemplateInfo[] = [
  {
    name: 'プルリクエスト',
    file: 'pull_request_template.md',
    type: 'pr',
    description: 'プルリクエスト作成時のテンプレート'
  },
  {
    name: 'コントリビューション',
    file: 'contributing.md',
    type: 'contributing',
    description: 'プロジェクトへの貢献方法を説明するドキュメント'
  }
];

export const CLAUDE_TEMPLATES: TemplateInfo[] = [
  {
    name: 'Claude Code用テンプレート',
    file: 'templates.md',
    type: 'claude',
    description: 'Claude Code用のIssue/PRテンプレートガイド'
  }
];

export const getAllTemplates = (): TemplateInfo[] => [
  ...TEMPLATE_CONFIGS,
  ...OTHER_TEMPLATES,
  ...CLAUDE_TEMPLATES
];

export const getTemplatesByType = (types: string[]): TemplateInfo[] => {
  const allTemplates = getAllTemplates();
  return allTemplates.filter(template => types.includes(template.type));
};

export const getTemplatesPath = (): string => {
  return path.join(__dirname, '..', '..', 'templates');
};

export const getTargetPath = (type: 'issue' | 'pr' | 'other' | 'claude'): string => {
  const cwd = process.cwd();
  
  switch (type) {
    case 'issue':
      return path.join(cwd, '.github', 'ISSUE_TEMPLATE');
    case 'pr':
      return path.join(cwd, '.github');
    case 'claude':
      return path.join(cwd, '.claude');
    case 'other':
    default:
      return cwd;
  }
};

export const getTemplateType = (templateType: string): 'issue' | 'pr' | 'other' | 'claude' => {
  if (['bug', 'feature', 'typo', 'question', 'documentation', 'performance'].includes(templateType)) {
    return 'issue';
  }
  if (templateType === 'pr') {
    return 'pr';
  }
  if (templateType === 'claude') {
    return 'claude';
  }
  return 'other';
};

export const listTemplates = (): void => {
  console.log(chalk.blue.bold('\n📋 利用可能なテンプレート一覧\n'));
  
  console.log(chalk.yellow.bold('🐛 Issue テンプレート:'));
  TEMPLATE_CONFIGS.forEach(template => {
    console.log(`  ${chalk.green('✓')} ${template.name} (${chalk.cyan(template.type)})`);
    console.log(`    ${chalk.gray(template.description)}`);
  });
  
  console.log(chalk.yellow.bold('\n📝 その他のテンプレート:'));
  OTHER_TEMPLATES.forEach(template => {
    console.log(`  ${chalk.green('✓')} ${template.name} (${chalk.cyan(template.type)})`);
    console.log(`    ${chalk.gray(template.description)}`);
  });
  
  console.log(chalk.yellow.bold('\n🤖 Claude Code連携:'));
  CLAUDE_TEMPLATES.forEach(template => {
    console.log(`  ${chalk.green('✓')} ${template.name} (${chalk.cyan(template.type)})`);
    console.log(`    ${chalk.gray(template.description)}`);
  });
  
  console.log(chalk.blue('\n使用例:'));
  console.log(chalk.gray('  github-templates install --all              # 全テンプレートをインストール'));
  console.log(chalk.gray('  github-templates install --type bug,feature # 特定タイプのみインストール'));
  console.log(chalk.gray('  github-templates install --claude           # Claude Code設定も含める'));
};

export const isValidTemplateType = (type: string): type is TemplateType => {
  const allTypes = getAllTemplates().map(t => t.type);
  return allTypes.includes(type as TemplateType);
};