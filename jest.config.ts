export default {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom',
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      diagnostics: {
        ignoreCodes: [1343],
      },
      tsconfig: {
        module: 'commonjs',
        target: 'es2020',
        lib: ['es2020', 'dom'],
        types: ['jest', 'node', 'vite/client'],
        verbatimModuleSyntax: false,
        jsx: 'react-jsx',
      },
    }],
  },
  moduleNameMapper: {
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/src/test-utils/fileMock.ts',
  },
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
};
