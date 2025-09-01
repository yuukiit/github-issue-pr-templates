import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { 
  TEMPLATE_CONFIGS, 
  OTHER_TEMPLATES, 
  CLAUDE_TEMPLATES, 
  getTemplatesPath, 
  getTargetPath, 
  getTemplateType,
  getTemplatesByType,
  getAllTemplates
} from './templates';
import type { InstallOptions, TemplateInfo } from '../types';

const copyTemplate = async (
  templateInfo: TemplateInfo, 
  force: boolean = false
): Promise<void> => {
  const templatesPath = getTemplatesPath();
  const templateType = getTemplateType(templateInfo.type);
  const targetDir = getTargetPath(templateType);
  
  let sourceFile: string;
  let targetFile: string;
  
  if (templateType === 'issue') {
    sourceFile = path.join(templatesPath, 'ISSUE_TEMPLATE', templateInfo.file);
    targetFile = path.join(targetDir, templateInfo.file);
  } else if (templateType === 'claude') {
    sourceFile = path.join(templatesPath, 'claude', templateInfo.file);
    targetFile = path.join(targetDir, templateInfo.file);
  } else {
    sourceFile = path.join(templatesPath, templateInfo.file);
    targetFile = path.join(targetDir, templateInfo.file);
  }
  
  if (!force && await fs.pathExists(targetFile)) {
    const { overwrite } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'overwrite',
        message: `${templateInfo.file} は既に存在します。上書きしますか？`,
        default: false
      }
    ]);
    
    if (!overwrite) {
      console.log(chalk.yellow(`⏭️  ${templateInfo.file} をスキップしました`));
      return;
    }
  }
  
  try {
    await fs.ensureDir(targetDir);
    await fs.copy(sourceFile, targetFile);
    console.log(chalk.green(`✅ ${templateInfo.name} をインストールしました`));
  } catch (error) {
    console.error(chalk.red(`❌ ${templateInfo.name} のインストールに失敗しました:`), error);
    throw error;
  }
};

const selectTemplatesInteractively = async (): Promise<TemplateInfo[]> => {
  const choices = [
    {
      name: '🐛 Issue テンプレート',
      value: 'issues',
      checked: true
    },
    {
      name: '📝 プルリクエストテンプレート',
      value: 'pr',
      checked: true
    },
    {
      name: '🤖 Claude Code連携設定',
      value: 'claude',
      checked: false
    }
  ];
  
  const { selectedGroups } = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'selectedGroups',
      message: 'インストールするテンプレートを選択してください:',
      choices,
      validate: (answers) => {
        if (answers.length === 0) {
          return '少なくとも1つのテンプレートを選択してください';
        }
        return true;
      }
    }
  ]);
  
  let selectedTemplates: TemplateInfo[] = [];
  
  if (selectedGroups.includes('issues')) {
    const issueChoices = TEMPLATE_CONFIGS.map(template => ({
      name: `${template.name} - ${template.description}`,
      value: template,
      checked: true
    }));
    
    const { selectedIssues } = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'selectedIssues',
        message: 'Issueテンプレートを選択してください:',
        choices: issueChoices,
        validate: (answers) => {
          if (answers.length === 0) {
            return '少なくとも1つのIssueテンプレートを選択してください';
          }
          return true;
        }
      }
    ]);
    
    selectedTemplates.push(...selectedIssues);
  }
  
  if (selectedGroups.includes('pr')) {
    selectedTemplates.push(OTHER_TEMPLATES.find(t => t.type === 'pr')!);
  }
  
  
  if (selectedGroups.includes('claude')) {
    selectedTemplates.push(...CLAUDE_TEMPLATES);
  }
  
  return selectedTemplates;
};

export const installTemplates = async (options: InstallOptions): Promise<void> => {
  console.log(chalk.blue.bold('🚀 GitHub Issue/PRテンプレートをインストールします\n'));
  
  // package.json の存在確認
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  if (!await fs.pathExists(packageJsonPath)) {
    console.log(chalk.yellow('⚠️  package.json が見つかりません。GitHubリポジトリのルートディレクトリで実行していることを確認してください。'));
  }
  
  let templatesToInstall: TemplateInfo[];
  
  if (options.all) {
    // 全テンプレートをインストール
    templatesToInstall = getAllTemplates();
    if (!options.claude) {
      // --claude オプションが無い場合はClaude関連を除外
      templatesToInstall = templatesToInstall.filter(t => t.type !== 'claude');
    }
  } else if (options.type && options.type.length > 0) {
    // 特定タイプのみインストール
    templatesToInstall = getTemplatesByType(options.type);
    
    if (templatesToInstall.length === 0) {
      console.error(chalk.red('❌ 指定されたタイプのテンプレートが見つかりません'));
      console.log(chalk.gray('利用可能なタイプ: bug, feature, typo, question, documentation, performance, pr, claude'));
      return;
    }
  } else {
    // インタラクティブ選択
    templatesToInstall = await selectTemplatesInteractively();
  }
  
  // Claude Code設定を含める場合
  if (options.claude && !templatesToInstall.some(t => t.type === 'claude')) {
    templatesToInstall.push(...CLAUDE_TEMPLATES);
  }
  
  console.log(chalk.blue(`\n📦 ${templatesToInstall.length}個のテンプレートをインストールします...\n`));
  
  // テンプレートを順次インストール
  for (const template of templatesToInstall) {
    try {
      await copyTemplate(template, options.force);
    } catch (error) {
      console.error(chalk.red(`❌ ${template.name} のインストール中にエラーが発生しました`));
      if (!options.force) {
        throw error;
      }
    }
  }
  
  console.log(chalk.green.bold('\n🎉 インストールが完了しました！\n'));
  
  // インストール後の案内
  const hasIssueTemplates = templatesToInstall.some(t => getTemplateType(t.type) === 'issue');
  const hasPRTemplate = templatesToInstall.some(t => t.type === 'pr');
  const hasClaudeTemplate = templatesToInstall.some(t => t.type === 'claude');
  
  if (hasIssueTemplates) {
    console.log(chalk.blue('📋 Issueテンプレートが .github/ISSUE_TEMPLATE/ にインストールされました'));
  }
  
  if (hasPRTemplate) {
    console.log(chalk.blue('🔀 PRテンプレートが .github/pull_request_template.md にインストールされました'));
  }
  
  if (hasClaudeTemplate) {
    console.log(chalk.blue('🤖 Claude Code設定が .claude/ にインストールされました'));
  }
  
  console.log(chalk.gray('\n💡 次の手順:'));
  console.log(chalk.gray('   1. GitHubリポジトリにコミット・プッシュしてください'));
  console.log(chalk.gray('   2. GitHubでIssueやPRを作成すると、テンプレートが表示されます'));
  
  if (hasClaudeTemplate) {
    console.log(chalk.gray('   3. Claude CodeでIssue/PR作成時に .claude/templates.md を参照してください'));
  }
};