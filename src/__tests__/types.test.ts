import type { 
  InstallOptions, 
  TemplateInfo, 
  CLICommand, 
  RemoveOptions, 
  UpdateOptions, 
  TemplateType, 
  TemplateConfig 
} from '../types';

describe('Type definitions', () => {
  describe('InstallOptions', () => {
    test('should allow all optional properties', () => {
      const options: InstallOptions = {};
      expect(options).toBeDefined();
    });

    test('should allow full options configuration', () => {
      const options: InstallOptions = {
        all: true,
        type: ['bug', 'feature'],
        claude: true,
        force: true
      };
      
      expect(options.all).toBe(true);
      expect(options.type).toEqual(['bug', 'feature']);
      expect(options.claude).toBe(true);
      expect(options.force).toBe(true);
    });
  });

  describe('TemplateInfo', () => {
    test('should require all properties', () => {
      const template: TemplateInfo = {
        name: 'Test Template',
        file: 'test.md',
        type: 'bug',
        description: 'Test description'
      };
      
      expect(template.name).toBe('Test Template');
      expect(template.file).toBe('test.md');
      expect(template.type).toBe('bug');
      expect(template.description).toBe('Test description');
    });
  });

  describe('CLICommand', () => {
    test('should define command structure correctly', () => {
      const command: CLICommand = {
        name: 'test',
        description: 'Test command',
        action: async () => {}
      };
      
      expect(command.name).toBe('test');
      expect(command.description).toBe('Test command');
      expect(typeof command.action).toBe('function');
    });

    test('should allow synchronous action', () => {
      const command: CLICommand = {
        name: 'test',
        description: 'Test command',
        action: () => {}
      };
      
      expect(typeof command.action).toBe('function');
    });
  });

  describe('RemoveOptions', () => {
    test('should allow all optional properties', () => {
      const options: RemoveOptions = {};
      expect(options).toBeDefined();
    });

    test('should allow full options configuration', () => {
      const options: RemoveOptions = {
        all: true,
        type: ['bug', 'feature'],
        force: true
      };
      
      expect(options.all).toBe(true);
      expect(options.type).toEqual(['bug', 'feature']);
      expect(options.force).toBe(true);
    });
  });

  describe('UpdateOptions', () => {
    test('should allow optional force property', () => {
      const options: UpdateOptions = {};
      expect(options).toBeDefined();
      
      const optionsWithForce: UpdateOptions = {
        force: true
      };
      expect(optionsWithForce.force).toBe(true);
    });
  });

  describe('TemplateType', () => {
    test('should include all valid template types', () => {
      const validTypes: TemplateType[] = [
        'bug',
        'feature', 
        'question',
        'documentation',
        'performance',
        'typo',
        'pr',
        'claude',
        'contributing'
      ];
      
      validTypes.forEach(type => {
        const templateType: TemplateType = type;
        expect(templateType).toBe(type);
      });
    });
  });

  describe('TemplateConfig', () => {
    test('should define configuration structure correctly', () => {
      const config: TemplateConfig = {
        sourceDir: '/source',
        targetDir: '/target',
        files: [
          {
            name: 'Bug Report',
            file: 'bug_report.md',
            type: 'bug',
            description: 'Bug reporting template'
          }
        ]
      };
      
      expect(config.sourceDir).toBe('/source');
      expect(config.targetDir).toBe('/target');
      expect(config.files).toHaveLength(1);
      expect(config.files[0].name).toBe('Bug Report');
    });
  });

  describe('Type safety', () => {
    test('should enforce string array for type options', () => {
      const installOptions: InstallOptions = {
        type: ['bug', 'feature', 'typo']
      };
      
      expect(Array.isArray(installOptions.type)).toBe(true);
      installOptions.type?.forEach(type => {
        expect(typeof type).toBe('string');
      });
    });

    test('should enforce boolean types for flags', () => {
      const options: InstallOptions = {
        all: true,
        claude: false,
        force: true
      };
      
      expect(typeof options.all).toBe('boolean');
      expect(typeof options.claude).toBe('boolean');
      expect(typeof options.force).toBe('boolean');
    });
  });

  describe('Template type validation', () => {
    test('should validate template types match TemplateType union', () => {
      const validTemplate: TemplateInfo = {
        name: 'Test',
        file: 'test.md',
        type: 'bug' as TemplateType,
        description: 'Test'
      };
      
      expect(validTemplate.type).toBe('bug');
    });

    test('should ensure TemplateInfo.type is assignable to TemplateType', () => {
      const template: TemplateInfo = {
        name: 'Feature Request',
        file: 'feature.md',
        type: 'feature',
        description: 'Feature request template'
      };
      
      const templateType: TemplateType = template.type as TemplateType;
      expect(templateType).toBe('feature');
    });
  });
});