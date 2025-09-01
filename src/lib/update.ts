import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { 
  getAllTemplates,
  getTargetPath, 
  getTemplateType,
  getTemplatesPath
} from './templates';
import type { UpdateOptions, TemplateInfo } from '../types';

const updateTemplate = async (
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
  
  // ターゲットファイルが存在しない場合はスキップ
  if (!await fs.pathExists(targetFile)) {
    console.log(chalk.gray(`⏭️  ${templateInfo.file} は存在しません（スキップ）`));
    return;
  }
  
  try {
    // ソースファイルとターゲットファイルの内容を比較
    const sourceContent = await fs.readFile(sourceFile, 'utf-8');
    const targetContent = await fs.readFile(targetFile, 'utf-8');
    
    if (sourceContent === targetContent) {
      console.log(chalk.gray(`✅ ${templateInfo.name} は既に最新です`));
      return;
    }
    
    if (!force) {
      const { update } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'update',
          message: `${templateInfo.name} を更新しますか？`,
          default: true
        }
      ]);
      
      if (!update) {
        console.log(chalk.yellow(`⏭️  ${templateInfo.name} の更新をスキップしました`));
        return;
      }
    }
    
    await fs.copy(sourceFile, targetFile);
    console.log(chalk.green(`🔄 ${templateInfo.name} を更新しました`));
    
  } catch (error) {
    console.error(chalk.red(`❌ ${templateInfo.name} の更新に失敗しました:`), error);
    throw error;
  }
};

const getInstalledTemplates = async (): Promise<TemplateInfo[]> => {
  const allTemplates = getAllTemplates();
  const installedTemplates: TemplateInfo[] = [];
  
  for (const template of allTemplates) {
    const templateType = getTemplateType(template.type);
    const targetDir = getTargetPath(templateType);
    
    let targetFile: string;
    if (templateType === 'issue') {
      targetFile = path.join(targetDir, template.file);
    } else if (templateType === 'claude') {
      targetFile = path.join(targetDir, template.file);
    } else {
      targetFile = path.join(targetDir, template.file);
    }
    
    if (await fs.pathExists(targetFile)) {
      installedTemplates.push(template);
    }
  }
  
  return installedTemplates;
};

export const updateTemplates = async (options: UpdateOptions): Promise<void> => {
  console.log(chalk.blue.bold('🔄 GitHub Issue/PRテンプレートを更新します\n'));
  
  // インストール済みのテンプレートを確認
  const installedTemplates = await getInstalledTemplates();
  
  if (installedTemplates.length === 0) {
    console.log(chalk.yellow('⚠️  更新対象のテンプレートが見つかりません'));
    console.log(chalk.gray('テンプレートをインストールするには: github-templates install'));
    return;
  }
  
  console.log(chalk.blue(`📦 ${installedTemplates.length}個のインストール済みテンプレートを確認しました\n`));
  
  // 更新前の確認（forceオプションが無い場合）
  if (!options.force) {
    console.log(chalk.yellow('📋 更新対象のテンプレート:'));
    installedTemplates.forEach(template => {
      console.log(chalk.gray(`  - ${template.name} (${template.file})`));
    });
    
    const { confirmUpdate } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirmUpdate',
        message: '\nテンプレートの更新を実行しますか？',
        default: true
      }
    ]);
    
    if (!confirmUpdate) {
      console.log(chalk.yellow('❌ 更新をキャンセルしました'));
      return;
    }
  }
  
  console.log(chalk.blue(`\n🔄 テンプレートを更新しています...\n`));
  
  // テンプレートを順次更新
  let updatedCount = 0;
  for (const template of installedTemplates) {
    try {
      const beforeUpdate = await fs.readFile(
        path.join(
          getTargetPath(getTemplateType(template.type)), 
          template.file
        ), 
        'utf-8'
      ).catch(() => '');
      
      await updateTemplate(template, options.force);
      
      const afterUpdate = await fs.readFile(
        path.join(
          getTargetPath(getTemplateType(template.type)), 
          template.file
        ), 
        'utf-8'
      ).catch(() => '');
      
      if (beforeUpdate !== afterUpdate) {
        updatedCount++;
      }
    } catch (error) {
      console.error(chalk.red(`❌ ${template.name} の更新中にエラーが発生しました`));
      if (!options.force) {
        throw error;
      }
    }
  }
  
  if (updatedCount > 0) {
    console.log(chalk.green.bold(`\n🎉 ${updatedCount}個のテンプレートを更新しました！\n`));
    
    console.log(chalk.gray('💡 次の手順:'));
    console.log(chalk.gray('   1. 変更内容を確認してください'));
    console.log(chalk.gray('   2. GitHubリポジトリにコミット・プッシュしてください'));
  } else {
    console.log(chalk.green.bold('\n✅ 全てのテンプレートは既に最新です！\n'));
  }
  
  // 更新後の案内
  console.log(chalk.blue('📋 更新されたテンプレートはGitHubで利用できます'));
  console.log(chalk.gray('   - Issueテンプレート: リポジトリでIssue作成時に表示'));
  console.log(chalk.gray('   - PRテンプレート: プルリクエスト作成時に自動適用'));
};