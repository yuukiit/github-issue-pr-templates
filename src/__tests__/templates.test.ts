import {
  TEMPLATE_CONFIGS,
  OTHER_TEMPLATES,
  CLAUDE_TEMPLATES,
  getAllTemplates,
  getTemplatesByType,
  getTemplatesPath,
  getTargetPath,
  getTemplateType,
  isValidTemplateType
} from '../lib/templates';

describe('Templates', () => {
  describe('Template Configurations', () => {
    test('TEMPLATE_CONFIGS should contain expected issue templates', () => {
      expect(TEMPLATE_CONFIGS).toHaveLength(6);
      expect(TEMPLATE_CONFIGS.map(t => t.type)).toEqual(
        expect.arrayContaining(['bug', 'feature', 'typo', 'question', 'documentation', 'performance'])
      );
    });

    test('OTHER_TEMPLATES should contain PR and contributing templates', () => {
      expect(OTHER_TEMPLATES).toHaveLength(2);
      expect(OTHER_TEMPLATES.map(t => t.type)).toEqual(['pr', 'contributing']);
    });

    test('CLAUDE_TEMPLATES should contain claude template', () => {
      expect(CLAUDE_TEMPLATES).toHaveLength(1);
      expect(CLAUDE_TEMPLATES[0].type).toBe('claude');
    });
  });

  describe('getAllTemplates', () => {
    test('should return all templates combined', () => {
      const allTemplates = getAllTemplates();
      expect(allTemplates).toHaveLength(9); // 6 + 2 + 1
      expect(allTemplates).toEqual([...TEMPLATE_CONFIGS, ...OTHER_TEMPLATES, ...CLAUDE_TEMPLATES]);
    });
  });

  describe('getTemplatesByType', () => {
    test('should return templates matching specified types', () => {
      const bugFeatureTemplates = getTemplatesByType(['bug', 'feature']);
      expect(bugFeatureTemplates).toHaveLength(2);
      expect(bugFeatureTemplates.map(t => t.type)).toEqual(['bug', 'feature']);
    });

    test('should return empty array for non-existent types', () => {
      const noTemplates = getTemplatesByType(['nonexistent']);
      expect(noTemplates).toHaveLength(0);
    });

    test('should handle empty type array', () => {
      const noTemplates = getTemplatesByType([]);
      expect(noTemplates).toHaveLength(0);
    });
  });

  describe('getTemplatesPath', () => {
    test('should return correct templates path', () => {
      const templatesPath = getTemplatesPath();
      expect(templatesPath).toContain('templates');
      expect(typeof templatesPath).toBe('string');
    });
  });

  describe('getTargetPath', () => {
    const originalCwd = process.cwd;

    beforeAll(() => {
      process.cwd = jest.fn().mockReturnValue('/test/project');
    });

    afterAll(() => {
      process.cwd = originalCwd;
    });

    test('should return correct issue template path', () => {
      const path = getTargetPath('issue');
      expect(path).toBe('/test/project/.github/ISSUE_TEMPLATE');
    });

    test('should return correct PR template path', () => {
      const path = getTargetPath('pr');
      expect(path).toBe('/test/project/.github');
    });

    test('should return correct claude template path', () => {
      const path = getTargetPath('claude');
      expect(path).toBe('/test/project/.claude');
    });

    test('should return current directory for other templates', () => {
      const path = getTargetPath('other');
      expect(path).toBe('/test/project');
    });
  });

  describe('getTemplateType', () => {
    test('should return "issue" for issue template types', () => {
      expect(getTemplateType('bug')).toBe('issue');
      expect(getTemplateType('feature')).toBe('issue');
      expect(getTemplateType('question')).toBe('issue');
      expect(getTemplateType('documentation')).toBe('issue');
      expect(getTemplateType('performance')).toBe('issue');
      expect(getTemplateType('typo')).toBe('issue');
    });

    test('should return "pr" for PR template type', () => {
      expect(getTemplateType('pr')).toBe('pr');
    });

    test('should return "claude" for claude template type', () => {
      expect(getTemplateType('claude')).toBe('claude');
    });

    test('should return "other" for unknown template type', () => {
      expect(getTemplateType('unknown')).toBe('other');
      expect(getTemplateType('contributing')).toBe('other');
    });
  });

  describe('isValidTemplateType', () => {
    test('should return true for valid template types', () => {
      expect(isValidTemplateType('bug')).toBe(true);
      expect(isValidTemplateType('feature')).toBe(true);
      expect(isValidTemplateType('pr')).toBe(true);
      expect(isValidTemplateType('claude')).toBe(true);
      expect(isValidTemplateType('contributing')).toBe(true);
    });

    test('should return false for invalid template types', () => {
      expect(isValidTemplateType('invalid')).toBe(false);
      expect(isValidTemplateType('')).toBe(false);
      expect(isValidTemplateType('nonexistent')).toBe(false);
    });
  });

  describe('Template structure validation', () => {
    test('all templates should have required properties', () => {
      const allTemplates = getAllTemplates();
      
      allTemplates.forEach(template => {
        expect(template).toHaveProperty('name');
        expect(template).toHaveProperty('file');
        expect(template).toHaveProperty('type');
        expect(template).toHaveProperty('description');
        
        expect(typeof template.name).toBe('string');
        expect(typeof template.file).toBe('string');
        expect(typeof template.type).toBe('string');
        expect(typeof template.description).toBe('string');
        
        expect(template.name.length).toBeGreaterThan(0);
        expect(template.file.length).toBeGreaterThan(0);
        expect(template.type.length).toBeGreaterThan(0);
        expect(template.description.length).toBeGreaterThan(0);
      });
    });

    test('template files should have .md extension', () => {
      const allTemplates = getAllTemplates();
      
      allTemplates.forEach(template => {
        expect(template.file).toMatch(/\.md$/);
      });
    });

    test('template types should be unique within each category', () => {
      const allTypes = getAllTemplates().map(t => t.type);
      const uniqueTypes = new Set(allTypes);
      expect(uniqueTypes.size).toBe(allTypes.length);
    });
  });

  describe('listTemplates', () => {
    test('should execute without errors', () => {
      // Mock console.log to avoid output during tests
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      expect(() => {
        const { listTemplates } = require('../lib/templates');
        listTemplates();
      }).not.toThrow();
      
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });
});