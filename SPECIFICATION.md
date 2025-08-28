# Claude Code用プロンプト: github-issue-pr-templates作成

## 基本指示

日本語対応のGitHub Issue/PRテンプレート集をnpmパッケージとして**TypeScript**で作成してください。
パッケージ名は「github-issue-pr-templates」で、CLIツール付きの実用的なパッケージにしてください。

## 技術要件

### TypeScript設定
- TypeScript (最新安定版)
- Node.js 14以上対応
- strict モード有効
- target: ES2020, module: CommonJS
- outDir: dist/

### ビルド設定
- tsc でコンパイル
- package.json の main: "dist/lib/templates.js"
- package.json の bin: "dist/bin/github-templates.js"
- npm run build でJavaScriptにコンパイル

### 型定義
- すべての関数・変数に適切な型注釈
- interfaces/type 定義を作成
- 外部ライブラリの型定義も含める

以下の要件に従って実装してください：

## パッケージ要件

### 1. 基本構成
- パッケージ名: github-issue-pr-templates
- CLIコマンド: github-templates, gh-templates
- 対象環境: Node.js 14以上
- 依存関係: commander, chalk, fs-extra, inquirer

### 2. ディレクトリ構成
```
github-issue-pr-templates/
├── package.json
├── tsconfig.json
├── README.md
├── LICENSE
├── src/
│   ├── bin/
│   │   └── github-templates.ts (CLIエントリーポイント)
│   ├── lib/
│   │   ├── install.ts (インストール機能)
│   │   ├── templates.ts (テンプレート管理)
│   │   └── types.ts (型定義)
│   └── types/
│       └── index.ts (共通型定義)
├── dist/ (コンパイル結果)
├── templates/
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md
│   │   ├── feature_request.md
│   │   ├── question.md
│   │   ├── documentation.md
│   │   ├── performance.md
│   │   └── typo_fix.md
│   ├── pull_request_template.md
│   ├── claude/
│   │   └── templates.md
│   └── contributing.md
└── scripts/
    └── postinstall.js
```

### 3. テンプレート詳細

各テンプレートは以下の内容で作成：

#### bug_report.md
```markdown
---
name: バグレポート
about: バグや不具合を報告する際に使用してください
title: "[BUG] "
labels: bug
assignees: ''
---

## バグの概要
バグの内容を簡潔に記述してください。

## 再現手順
1. '...'にアクセス
2. '....'をクリック
3. '....'まで画面をスクロール
4. エラーが発生

## 期待される動作
正常に動作した場合、どのような結果になるべきかを記述してください。

## 実際の動作
実際に起こった動作を記述してください。

## スクリーンショット
可能であれば、問題を説明するスクリーンショットを追加してください。

## 環境情報
- OS: [例: iOS, Windows 10]
- ブラウザ: [例: chrome, safari]
- バージョン: [例: 22]
- デバイス: [例: iPhone 12, Desktop]

## 追加情報
その他、このバグに関する追加情報があれば記述してください。
```

#### feature_request.md
```markdown
---
name: 機能要求
about: 新しい機能やアイデアを提案する際に使用してください
title: "[FEATURE] "
labels: enhancement
assignees: ''
---

## 機能要求の背景
この機能要求に関連する問題や課題を記述してください。例：「〜ができなくて困っている」

## 提案する解決策
あなたが考える解決策を明確かつ簡潔に記述してください。

## 代替案
検討した他の解決策や機能があれば記述してください。

## 期待される効果
この機能が実装された場合の期待される効果やメリットを記述してください。

## 追加情報
その他、この機能要求に関する追加情報、モックアップ、参考資料などがあれば記述してください。
```

#### typo_fix.md
```markdown
---
name: Typo・誤字脱字修正
about: 文言の誤字脱字や表記ゆれの修正を報告する際に使用してください
title: "[TYPO] "
labels: typo, documentation
assignees: ''
---

## 対象箇所
誤字脱字が見つかった場所を記述してください。
- ファイル名: 
- 行番号: 
- URL: 
- 画面名: 

## 現在の表記
現在の間違った表記をここに記述

## 正しい表記
正しい表記をここに記述

## 修正理由
- [ ] 誤字・脱字
- [ ] 表記ゆれ
- [ ] 用語の統一
- [ ] 文法的な間違い
- [ ] その他: 

## 影響範囲
この修正が影響する範囲があれば記述してください。
- [ ] ユーザー向けドキュメント
- [ ] 開発者向けドキュメント  
- [ ] UI/UXテキスト
- [ ] エラーメッセージ
- [ ] コードコメント
- [ ] README
- [ ] その他: 

## 優先度
- [ ] 高（ユーザーに大きく影響する）
- [ ] 中（気づいたら修正したい）
- [ ] 低（時間があるときに修正）

## 追加情報
関連する他のtypoや、参考になる資料があれば記述してください。
```

#### question.md, documentation.md, performance.mdも同様の形式で作成

### 4. CLIコマンド要件

#### 基本コマンド
- `github-templates install` - インタラクティブインストール
- `github-templates install --all` - 全テンプレートインストール
- `github-templates install --type bug,feature,typo` - 特定タイプのみ
- `github-templates install --claude` - Claude Code用設定も含める
- `github-templates list` - 利用可能テンプレート一覧
- `github-templates remove` - テンプレート削除
- `github-templates update` - テンプレート更新

#### インストール機能詳細
- `.github/ISSUE_TEMPLATE/` ディレクトリにテンプレートファイルをコピー
- `.github/pull_request_template.md` もコピー
- `--claude` オプション時は `.claude/templates.md` も作成
- 既存ファイルがある場合は上書き確認
- `--force` オプションで強制上書き

### 5. Claude Code連携

#### templates/claude/templates.md の内容
```markdown
# Claude Code用 Issue/PR テンプレートガイド

## Issue作成時の指針

### バグレポートの場合
- タイトル: [BUG] 簡潔な問題の説明
- 必須項目: 再現手順、期待される動作、実際の動作、環境情報
- ラベル: bug

### 機能要求の場合  
- タイトル: [FEATURE] 機能の概要
- 必須項目: 背景、提案する解決策、期待される効果
- ラベル: enhancement

### Typo修正の場合
- タイトル: [TYPO] 対象ファイル名や箇所
- 必須項目: 現在の表記、正しい表記、影響範囲
- ラベル: typo, documentation

## PR作成時の指針
- タイトル形式: [TYPE] 変更内容の概要
- 関連するIssue番号を記載（Closes #123）
- 変更理由と動作確認内容を含める
```

### 6. package.json要件

```json
{
  "name": "github-issue-pr-templates",
  "version": "1.0.0",
  "description": "日本語対応のGitHub Issue/PRテンプレート集とCLI",
  "main": "dist/lib/templates.js",
  "types": "dist/lib/templates.d.ts",
  "bin": {
    "github-templates": "dist/bin/github-templates.js",
    "gh-templates": "dist/bin/github-templates.js"
  },
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch",
    "prepack": "npm run build",
    "test": "jest",
    "typecheck": "tsc --noEmit"
  },
  "keywords": [
    "github",
    "issue-templates",
    "pr-templates", 
    "japanese",
    "cli",
    "developer-tools",
    "typescript"
  ],
  "files": [
    "dist/",
    "templates/",
    "scripts/",
    "README.md",
    "LICENSE"
  ],
  "engines": {
    "node": ">=14.0.0"
  },
  "dependencies": {
    "commander": "^11.0.0",
    "chalk": "^5.3.0",
    "fs-extra": "^11.1.1",
    "inquirer": "^9.2.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "@types/node": "^20.0.0",
    "@types/fs-extra": "^11.0.0",
    "@types/inquirer": "^9.0.0",
    "jest": "^29.6.0",
    "@types/jest": "^29.5.0"
  }
}
```

### 7. 実装詳細指示

#### CLIの実装方針
- commanderを使用したサブコマンド構成
- chalkによるカラフルなコンソール出力
- inquirerによるインタラクティブな選択
- fs-extraによる安全なファイル操作

#### エラーハンドリング
- package.json が存在しない場合の警告
- 既存ファイル上書き時の確認
- 権限エラーやディスク容量不足への対応
- 適切なエラーメッセージとexit code

#### テスト要件
- 各CLIコマンドの動作テスト
- ファイル作成・削除のテスト
- エラーケースのテスト

### 8. TypeScript設定要件

#### tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "CommonJS",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "resolveJsonModule": true,
    "moduleResolution": "node"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "templates"]
}
```

#### 型定義例
```typescript
// src/types/index.ts
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
```

### 9. ドキュメント要件

#### README.md に含める内容
- パッケージの説明と特徴
- インストール方法
- 使用方法（CLI コマンド例）
- 各テンプレートの説明
- Claude Code との連携方法
- トラブルシューティング
- コントリビューション方法

### 9. 品質要件

- ESLintによるコード品質チェック
- 適切なエラーハンドリング
- ログ出力による操作状況の可視化
- クロスプラットフォーム対応（Windows, macOS, Linux）

## 実装指示

上記の要件を満たすnpmパッケージを作成してください。
特に、CLIツールの使いやすさと、Claude Codeとの連携機能に重点を置いて実装してください。
コードは可読性が高く、メンテナンスしやすい構造にしてください。