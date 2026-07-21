import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
	testDir: './test/browser',
	snapshotPathTemplate: '{testDir}/{testFilePath}-snapshots/{arg}{ext}',
	fullyParallel: false,
	retries: process.env.CI ? 1 : 0,
	reporter: 'list',
	use: {
		baseURL: 'http://127.0.0.1:4300',
		trace: 'retain-on-failure',
		screenshot: 'only-on-failure',
	},
	projects: [
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] },
		},
	],
	webServer: {
		command: 'pnpm --filter nuxt-sharekit-playground dev --host 127.0.0.1 --port 4300',
		url: 'http://127.0.0.1:4300',
		reuseExistingServer: false,
		timeout: 120_000,
	},
})
