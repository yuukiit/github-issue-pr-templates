# GitHub Issue・PR テンプレート集

日本語対応のGitHub Issue/PRテンプレート集とCLIツールです。開発チームが効率的に課題報告や機能提案を行えるよう、包括的なテンプレートセットを提供します。

## 特徴

- 🇯🇵 **日本語完全対応** - 日本の開発チーム向けに最適化
- 📝 **豊富なテンプレート** - バグ報告、機能要求、文書修正、パフォーマンス問題など
- 🚀 **簡単インストール** - CLIコマンド一つで即座にセットアップ
- 🤖 **Claude Code連携** - AI開発環境との統合サポート
- ⚡ **TypeScript製** - 型安全で保守性の高いコードベース
- 🎯 **カスタマイズ可能** - プロジェクトのニーズに応じて選択的インストール

## 使用方法

インストール不要。`npx`で直接実行できます。

### 基本コマンド

```bash
# インタラクティブインストール
npx github-issue-pr-templates install

# 全テンプレートを一括インストール
npx github-issue-pr-templates install --all

# 特定タイプのみインストール
npx github-issue-pr-templates install --type bug,feature,typo

# Claude Code用設定も含めてインストール
npx github-issue-pr-templates install --claude

# 利用可能テンプレート一覧
npx github-issue-pr-templates list

# テンプレート削除
npx github-issue-pr-templates remove

# テンプレート更新
npx github-issue-pr-templates update
```

## 提供テンプレート

### Issue テンプレート

| テンプレート | 説明 | ラベル |
|-------------|------|--------|
| **バグレポート** | 不具合や問題の報告用 | `bug` |
| **機能要求** | 新機能やアイデアの提案用 | `enhancement` |
| **質問** | 使用方法や技術的質問用 | `question` |
| **ドキュメント** | 文書の改善や追加要求用 | `documentation` |
| **パフォーマンス** | 性能問題の報告用 | `performance` |
| **Typo修正** | 誤字脱字や表記ゆれ修正用 | `typo`, `documentation` |

### PR テンプレート

- **統一形式のプルリクエスト** - 変更内容、テスト手順、チェックリスト付き

### 追加ファイル

- **contributing.md** - コントリビューションガイド
- **Claude Code連携設定** - AI開発環境用のテンプレートガイド

## Claude Code との連携

```bash
# Claude Code用設定を含めてインストール
npx github-issue-pr-templates install --claude
```

このオプションにより以下が追加されます：

- `.claude/templates.md` - Claude Code用のIssue/PRテンプレートガイド
- AI開発環境でのテンプレート活用指針

## カスタマイズ

### 特定テンプレートのみインストール

```bash
# バグレポートと機能要求のみ
npx github-issue-pr-templates install --type bug,feature

# ドキュメント関連のみ
npx github-issue-pr-templates install --type documentation,typo
```

### 既存ファイルの上書き

```bash
# 確認なしで強制上書き
npx github-issue-pr-templates install --force
```

## プロジェクト構成

インストール後のディレクトリ構成：

```
your-project/
├── .github/
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md
│   │   ├── feature_request.md
│   │   ├── question.md
│   │   ├── documentation.md
│   │   ├── performance.md
│   │   └── typo_fix.md
│   └── pull_request_template.md
├── .claude/                    # --claude オプション時のみ
│   └── templates.md
└── contributing.md
```

## 開発環境のセットアップ

```bash
# リポジトリのクローン
git clone https://github.com/your-username/github-issue-pr-templates.git
cd github-issue-pr-templates

# 依存関係のインストール
npm install

# 開発モードで起動
npm run dev

# ビルド
npm run build

# テスト実行
npm test

# 型チェック
npm run typecheck
```

## テンプレート例

### バグレポート

```markdown
## バグの概要
バグの内容を簡潔に記述してください。

## 再現手順
1. '...'にアクセス
2. '....'をクリック
3. エラーが発生

## 期待される動作
正常に動作した場合の結果を記述してください。

## 環境情報
- OS: [例: macOS 13.0]
- ブラウザ: [例: Chrome 118]
- Node.js: [例: v18.17.0]
```

### 機能要求

```markdown
## 機能要求の背景
この機能が必要な理由を記述してください。

## 提案する解決策
具体的な解決策を記述してください。

## 期待される効果
実装後の期待される効果を記述してください。
```

## コマンドリファレンス

### install

テンプレートをプロジェクトにインストールします。

```bash
npx github-issue-pr-templates install [options]
```

**オプション：**
- `--all` - 全テンプレートをインストール
- `--type <types>` - 特定タイプのみインストール（カンマ区切り）
- `--claude` - Claude Code用設定も含める  
- `--force` - 確認なしで上書き

### list

利用可能なテンプレート一覧を表示します。

```bash
npx github-issue-pr-templates list
```

### remove

インストール済みテンプレートを削除します。

```bash
npx github-issue-pr-templates remove [options]
```

### update

既存テンプレートを最新版に更新します。

```bash
npx github-issue-pr-templates update
```

## トラブルシューティング

### パッケージの実行エラー

```bash
# 初回実行時にダウンロードされます
npx github-issue-pr-templates install
```

### 既存ファイルとの競合

```bash
# 強制上書きで解決
npx github-issue-pr-templates install --force
```

### npm cacheの問題

```bash
# npm cacheをクリア
npm cache clean --force

# 再実行
npx github-issue-pr-templates install
```

## コントリビューション

プロジェクトへの貢献を歓迎します！

1. リポジトリをフォーク
2. フィーチャーブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'feat: add amazing feature'`)
4. ブランチをプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

詳細は [CONTRIBUTING.md](contributing.md) をご確認ください。

## ライセンス

MIT License - 詳細は [LICENSE](LICENSE) ファイルをご確認ください。

## サポート

- 🐛 バグ報告: [Issues](../../issues)
- 💡 機能要求: [Issues](../../issues) 
- 💬 質問・相談: [Discussions](../../discussions)

## 関連リンク

- [GitHub Issues について](https://docs.github.com/ja/issues)
- [プルリクエストについて](https://docs.github.com/ja/pull-requests)
- [Claude Code](https://claude.ai/code)

---

**Made with ❤️ for Japanese developers**
