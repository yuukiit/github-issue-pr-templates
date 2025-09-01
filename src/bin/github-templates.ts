#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { installTemplates } from '../lib/install';
import { removeTemplates } from '../lib/remove';
import { listTemplates } from '../lib/templates';
import { updateTemplates } from '../lib/update';
import type { InstallOptions, RemoveOptions, UpdateOptions } from '../types';

const program = new Command();

program
  .name('github-templates')
  .description('日本語対応のGitHub Issue/PRテンプレート管理CLI')
  .version('1.0.0');

program
  .command('install')
  .description('テンプレートをインストール')
  .option('-a, --all', '全てのテンプレートをインストール')
  .option('-t, --type <types>', '特定のタイプのみ (例: bug,feature,typo)', (value) => value.split(','))
  .option('-c, --claude', 'Claude Code用設定も含める')
  .option('-f, --force', '既存ファイルを強制上書き')
  .action(async (options: InstallOptions) => {
    try {
      await installTemplates(options);
    } catch (error) {
      console.error(chalk.red('エラー:'), error instanceof Error ? error.message : 'インストールに失敗しました');
      process.exit(1);
    }
  });

program
  .command('remove')
  .description('テンプレートを削除')
  .option('-a, --all', '全てのテンプレートを削除')
  .option('-t, --type <types>', '特定のタイプのみ削除 (例: bug,feature,typo)', (value) => value.split(','))
  .option('-f, --force', '確認なしで強制削除')
  .action(async (options: RemoveOptions) => {
    try {
      await removeTemplates(options);
    } catch (error) {
      console.error(chalk.red('エラー:'), error instanceof Error ? error.message : '削除に失敗しました');
      process.exit(1);
    }
  });

program
  .command('list')
  .description('利用可能なテンプレート一覧を表示')
  .action(() => {
    try {
      listTemplates();
    } catch (error) {
      console.error(chalk.red('エラー:'), error instanceof Error ? error.message : 'リスト取得に失敗しました');
      process.exit(1);
    }
  });

program
  .command('update')
  .description('テンプレートを更新')
  .option('-f, --force', '確認なしで強制更新')
  .action(async (options: UpdateOptions) => {
    try {
      await updateTemplates(options);
    } catch (error) {
      console.error(chalk.red('エラー:'), error instanceof Error ? error.message : '更新に失敗しました');
      process.exit(1);
    }
  });

program.parse();