import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

async function waitForHydration(page: import('@playwright/test').Page): Promise<void> {
	await expect(page.locator('html')).toHaveAttribute('data-hydrated', 'true')
}

test('opens a provider popup without reporting it as blocked', async ({ context, page }) => {
	await context.route(/^https:\/\/x\.com\//, route => route.abort())
	await page.goto('/')
	await waitForHydration(page)

	const [popup_share] = await Promise.all([
		context.waitForEvent('page'),
		page.locator('[data-provider="x"]').first().click(),
	])

	await expect(page.getByTestId('share-result')).toHaveText('provider:x:opened')
	await popup_share.close()
})

test('copies and invokes native sharing through browser boundaries', async ({ context, page }) => {
	await context.grantPermissions(['clipboard-read', 'clipboard-write'])
	await page.addInitScript(() => {
		Object.defineProperty(navigator, 'canShare', {
			configurable: true,
			value: () => true,
		})
		Object.defineProperty(navigator, 'share', {
			configurable: true,
			value: async () => undefined,
		})
	})
	await page.goto('/')
	await waitForHydration(page)

	await page.getByRole('button', { name: 'Copy link' }).first().click()
	await expect(page.getByTestId('share-result')).toHaveText('copy:copied')
	expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
		'https://example.com/notes/launching-sharekit',
	)

	await page.getByRole('button', { name: 'More options' }).click()
	await expect(page.getByTestId('share-result')).toHaveText('native:shared')
})

test('keeps provider, email, SMS, and compatibility links without JavaScript', async ({ browser }) => {
	const context_no_js = await browser.newContext({ javaScriptEnabled: false })
	const page_no_js = await context_no_js.newPage()
	await page_no_js.goto('/')

	await expect(page_no_js.locator('#share-link-x')).toHaveAttribute(
		'href',
		/https:\/\/x\.com\/intent\/tweet/,
	)
	await expect(page_no_js.locator('#share-link-email')).toHaveAttribute('href', /^mailto:/)
	await expect(page_no_js.locator('#share-link-sms')).toHaveAttribute('href', /^sms:/)
	await expect(page_no_js.locator('#social-share-twitter')).toHaveAttribute(
		'href',
		/https:\/\/x\.com\/intent\/tweet/,
	)
	await expect(page_no_js.locator('#legacy-composable-twitter')).toHaveAttribute(
		'href',
		/https:\/\/x\.com\/intent\/tweet/,
	)
	await context_no_js.close()
})

test('exposes email and SMS protocol targets in a hydrated browser', async ({ page }) => {
	await page.goto('/')
	await waitForHydration(page)

	await expect(page.locator('#share-link-email')).toHaveAttribute('href', /^mailto:/)
	await expect(page.locator('#share-link-sms')).toHaveAttribute('href', /^sms:/)
})

test('supports keyboard disclosure behavior and WCAG automation', async ({ page }) => {
	await page.goto('/')
	await waitForHydration(page)
	const trigger_menu = page.getByRole('region', { name: 'Compact menu' }).locator('summary')

	await trigger_menu.focus()
	await page.keyboard.press('Enter')
	await expect(trigger_menu.locator('..')).toHaveAttribute('open', '')
	await page.keyboard.press('Tab')
	await expect(page.getByRole('button', { name: 'X', exact: true })).toBeFocused()
	await page.keyboard.press('Escape')
	await expect(trigger_menu.locator('..')).not.toHaveAttribute('open', '')
	await expect(trigger_menu).toBeFocused()

	const results_a11y = await new AxeBuilder({ page })
		.withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
		.analyze()
	expect(results_a11y.passes.some(rule_result => (
		rule_result.id === 'color-contrast'
	))).toBe(true)
	expect(results_a11y.violations).toEqual([])
})

test('renders default runtime icons instead of placeholder initials', async ({ page }) => {
	await page.goto('/')
	await waitForHydration(page)
	const group_share = page.getByRole('group', { name: 'Share this page' })

	await expect(group_share.locator('[data-provider] svg')).toHaveCount(5)
	await expect(group_share).toHaveScreenshot('default-runtime.png', {
		maxDiffPixelRatio: 0.05,
	})
})
