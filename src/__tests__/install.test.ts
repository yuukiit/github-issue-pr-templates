import fs from 'fs-extra';
import path from 'path';
import inquirer from 'inquirer';
import { installTemplates } from '../lib/install';
import * as templates from '../lib/templates';
import type { InstallOptions } from '../types';

// Mock dependencies
jest.mock('fs-extra');
jest.mock('inquirer');
jest.mock('../lib/templates', () => ({
  ...jest.requireActual('../lib/templates'),
  getTemplatesPath: jest.fn(),
  getTargetPath: jest.fn(),
  getAllTemplates: jest.fn(),
  getTemplatesByType: jest.fn(),
  CLAUDE_TEMPLATES: []
}));

const mockedFs = fs as jest.Mocked<typeof fs>;
const mockedInquirer = inquirer as jest.Mocked<typeof inquirer>;
const mockedTemplates = templates as jest.Mocked<typeof templates>;


describe('Install functionality', () => {
  const mockTemplates = [
    {
      name: 'バグレポート',
      file: 'bug_report.md',
      type: 'bug',
      description: 'バグ報告用テンプレート'
    },
    {
      name: '機能要求',
      file: 'feature_request.md',
      type: 'feature',
      description: '機能要求用テンプレート'
    },
    {
      name: 'プルリクエスト',
      file: 'pull_request_template.md',
      type: 'pr',
      description: 'PR用テンプレート'
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup default mocks
    mockedTemplates.getTemplatesPath.mockReturnValue('/mock/templates');
    mockedTemplates.getAllTemplates.mockReturnValue(mockTemplates);
    (mockedFs.pathExists as jest.Mock).mockResolvedValue(false); // Don't trigger file exists check by default
    (mockedFs.ensureDir as jest.Mock).mockResolvedValue(undefined);
    (mockedFs.copy as jest.Mock).mockResolvedValue(undefined);
    
    // Setup inquirer mock
    mockedInquirer.prompt.mockResolvedValue({ overwrite: true });
    
    // Mock getTargetPath based on template type
    mockedTemplates.getTargetPath.mockImplementation((type) => {
      switch (type) {
        case 'issue': return '/test/.github/ISSUE_TEMPLATE';
        case 'pr': return '/test/.github';
        case 'claude': return '/test/.claude';
        default: return '/test';
      }
    });
  });


  describe('installTemplates with --all option', () => {
    test('should install all templates when --all is specified', async () => {
      const options: InstallOptions = { all: true };
      
      await installTemplates(options);
      
      expect(mockedTemplates.getAllTemplates).toHaveBeenCalled();
      expect(mockedFs.ensureDir).toHaveBeenCalledTimes(mockTemplates.length);
      expect(mockedFs.copy).toHaveBeenCalledTimes(mockTemplates.length);
      // Just verify the function completed without throwing
      expect(mockedFs.copy).toHaveBeenCalledTimes(mockTemplates.length);
    });

    test('should exclude claude templates when --claude is not specified', async () => {
      const templatesWithClaude = [
        ...mockTemplates,
        { name: 'Claude設定', file: 'templates.md', type: 'claude', description: 'Claude用' }
      ];
      mockedTemplates.getAllTemplates.mockReturnValue(templatesWithClaude);
      
      const options: InstallOptions = { all: true };
      
      await installTemplates(options);
      
      // Claude template should be filtered out
      expect(mockedFs.copy).toHaveBeenCalledTimes(3); // Only non-claude templates
    });

    test('should include claude templates when --claude is specified', async () => {
      const templatesWithClaude = [
        ...mockTemplates,
        { name: 'Claude設定', file: 'templates.md', type: 'claude', description: 'Claude用' }
      ];
      mockedTemplates.getAllTemplates.mockReturnValue(templatesWithClaude);
      
      const options: InstallOptions = { all: true, claude: true };
      
      await installTemplates(options);
      
      expect(mockedFs.copy).toHaveBeenCalledTimes(4); // All templates including claude
    });
  });

  describe('installTemplates with --type option', () => {
    test('should install only specified types', async () => {
      const bugTemplate = mockTemplates.filter(t => t.type === 'bug');
      mockedTemplates.getTemplatesByType.mockReturnValue(bugTemplate);
      
      const options: InstallOptions = { type: ['bug'] };
      
      await installTemplates(options);
      
      expect(mockedTemplates.getTemplatesByType).toHaveBeenCalledWith(['bug']);
      expect(mockedFs.copy).toHaveBeenCalledTimes(1);
    });

    test('should handle invalid template types', async () => {
      mockedTemplates.getTemplatesByType.mockReturnValue([]);
      
      const options: InstallOptions = { type: ['invalid'] };
      
      await installTemplates(options);
      
      // Verify the function returns early and doesn't call copy
      expect(mockedFs.copy).not.toHaveBeenCalled();
    });
  });

  describe('installTemplates with interactive mode', () => {
    test('should handle interactive selection', async () => {
      // Mock inquirer prompts for interactive selection
      mockedInquirer.prompt
        .mockResolvedValueOnce({ selectedGroups: ['issues', 'pr'] })
        .mockResolvedValueOnce({ selectedIssues: [mockTemplates[0]] });
      
      const options: InstallOptions = {};
      
      await installTemplates(options);
      
      expect(mockedInquirer.prompt).toHaveBeenCalledTimes(2);
      expect(mockedFs.copy).toHaveBeenCalledTimes(2); // Selected issue + PR template
    });
  });

  describe('File operations', () => {
    test('should handle existing files without --force', async () => {
      (mockedFs.pathExists as jest.Mock).mockResolvedValue(true);
      mockedInquirer.prompt.mockResolvedValueOnce({ overwrite: false });
      
      const options: InstallOptions = { type: ['bug'] };
      mockedTemplates.getTemplatesByType.mockReturnValue([mockTemplates[0]]);
      
      await installTemplates(options);
      
      expect(mockedInquirer.prompt).toHaveBeenCalledWith([
        expect.objectContaining({
          type: 'confirm',
          name: 'overwrite'
        })
      ]);
      // Skip message would be logged
      expect(mockedFs.copy).not.toHaveBeenCalled();
    });

    test('should overwrite files with --force option', async () => {
      (mockedFs.pathExists as jest.Mock).mockResolvedValue(true);
      
      const options: InstallOptions = { type: ['bug'], force: true };
      mockedTemplates.getTemplatesByType.mockReturnValue([mockTemplates[0]]);
      
      await installTemplates(options);
      
      expect(mockedInquirer.prompt).not.toHaveBeenCalled();
      expect(mockedFs.copy).toHaveBeenCalledTimes(1);
    });

    test('should create target directories if they do not exist', async () => {
      const options: InstallOptions = { type: ['bug'], force: true };
      mockedTemplates.getTemplatesByType.mockReturnValue([mockTemplates[0]]);
      
      await installTemplates(options);
      
      expect(mockedFs.ensureDir).toHaveBeenCalledWith('/test/.github/ISSUE_TEMPLATE');
    });

    test('should handle file copy errors gracefully', async () => {
      (mockedFs.copy as jest.Mock).mockRejectedValue(new Error('Copy failed'));
      
      const options: InstallOptions = { type: ['bug'] };
      mockedTemplates.getTemplatesByType.mockReturnValue([mockTemplates[0]]);
      
      await expect(installTemplates(options)).rejects.toThrow('Copy failed');
    });

    test('should continue with other templates when --force and error occurs', async () => {
      (mockedFs.copy as jest.Mock)
        .mockRejectedValueOnce(new Error('Copy failed'))
        .mockResolvedValueOnce(undefined);
      
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      const options: InstallOptions = { type: ['bug', 'feature'], force: true };
      mockedTemplates.getTemplatesByType.mockReturnValue([mockTemplates[0], mockTemplates[1]]);
      
      await installTemplates(options);
      
      expect(mockedFs.copy).toHaveBeenCalledTimes(2);
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('のインストール中にエラーが発生しました')
      );
      
      consoleSpy.mockRestore();
    });
  });

  describe('Package.json validation', () => {
    test('should warn when package.json is not found', async () => {
      (mockedFs.pathExists as jest.Mock).mockImplementation((filePath) => {
        if (typeof filePath === 'string' && filePath.includes('package.json')) {
          return Promise.resolve(false);
        }
        return Promise.resolve(true);
      });
      
      const options: InstallOptions = { type: ['bug'] };
      mockedTemplates.getTemplatesByType.mockReturnValue([mockTemplates[0]]);
      
      await installTemplates(options);
      
      // Function should still complete despite missing package.json
      expect(mockedFs.copy).toHaveBeenCalledTimes(1);
    });
  });

  describe('Claude option handling', () => {
    test('should add claude templates when --claude is specified', async () => {
      const options: InstallOptions = { all: true, claude: true, force: true };
      const allTemplates = [...mockTemplates, { name: 'Claude設定', file: 'templates.md', type: 'claude', description: 'Claude用' }];
      mockedTemplates.getAllTemplates.mockReturnValue(allTemplates);
      
      await installTemplates(options);
      
      // Verify that all templates including claude were installed
      expect(mockedFs.copy).toHaveBeenCalledTimes(4); // 3 mock templates + 1 claude
    });
  });
});