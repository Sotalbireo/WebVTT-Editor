module.exports = {
	root: true,
	env: {
		browser: true,
    node: true,
    es6: true
	},
	parserOptions: {
		parser: '@typescript-eslint/parser',
		ecmaVersion: 2018,
		project: 'tsconfig.json'
	},
	extends: [
		'@nuxtjs',
	],
	plugins: [
		'@typescript-eslint'
	],
	rules: {
	}
}
