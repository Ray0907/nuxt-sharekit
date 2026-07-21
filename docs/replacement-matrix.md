# Replacement matrix

This matrix pins replacement scope to the 24 networks on the upstream
`nuxt-social-share` v3.1.0 as checked on 2026-07-21. It is a share-intent
matrix, not a social publishing or account-management API.

Source: [upstream network index](https://github.com/stefanobartoletti/nuxt-social-share/tree/v3.1.0/src/runtime/networks)

| Upstream network | ShareKit id | Decision |
| --- | --- | --- |
| Facebook | `facebook` | Implemented |
| X | `x` | Implemented; `twitter` alias included |
| LinkedIn | `linkedin` | Implemented |
| Pinterest | `pinterest` | Implemented |
| Reddit | `reddit` | Implemented |
| Bluesky | `bluesky` | Implemented |
| Threads | `threads` | Implemented |
| Mastodon | `mastodon` | Implemented; chooser fallback and optional instance |
| VKontakte | `vk` | Implemented; `vkontakte` alias included |
| Xing | `xing` | Implemented |
| Tumblr | `tumblr` | Implemented with title, image, and hashtags |
| Hacker News | `hackernews` | Implemented |
| WhatsApp | `whatsapp` | Implemented |
| Telegram | `telegram` | Implemented |
| LINE | `line` | Implemented with optional text |
| Viber | `viber` | Implemented |
| Email | `email` | Implemented with `mailto:` |
| Instapaper | `instapaper` | Implemented |
| Raindrop.io | `raindrop` | Implemented |
| ChatGPT | `chatgpt` | Implemented |
| Claude | `claude` | Implemented |
| Gemini | `gemini` | Implemented |
| Perplexity | `perplexity` | Implemented |
| Grok | `grok` | Implemented |

ShareKit additionally includes `sms`, `weibo`, and `qzone`, for 27 canonical
providers in total. Copy, native Web Share, and QR remain actions rather than
providers. Authenticated publishing surfaces without a public share intent are
outside the runtime package's scope.
