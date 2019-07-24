module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'patch',
        'chore',
        'docs',
        'style',
        'build',
        'test',
        'revert'
      ]
    ],
    'header-min-length': [2, 'always', 15]
  }
};
