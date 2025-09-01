import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { 
  getTargetPath, 
  getTemplateType,
  getTemplatesByType,
  getAllTemplates
} from './templates';
import type { RemoveOptions, TemplateInfo } from '../types';

const removeTemplate = async (
  templateInfo: TemplateInfo, 
  force: boolean = false
): Promise<void> => {
  const templateType = getTemplateType(templateInfo.type);
  const targetDir = getTargetPath(templateType);
  
  let targetFile: string;
  
  if (templateType === 'issue') {
    targetFile = path.join(targetDir, templateInfo.file);
  } else if (templateType === 'claude') {
    targetFile = path.join(targetDir, templateInfo.file);
  } else {
    targetFile = path.join(targetDir, templateInfo.file);
  }
  
  if (!await fs.pathExists(targetFile)) {
    console.log(chalk.gray(`⏭️  ${templateInfo.file} は存在しません（スキップ）`));
    return;
  }
  
  if (!force) {
    const { confirmRemove } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirmRemove',
        message: `${templateInfo.file} を削除しますか？`,
        default: false
      }
    ]);
    
    if (!confirmRemove) {
      console.log(chalk.yellow(`⏭️  ${templateInfo.file} の削除をスキップしました`));
      return;
    }
  }
  
  try {
    await fs.remove(targetFile);
    console.log(chalk.green(`✅ ${templateInfo.name} を削除しました`));
    
    // ディレクトリが空の場合は削除
    if (templateType === 'issue') {
      const issueTemplateDir = getTargetPath('issue');
      const files = await fs.readdir(issueTemplateDir).catch(() => []);
      if (files.length === 0) {
        await fs.remove(issueTemplateDir);
        console.log(chalk.gray(`📁 空のディレクトリ ${path.relative(process.cwd(), issueTemplateDir)} を削除しました`));
      }
    }
    
    if (templateType === 'claude') {
      const claudeDir = getTargetPath('claude');
      const files = await fs.readdir(claudeDir).catch(() => []);
      if (files.length === 0) {
        await fs.remove(claudeDir);
        console.log(chalk.gray(`📁 空のディレクトリ ${path.relative(process.cwd(), claudeDir)} を削除しました`));
      }
    }
    
  } catch (error) {
    console.error(chalk.red(`❌ ${templateInfo.name} の削除に失敗しました:`), error);
    throw error;
  }
};

const selectTemplatesToRemove = async (): Promise<TemplateInfo[]> => {
  // 存在するテンプレートファイルを確認
  const allTemplates = getAllTemplates();
  const existingTemplates: TemplateInfo[] = [];
  
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
      existingTemplates.push(template);
    }
  }
  
  if (existingTemplates.length === 0) {
    console.log(chalk.yellow('⚠️  削除対象のテンプレートファイルが見つかりません'));
    return [];
  }
  
  const choices = existingTemplates.map(template => ({
    name: `${template.name} (${template.file})`,
    value: template,
    checked: false
  }));
  
  const { selectedTemplates } = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'selectedTemplates',
      message: '削除するテンプレートを選択してください:',
      choices,
      validate: (answers) => {
        if (answers.length === 0) {
          return '少なくとも1つのテンプレートを選択してください';
        }
        return true;
      }
    }
  ]);
  
  return selectedTemplates;
};

export const removeTemplates = async (options: RemoveOptions): Promise<void> => {
  console.log(chalk.blue.bold('🗑️  GitHub Issue/PRテンプレートを削除します\n'));
  
  let templatesToRemove: TemplateInfo[];
  
  if (options.all) {
    // 全テンプレートを削除
    templatesToRemove = getAllTemplates();
  } else if (options.type && options.type.length > 0) {
    // 特定タイプのみ削除
    templatesToRemove = getTemplatesByType(options.type);
    
    if (templatesToRemove.length === 0) {
      console.error(chalk.red('❌ 指定されたタイプのテンプレートが見つかりません'));
      console.log(chalk.gray('利用可能なタイプ: bug, feature, typo, question, documentation, performance, pr, contributing, claude'));
      return;
    }
  } else {
    // インタラクティブ選択
    templatesToRemove = await selectTemplatesToRemove();
    
    if (templatesToRemove.length === 0) {
      return;
    }
  }
  
  // 削除前の最終確認（forceオプションが無い場合）
  if (!options.force) {
    console.log(chalk.yellow('\n⚠️  以下のテンプレートが削除されます:'));
    templatesToRemove.forEach(template => {
      console.log(chalk.gray(`  - ${template.name} (${template.file})`));
    });
    
    const { finalConfirm } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'finalConfirm',
        message: '本当に削除を実行しますか？',
        default: false
      }
    ]);
    
    if (!finalConfirm) {
      console.log(chalk.yellow('❌ 削除をキャンセルしました'));
      return;
    }
  }
  
  console.log(chalk.blue(`\n🗑️  ${templatesToRemove.length}個のテンプレートを削除します...\n`));
  
  // テンプレートを順次削除
  for (const template of templatesToRemove) {
    try {
      await removeTemplate(template, options.force);
    } catch (error) {
      console.error(chalk.red(`❌ ${template.name} の削除中にエラーが発生しました`));
      if (!options.force) {
        throw error;
      }
    }
  }
  
  console.log(chalk.green.bold('\n🎉 削除が完了しました！\n'));
  
  // 削除後の案内
  console.log(chalk.gray('💡 変更を反映するには:'));
  console.log(chalk.gray('   GitHubリポジトリにコミット・プッシュしてください'));
};