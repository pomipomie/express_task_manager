module.exports = {
	preset: "ts-jest",
	testEnvironment: "node",
	testMatch: ["**/__tests__/**/*.test.ts"],
	coverageDirectory: "coverage",
	collectCoverageFrom: [
		"src/**/*.ts",
		"!src/**/*.test.ts",
		"!src/types/**/*.ts",
		"!src/config/**/*.ts",
		"!src/domain/**/*.ts",
		"!src/data/**/*.ts",
		"!src/utils/**/*.ts",
		"!src/index.ts",
		"!src/config.ts",
	],
	coverageThreshold: {
		global: {
			branches: 80,
			functions: 80,
			lines: 80,
			statements: 80,
		},
	},
	verbose: true,
};
