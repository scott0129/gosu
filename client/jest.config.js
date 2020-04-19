module.exports = {
    setupFiles: ['jest-canvas-mock'],
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
        '^.*\\.vue$': 'vue-jest',
    },
    testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node', 'vue'],
};
