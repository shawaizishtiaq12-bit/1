# Project memory

## Product intent & audience

- Production-grade web app built with Vite + React; intended for a live audience.
- Brand/site name: **VELEURA**.

## Brand personality & voice

- Premium, distinctive positioning implied by branded logo and emphasis on non-cookie-cutter design.
- Recently shifted toward a more minimalistic, restrained aesthetic.

## Visual design & UX direction

- **Color scheme:** strict black-and-white / neutral grayscale — black primary actions, white surfaces, neutral placeholders; no colored accents (e.g., no cyan/green).
- **Minimalism:** gradients softened or removed; rounded controls and shared accent styling simplified for a cleaner look.
- Shared logo component renders consistently across desktop header, mobile menu, and footer; logo asset is a supplied image file stored in the project.

## Decisions, constraints & rationale

- Stack: JSX + Tailwind CSS + React hooks + Lucide React icons; no extra UI/theme/icon packages unless explicitly requested (per `.bolt/prompt`).
- Import alias `@/` → `src/` for all project modules; avoid deep relative paths (per `.bolt/prompt`).
- Color system is centralized in shared tokens, enabling a single-pass theme change without altering layout or functionality.
- Minimalist simplification intentionally preserves existing structure, interactions, and features.
- Project builds successfully after theme change.

## Open questions & assumptions

- Logo exact dimensions/aspect ratio and responsive sizing behavior not yet specified.
- Favicon and metadata branding may need to match VELEURA logo — not yet confirmed.
- Whether the monochrome theme should also apply to imagery/photos or is limited to UI tokens is unconfirmed.