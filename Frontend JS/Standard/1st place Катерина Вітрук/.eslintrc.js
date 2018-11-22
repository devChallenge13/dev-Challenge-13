module.exports = {
  "env": {"es6": true},
  "parserOptions": {
    "sourceType": "module"
  },
  "rules": {
    "brace-style": ["error", "1tbs", {"allowSingleLine": true}],
    "comma-dangle": ["error"],
    "curly": ["error"],
    "default-case": ["error"],
    "eol-last": ["error"],
    "eqeqeq": ["error", "always", {"null": "ignore"}],
    "func-call-spacing": ["error"],
    "guard-for-in": ["error"],
    "indent": ["error", 2, {
      "VariableDeclarator": {"var": 2, "let": 2, "const": 3},
      "SwitchCase": 1,
      "FunctionExpression": {"parameters": "first"}
    }],
    "key-spacing": ["error"],
    "max-len": ["error", {"code": 120}],
    "no-bitwise": ["error"],
    "no-fallthrough": ["error"],
    "no-caller": ["error"],
    "no-console": ["error", {"allow": ["error", "log"]}],
    "no-debugger": ["error"],
    "no-empty": ["error"],
    "no-eval": ["error"],
    "no-labels": ["error", {"allowLoop": true, "allowSwitch": true}],
    "no-multiple-empty-lines": ["error", {"max": 1}],
    "no-multi-spaces": ["error"],
    "no-new-wrappers": ["error"],
    "no-trailing-spaces": ["error"],
    "object-curly-spacing": ["error", "never"],
    "operator-linebreak": ["error", "before"],
    "quotes": ["error", "single", {"allowTemplateLiterals": true}],
    "radix": ["error"],
    "semi": ["error"],
    "space-before-blocks": ["error"],
    "space-before-function-paren": ["error", "never"],
    "space-in-parens": ["error"],
    "space-infix-ops": ["error"],
    "space-unary-ops": ["error"],
    "spaced-comment": ["error", "always", {"markers": ["/"]}]
  }
}

