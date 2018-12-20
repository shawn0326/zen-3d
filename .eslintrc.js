module.exports = {
    // parser: 'babel-eslint',
    parserOptions: {
        sourceType: 'module'
    },
    rules: {

        // errors
        'no-sparse-arrays': 'error',
        'no-unsafe-finally': 'error',
        'valid-typeof': 'error',
        'array-callback-return': 'error',
        'no-template-curly-in-string': 'error',

        // code warning
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

        // style: new
        'new-parens': 'warn',
        'new-cap': [
            'warn',
            {
                newIsCap: true,
                capIsNew: false,
                properties: true
            }
        ],

        // empty block warning
        'no-empty': [
            'warn',
            {
                allowEmptyCatch: true
            }
        ],
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

        // extra
        'no-extra-semi': 'warn',
        'comma-style': [
            'warn',
            'last'
        ],
        'semi-style': [
            'warn',
            'last'
        ],

        // spacing
        'no-mixed-spaces-and-tabs': 'warn',
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
                mode: 'strict',
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
        'object-curly-spacing': [
            'warn',
            'always',
            {
                arraysInObjects: true,
                objectsInObjects: false
            }
        ],
        'space-before-blocks': [
            'warn',
            'always'
        ],
        'semi-spacing': [
            'warn',
            {
                before: false,
                after: true
            }
        ],
        'space-before-function-paren': [
            'warn',
            {
                anonymous: 'ignore',
                named: 'never',
                asyncArrow: 'always'
            }
        ],
        'space-in-parens': [
            'warn',
            'never'
        ],
        'space-infix-ops': 'warn',
        'space-unary-ops': [
            'warn',
            {
                words: true,
                nonwords: false
            }
        ],
        'spaced-comment': [
            'error',
            'always',
            {
                block: {
                    exceptions: [
                        '*'
                    ],
                    balanced: true
                }
            }
        ],
        'switch-colon-spacing': [
            'warn',
            {
                after: true,
                before: false
            }
        ],
        'template-tag-spacing': [
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
        'generator-star-spacing': [
            'warn',
            {
                before: false,
                after: true
            }
        ],
        'rest-spread-spacing': [
            'warn',
            'never'
        ],
        'template-curly-spacing': [
            'warn',
            'never'
        ],
        'yield-star-spacing': [
            'warn',
            'after'
        ]
        
    }
};