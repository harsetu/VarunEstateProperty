# Project structure

```
src/
├── App.tsx, main.tsx, index.css     entry points and routes
├── app/container.ts                 composition root: picks the repository implementations
├── flavors/                         one folder per website (branding, content, data source)
├── res/                             bundled images (import { images } from '@/res'); see res/README.md
├── constants/                       string constants only
│   ├── strings/*.ts                 UI text by area (layout, home, properties, admin …)
│   ├── en.ts                        merges them into one map
│   └── analytics.ts                 analytics event names
├── core/                            shared, feature-independent code
│   ├── widgets/                     base UI components (Modal, ScrollReveal, Logo, Counter …)
│   ├── layout/                      site chrome (Navbar, Footer, Preloader, WhatsApp button, callback popup)
│   ├── network/                     httpClient + interceptors (auth header, 401 refresh, error mapping), session
│   ├── analytics/                   analytics service (off | console | gtag via VITE_ANALYTICS)
│   ├── config/                      active flavor's contact details
│   └── utils/                       i18n `t()`/`rich()`, pricing, phone, contact links
└── features/
    ├── home/        ui/  viewmodel/  repository/ (HomeRepository)   data/ (FlavorHomeRepository)
    ├── about/       ui/  viewmodel/
    ├── contact/     ui/  viewmodel/
    ├── properties/  ui/  viewmodel/  repository/ (interface + Api/Static)  data/ (mapper, options)  model/ (entities, rules)
    └── admin/       ui/  viewmodel/  repository/ (interfaces + Api impls)   data/ (local notes)      model/
```

Rules of thumb
- `ui` renders and calls a view model; it never fetches.
- `viewmodel` holds state/logic and talks to repositories (via `app/container`).
- `repository` is the contract plus its implementations; `data` holds mappers, local sources and options.
- `core` must not import from `features`.
- Text goes in `constants/strings`; use `t('key', { param })`.
