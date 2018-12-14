module.exports = {
    // parser: 'babel-eslint',
    parserOptions: {
        sourceType: 'module'
    },
    rules: {
        'for-direction': 'error',
        'getter-return': [
            'error',
            {
                allowImplicit: false
            }
        ],
        'new-parens': 'error',
        'no-empty': [
            'error',
            {
                allowEmptyCatch: true
            }
        ],
        'no-extra-semi': 'error',
    }
};