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
        'no-sparse-arrays': 'error',
        'no-unsafe-finally': 'error',
        'valid-typeof': 'error',
        'array-callback-return': 'error',
        // https://en.wikipedia.org/wiki/Cyclomatic_complexity
        // 'complexity': [
        //     'warn',
        //     {
        //         max: 20
        //     }
        // ],
        'max-depth': [
            'warn',
            5
        ],
        'max-nested-callbacks': [
            'warn',
            3
        ],
        // 'max-params': [
        //     'warn',
        //     7
        // ],
        'no-template-curly-in-string': 'warn',
        'new-parens': 'warn',
        'new-cap': [
            'warn',
            {
                newIsCap: true,
                capIsNew: false,
                properties: true
            }
        ],
        'no-empty': [
            'warn',
            {
                allowEmptyCatch: true
            }
        ],
        'no-extra-semi': 'warn',
        'no-mixed-spaces-and-tabs': 'warn',
        'no-irregular-whitespace': [
            'warn',
            {
                skipStrings: true,
                skipComments: false,
                skipRegExps: true,
                skipTemplates: true
            }
        ],
        'no-unexpected-multiline': 'warn',
        'no-unreachable': 'warn',
        'no-unsafe-negation': 'warn',
        'use-isnan': 'warn',
        'curly': [
            'warn',
            'multi-line',
            'consistent'
        ],
        'array-bracket-spacing': [
            'warn',
            'never'
        ],
        'block-spacing': [
            'warn',
            'always'
        ],
        'comma-spacing': [
            'warn',
            {
                'before': false,
                'after': true
            }
        ],
        'comma-style': [
            'warn',
            'last'
        ],
        'computed-property-spacing': [
            'warn',
            'never'
        ],
        'func-call-spacing': [
            'warn',
            'never'
        ],
        'func-name-matching': [
            'warn',
            'always',
            {
                includeCommonJSModuleExports: false
            }
        ],
        'key-spacing': [
            'warn',
            {
                beforeColon: false,
                afterColon: true,
                // mode: 'strict',
            }
        ],
        'keyword-spacing': [
            'warn',
            {
                before: true,
                after: true
            }
        ],
        'no-trailing-spaces': 'warn',
        'no-whitespace-before-property': 'warn',
        'space-in-parens': [
            'warn',
            'never'
        ],
        'arrow-spacing': [
            'warn',
            {
                before: true,
                after: true
            }
        ],
        'switch-colon-spacing': [
            'warn',
            {
                after: true,
                before: false
            }
        ],
    }
};