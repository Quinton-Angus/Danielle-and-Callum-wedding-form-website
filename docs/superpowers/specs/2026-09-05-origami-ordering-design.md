# Origami Ordering Design

## Goal
Add a playful, non-payment origami paper ordering flow to the wedding form website, with a client-side cart and backend email notification.

## Context
The existing wedding form site is a static HTML/CSS/JS application with a shared desktop/mobile header. The existing API is an Express service mounted under `/v1`, and the API project already uses Resend for transactional email.

## Scope
- Add a new Origami shop page to the wedding form website.
- Add an Origami navigation link to the existing desktop and mobile headers.
- Offer one product: `Origami Paper`.
- Allow the visitor to choose a quantity and add the product to a client-side cart.
- Provide a cart summary with quantity controls/removal and checkout.
- Checkout collects the customer's name and email.
- Submit the order to a new API endpoint.
- API validates the request, generates a short order ID, and sends an order notification email to the configured recipient using Resend.
- API does not store orders and does not process money or payment details.
- Show a confirmation state/page after a successful order.

## Out of Scope
- Payments, Stripe, PayPal, or any other payment provider.
- Persistent cart storage or database-backed carts.
- Persistent order database.
- Customer accounts.
- Shipping, stock, fulfilment, or real-world purchasing.
- Multiple products or product variants in this version.

## User Experience
### Navigation
The Origami page is reachable from the existing site header as `Origami`. The existing mobile hamburger menu must expose the same link.

### Shop
The page presents the single `Origami Paper` product with:
- Product name.
- A playful short description making clear that this is a fun/non-payment feature.
- Quantity selector.
- `Add to cart` action.
- Visible cart count/state.

### Cart
The cart remains in browser memory only. It contains one line item for `Origami Paper` and supports increasing/decreasing quantity, removing the item, and proceeding to checkout.

### Checkout
Checkout displays the order summary and collects:
- Name (required).
- Email (required and validated in the browser).

The primary action is `Place Order`. There are no payment fields and no price/total that could imply a real monetary transaction.

### Confirmation
A successful response displays a confirmation state including the generated order ID and a clear statement that the order was received.

## Frontend Technical Design
The static site keeps the same plain HTML/CSS/JS approach as the existing pages.

Proposed files:
- `origami.html` — shop, cart, and checkout markup.
- `origami.css` — page-specific styles while reusing the existing visual language.
- `origami.js` — cart state, rendering, checkout validation, API request, loading/error/confirmation states.
- `style.css` — add only the shared/navigation additions needed for the Origami link if necessary.
- Existing shared header markup on current pages — add the Origami link alongside current navigation entries so the feature is discoverable from the site.

The cart state is represented as a single numeric quantity. The browser submits only `{ name, email, quantity }` to the API.

## Backend Technical Design
Proposed files:
- `v1/routes/origami.js` — POST `/v1/origami/order` endpoint.
- `v1/router.js` — register the new `/origami` route.
- `v1/services/emailHandler.js` — extend the current Resend mail helper with an order-notification function rather than creating a second email client.

Request contract:
```json
{
  "name": "string",
  "email": "string",
  "quantity": 1
}
```

Validation requirements:
- `name` must be a non-empty trimmed string.
- `email` must be a non-empty valid email-like string.
- `quantity` must be an integer from 1 through 20.
- Reject malformed JSON/body data with HTTP 400.

Success response:
```json
{
  "success": true,
  "orderId": "ORI-XXXXXX"
}
```

Failure responses:
- `400` for invalid input.
- `500` when Resend/email delivery initiation fails.

The order ID should be generated server-side so the browser cannot choose it.

## Email Design
Use the existing Resend configuration. The recipient should come from a backend environment variable such as `ORIGAMI_ORDER_EMAIL`; do not hard-code a private destination into frontend code.

Email contents:
- Subject: `New Origami Order — ORI-XXXXXX`
- Customer name.
- Customer email.
- Product: `Origami Paper`.
- Quantity.
- Order ID.
- Explicit note that this is a non-payment/fun order.

`Reply-To` should be the customer's submitted email so the notification can be answered directly.

## Security / Abuse Controls
- Never trust frontend quantity/name/email values.
- Keep the Resend API key server-side only.
- Reject excessive quantities (maximum 20 per order).
- Do not log the Resend API key or full request body.
- Log order ID, quantity, and recipient domain for operational diagnostics without unnecessarily logging the customer's full email address.

## Acceptance Criteria
- `form.danielle-and-callum.quintondev.com/origami` renders correctly on desktop and mobile.
- Origami appears in both desktop and mobile navigation.
- Adding paper updates the cart without a page reload.
- Quantity can be increased/decreased and the item can be removed.
- Checkout validates name/email in the browser.
- Successful checkout calls `POST /v1/origami/order` and shows the returned order ID.
- The API rejects invalid quantities and missing/invalid name/email with `400`.
- A valid order causes one Resend notification email to be sent to `ORIGAMI_ORDER_EMAIL`.
- No payment information is requested anywhere.
- No order is persisted in Supabase or another database.
