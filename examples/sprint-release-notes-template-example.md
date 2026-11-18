# Checkout Squad Sprint 48 (v3.11.0)

**Release Date:** 2026-11-15 | **Audience:** Commerce Product, QA, Support

Completed Apple Pay Express button on cart drawer and fixed VAT rounding for EU invoices.

## Highlights

- Apple Pay Express passed end-to-end QA on Safari 18 and iOS 18.
- Carryover: Gift card partial redemption moves to Sprint 49.

## New Features

- **Apple Pay Express in Cart Drawer** (CHK-904): Returning shoppers can check out in two taps without leaving the cart.

## Bug Fixes

- **EU VAT Half-Up Rounding** (CHK-912): Aligned invoice line-item rounding with Stripe Tax totals.

## Upgrade & Deployment Notes

Feature flag `express_apple_pay` enabled at 100% in production.

## Known Issues

Gift card partial balance UI scheduled for Sprint 49.

---

Product Owner: @m.chen | #squad-checkout
