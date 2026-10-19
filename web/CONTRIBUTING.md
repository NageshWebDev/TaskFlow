# Web CSS style guide

TaskFlow’s UI is **Next.js 14 + Tailwind CSS v4 + shadcn (Base UI)**. Do not introduce a second styling system.

## Audit snapshot (legacy vs current)

| Source | Role |
| --- | --- |
| `src/app/tokens.css` | **Source of truth** for colors, type, space, radii, shadows, z-index |
| `src/app/globals.css` | Reset + auth split-hero (BEM, tokenized) |
| `src/components/ui/*` | Shared primitives (Button, Input, Card, Dialog, Select, …) |
| App pages | Tailwind utilities mapped from tokens (`bg-primary`, `text-muted-foreground`) |

**Removed:** unused legacy classes (`.app-shell`, `.btn`, `.stat-card`, `.board`, global `input`/`select` chrome that fought shadcn). `Navbar` is unused by routes; if revived, keep using `Button` + tokens.

**Normalized:** page canvas `#f1f5f9` vs `#f8fafc` → `--bg` / `background` `#f8fafc` (the authenticated shell). Chart orange `--orange` is `#f97316` (Tailwind `orange-500` used on live pages), not the unused `#ea580c`.

**Exceptions (keep as-is):**
- Auth hero dots use slightly brighter `--hero-dot-*` than brand/success (matches the original hero).
- Auth hero title uses `text-3xl` (1.75rem) at all breakpoints.
- Donut chart `conic-gradient` is inline but reads `var(--success)`, `var(--brand)`, `var(--orange)`.
- shadcn primitives may use Tailwind opacity modifiers (`ring-foreground/10`).

## Typography

Do not hardcode `font-size` or `text-[…]` on pages. Use the Tailwind scale, which maps to tokens:

| Token | rem | px at 16 | Use |
| --- | --- | --- | --- |
| `text-xs` | 0.75rem | 12 | captions |
| `text-sm` | 0.8125rem | 13 | labels, buttons |
| `text-base` | 0.875rem | 14 | body |
| `text-lg` | 1rem | 16 | card titles; inputs on mobile |
| `text-xl` | 1.125rem | 18 | section headings |
| `text-2xl` | 1.375rem | 22 | page titles |
| `text-3xl` | 1.75rem | 28 | hero / stat figures |

Body copy must stay on `text-base` or larger. Inputs use `text-lg` below `md` so iOS does not zoom on focus.

## Tokens

Edit hex/rgb only in `src/app/tokens.css`. Tailwind maps:

- `primary` → `--brand` (`#2563eb`)
- `primary-hover` → `--brand-hover`
- `background` / `card` / `destructive` / `success` / `violet` / `orange` / `sidebar`

## Rules

- Layout: **flexbox and grid only**. Use `gap`, not sibling margin hacks.
- Typography and spacing: **rem** (or Tailwind scale). `px` only for 1px borders/rings.
- Colors, radii, shadows, type sizes: **tokens or mapped utilities**. No new hardcoded hex.
- Selectors: utility classes or BEM for the auth hero. **No ID styling.** Nesting depth ≤ 3.
- No `!important` except a commented third-party override.
- Responsive: Tailwind `sm`/`md`/`lg`/`xl` (aligned with `--bp-*`).
- Prefer logical properties in custom CSS (`padding-block`, `margin-inline`).
- Pages consume `AppShell`, `AuthShell`, and `components/ui/*`. Do not restyle buttons/inputs per page.

## Primitives

Use `Button`, `Input`, `Textarea`, `Field`, `Card`, `Dialog`, `AlertDialog` (`ConfirmDialog`), `AppSelect`, `Badge`, `EmptyState`. Variants already encode text color (primary = white on blue; outline = dark on white).

## Linting

```bash
cd web && npm run lint:css
```

Stylelint allows hex only in `tokens.css`.
