import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h } from 'vue'
import ShareButton from '../src/runtime/components/ShareButton.vue'
import ShareGroup from '../src/runtime/components/ShareGroup.vue'
import ShareLink from '../src/runtime/components/ShareLink.vue'
import ShareMenu from '../src/runtime/components/ShareMenu.vue'
import ShareQr from '../src/runtime/components/ShareQr.vue'
import { useShare } from '../src/runtime/composables/useShare'

const payload_share = {
	url: 'https://example.com/launch',
	title: 'Launch notes',
	text: 'A calmer sharing toolkit',
}

afterEach(() => {
	vi.restoreAllMocks()
})

describe('ShareButton', () => {
	it('renders a named native button and opens a provider intent', async () => {
		const replace_location = vi.fn()
		const popup_window = {
			opener: window,
			location: { replace: replace_location },
		} as unknown as Window
		const open_window = vi.spyOn(window, 'open').mockReturnValue(popup_window)
		const wrapper_button = mount(ShareButton, {
			props: {
				provider: 'x',
				payload: payload_share,
			},
		})

		expect(wrapper_button.get('button').attributes('type')).toBe('button')
		expect(wrapper_button.get('button').attributes('aria-label')).toBe('Share on X')

		await wrapper_button.get('button').trigger('click')
		await flushPromises()

		expect(open_window).toHaveBeenCalledOnce()
		expect(popup_window.opener).toBeNull()
		expect(replace_location).toHaveBeenCalledWith(
			expect.stringContaining('https://x.com/intent/tweet'),
		)
		expect(wrapper_button.emitted('result')?.[0]?.[0]).toMatchObject({
			providerId: 'x',
			status: 'opened',
		})
	})

	it('disables unknown providers and exposes slot context', () => {
		const wrapper_unknown = mount(ShareButton, {
			props: { provider: 'unknown', payload: payload_share },
		})
		expect(wrapper_unknown.get('button').attributes('disabled')).toBeDefined()
		expect(wrapper_unknown.get('button').attributes('aria-label')).toBe(
			'Unavailable provider',
		)

		const wrapper_slot = mount(ShareButton, {
			props: { provider: 'linkedin', payload: payload_share },
			slots: {
				default: (slot_props: { provider: { label: string } }) => (
					h('span', `Send to ${slot_props.provider.label}`)
				),
			},
		})
		expect(wrapper_slot.text()).toContain('Send to LinkedIn')
	})
})

describe('ShareLink', () => {
	it('renders a progressive share anchor with the built-in provider icon', () => {
		const wrapper_link = mount(ShareLink, {
			props: { provider: 'x', payload: payload_share },
		})
		const link_share = wrapper_link.get('a')

		expect(link_share.attributes('href')).toContain('https://x.com/intent/tweet')
		expect(link_share.attributes('target')).toBe('_blank')
		expect(link_share.attributes('rel')).toContain('noopener')
		expect(link_share.find('svg').exists()).toBe(true)
	})
})

describe('ShareGroup', () => {
	it('renders a labelled group with recommended providers', () => {
		const wrapper_group = mount(ShareGroup, {
			props: { payload: payload_share },
		})

		expect(wrapper_group.get('[role="group"]').attributes('aria-label')).toBe(
			'Share this page',
		)
		expect(wrapper_group.findAll('[data-provider]')).toHaveLength(5)
		expect(wrapper_group.text()).toContain('Copy link')
	})
})

describe('ShareMenu', () => {
	it('uses a native disclosure with an accessible trigger', () => {
		const wrapper_menu = mount(ShareMenu, {
			props: { payload: payload_share },
		})
		const trigger_menu = wrapper_menu.get('summary')

		expect(trigger_menu.attributes('aria-label')).toBe('Open share menu')
		expect(trigger_menu.text()).toContain('Share')
		expect(wrapper_menu.findAll('[role="group"] button')).toHaveLength(6)
	})
})

describe('ShareQr', () => {
	it('renders an accessible QR code without treating it as a network', () => {
		const wrapper_qr = mount(ShareQr, {
			props: { payload: payload_share },
		})
		const graphic_qr = wrapper_qr.get('svg')

		expect(graphic_qr.attributes('role')).toBe('img')
		expect(graphic_qr.attributes('aria-label')).toBe('QR code for Launch notes')
		expect(graphic_qr.find('path').attributes('d')).toContain('M')
	})
})

describe('useShare', () => {
	it('announces copy success through reactive status text', async () => {
		const write_text = vi.fn().mockResolvedValue(undefined)
		Object.defineProperty(navigator, 'clipboard', {
			configurable: true,
			value: { writeText: write_text },
		})

		const ComponentHarness = defineComponent({
			setup() {
				const share = useShare(() => payload_share)
				return () => h('button', { onClick: share.copy }, share.message.value)
			},
		})
		const wrapper_harness = mount(ComponentHarness)

		await wrapper_harness.get('button').trigger('click')
		await flushPromises()

		expect(write_text).toHaveBeenCalledWith(payload_share.url)
		expect(wrapper_harness.text()).toBe('Link copied')
	})
})
