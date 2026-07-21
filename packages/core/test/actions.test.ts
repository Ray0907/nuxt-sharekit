import { describe, expect, it, vi } from 'vitest'
import {
	copyShareUrl,
	createShareIntent,
	openShareIntent,
	shareNatively,
} from '../src/index'

const payload_share = {
	url: 'https://example.com/launch',
	title: 'Launch notes',
	text: 'A calmer sharing toolkit',
}

describe('copy action', () => {
	it('copies a normalized URL through an injected clipboard', async () => {
		const writeText = vi.fn().mockResolvedValue(undefined)
		const result_action = await copyShareUrl(payload_share, { writeText })

		expect(writeText).toHaveBeenCalledWith(payload_share.url)
		expect(result_action).toEqual({ method: 'copy', status: 'copied' })
	})

	it('returns unsupported when no clipboard adapter is available', async () => {
		await expect(copyShareUrl(payload_share, {})).resolves.toEqual({
			method: 'copy',
			status: 'unsupported',
		})
	})
})

describe('native share action', () => {
	it('uses native sharing when the payload is supported', async () => {
		const share = vi.fn().mockResolvedValue(undefined)
		const canShare = vi.fn().mockReturnValue(true)
		const result_action = await shareNatively(payload_share, { share, canShare })

		expect(share).toHaveBeenCalledWith(payload_share)
		expect(result_action).toEqual({ method: 'native', status: 'shared' })
	})

	it('distinguishes cancellation from failure', async () => {
		const error_cancelled = new Error('Cancelled')
		error_cancelled.name = 'AbortError'

		await expect(shareNatively(payload_share, {
			share: vi.fn().mockRejectedValue(error_cancelled),
		})).resolves.toEqual({ method: 'native', status: 'cancelled' })

		await expect(shareNatively(payload_share, {
			share: vi.fn().mockRejectedValue(new Error('Unavailable')),
		})).resolves.toMatchObject({ method: 'native', status: 'failed' })
	})
})

describe('provider intent action', () => {
	it('opens popup intents with safe isolation features', () => {
		const openPopup = vi.fn().mockReturnValue({ closed: false })
		const intent_share = createShareIntent('x', payload_share)
		const result_action = openShareIntent(intent_share!, { openPopup })

		expect(openPopup).toHaveBeenCalledWith(
			intent_share!.url,
			'nuxt-sharekit-x',
			'popup=yes,width=640,height=560,noopener,noreferrer',
		)
		expect(result_action).toEqual({
			method: 'provider',
			providerId: 'x',
			status: 'opened',
		})
	})

	it('reports blocked popups and supports same-tab intents', () => {
		const intent_popup = createShareIntent('linkedin', payload_share)
		const navigate = vi.fn()
		const intent_email = createShareIntent('email', payload_share)

		expect(openShareIntent(intent_popup!, {
			openPopup: vi.fn().mockReturnValue(null),
		})).toMatchObject({ status: 'blocked' })

		expect(openShareIntent(intent_email!, { navigate })).toMatchObject({
			status: 'opened',
		})
		expect(navigate).toHaveBeenCalledWith(intent_email!.url)
	})

	it('is SSR-safe when browser adapters are absent', () => {
		const intent_share = createShareIntent('x', payload_share)

		expect(openShareIntent(intent_share!, {})).toMatchObject({
			status: 'unsupported',
		})
	})
})
