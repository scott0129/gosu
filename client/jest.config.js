module.exports = {
    roots: ['<rootDir>/__tests__'],
    setupFiles: ['jest-canvas-mock'],
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};
