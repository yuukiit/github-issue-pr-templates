// Jest setup file for additional configuration

// Mock chalk to avoid ESM issues  
const mockChalk = {
  blue: Object.assign((str) => str, { bold: (str) => str }),
  yellow: Object.assign((str) => str, { bold: (str) => str }),
  green: Object.assign((str) => str, { bold: (str) => str }),
  red: (str) => str,
  gray: (str) => str,
  cyan: (str) => str
};

jest.mock('chalk', () => ({
  default: mockChalk,
  ...mockChalk
}));

// Mock inquirer to avoid ESM issues
jest.mock('inquirer', () => ({
  default: {
    prompt: jest.fn()
  },
  prompt: jest.fn()
}));

// Set up environment variables for tests
process.env.NODE_ENV = 'test';

// Mock process.cwd() to return a consistent test directory
const originalCwd = process.cwd;
beforeEach(() => {
  process.cwd = jest.fn().mockReturnValue('/test/project');
});

afterEach(() => {
  process.cwd = originalCwd;
});