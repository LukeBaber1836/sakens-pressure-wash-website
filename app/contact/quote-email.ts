// The quote request email, styled after the site: a white card on the pale blue tint, navy headings
// in Raleway, an orange eyebrow, and a check-mark service list. Email clients ignore stylesheets and
// most modern CSS, so it's tables and inline styles throughout, with the site's oklch colors converted
// to hex. It's built for light mode only; see the head for how it asks clients to keep it.

const BRAND = "#fda43a";
const BRAND_DARK = "#e29233";
const NAVY = "#002356";
// Navy at 60% over white, as a solid color since not every client honors opacity.
const NAVY_SOFT = "#667b9a";
const TINT = "#e9f6fd";
const TEXT = "#1c1b1a";
const MUTED = "#5c6b80";
const RULE = "#e3e9f1";
const PILL = "#e6eaf0";

const HEADING_FONT = "Raleway, 'Segoe UI', Arial, sans-serif";
const BODY_FONT = "'Public Sans', 'Segoe UI', Arial, sans-serif";
// Backgrounds are painted as an image too: Gmail's apps recolor background colors in dark mode but
// leave background images alone, so this keeps them light there.
const WHITE_BG =
  "background-color:#ffffff;background-image:linear-gradient(#ffffff,#ffffff)";
const TINT_BG = `background-color:${TINT};background-image:linear-gradient(${TINT},${TINT})`;

export type QuoteEmail = {
  commercial: boolean;
  businessName: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  services: string[];
  details: string;
};

export function quoteEmailSubject(quote: QuoteEmail) {
  return `Quote request: ${quote.commercial ? quote.businessName : quote.name}`;
}

export function quoteEmailText(quote: QuoteEmail) {
  const rows: [string, string][] = [
    ["Type", quote.commercial ? "Commercial" : "Residential"],
    ...(quote.commercial
      ? [["Business", quote.businessName] as [string, string]]
      : []),
    ["Name", quote.name],
    ["Email", quote.email],
    ["Phone", quote.phone],
    ["Address", quote.address],
    ["Services", quote.services.join(", ")],
    ["Details", quote.details || "No extra notes."],
  ];
  return rows.map(([label, value]) => `${label}: ${value}`).join("\n");
}

export function quoteEmailHtml(quote: QuoteEmail) {
  const phoneDigits = quote.phone.replace(/\D/g, "");

  const contact: [string, string][] = [
    ...(quote.commercial
      ? [["Business", escapeHtml(quote.businessName)] as [string, string]]
      : []),
    ["Name", escapeHtml(quote.name)],
    [
      "Email",
      `<a href="mailto:${escapeHtml(quote.email)}" style="color:${NAVY};text-decoration:none;font-weight:600">${escapeHtml(quote.email)}</a>`,
    ],
    [
      "Phone",
      `<a href="tel:${phoneDigits}" style="color:${NAVY};text-decoration:none;font-weight:600">${escapeHtml(quote.phone)}</a>`,
    ],
    ["Address", escapeHtml(quote.address)],
  ];

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<!-- Light only: tells Apple Mail, iOS Mail and Outlook.com not to restyle it for dark mode. -->
<meta name="color-scheme" content="light only">
<meta name="supported-color-schemes" content="light only">
<title>${escapeHtml(quoteEmailSubject(quote))}</title>
<link href="https://fonts.googleapis.com/css2?family=Public+Sans:wght@400;600;700&family=Raleway:wght@700;800&display=swap" rel="stylesheet">
<style>
  :root { color-scheme: light only; supported-color-schemes: light only; }
</style>
</head>
<body style="margin:0;padding:0;${TINT_BG};color:${TEXT};-webkit-text-size-adjust:100%">
<div style="display:none;max-height:0;overflow:hidden;opacity:0">${escapeHtml(
    `${quote.commercial ? "Commercial" : "Residential"} · ${quote.services.join(", ")} · ${quote.address}`,
  )}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="${TINT_BG}">
<tr><td align="center" style="padding:32px 16px">

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px">
<tr><td style="${WHITE_BG};border-radius:24px;padding:36px 36px 32px;box-shadow:0 24px 50px -24px rgba(1,20,45,0.35)">

  <div style="font-family:${BODY_FONT};font-size:13px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;line-height:1;color:${BRAND_DARK}">New quote request</div>
  <h1 style="margin:10px 0 0;font-family:${HEADING_FONT};font-size:30px;line-height:1.1;font-weight:800;letter-spacing:-0.02em;color:${NAVY}">${escapeHtml(
    quote.commercial ? quote.businessName : quote.name,
  )}</h1>
  <table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:14px"><tr>
    <td style="border-radius:999px;padding:5px 12px;font-family:${BODY_FONT};font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;background-color:${
      quote.commercial ? BRAND : PILL
    };background-image:linear-gradient(${quote.commercial ? BRAND : PILL},${quote.commercial ? BRAND : PILL});color:${NAVY}">${quote.commercial ? "Commercial" : "Residential"}</td>
  </tr></table>

  ${sectionLabel("Contact")}
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-family:${BODY_FONT};font-size:15px;line-height:1.45">
    ${contact
      .map(
        ([label, value], i) => `<tr>
      <td style="width:92px;padding:10px 0;vertical-align:top;color:${MUTED};${i ? `border-top:1px solid ${RULE};` : ""}">${label}</td>
      <td style="padding:10px 0;vertical-align:top;color:${TEXT};${i ? `border-top:1px solid ${RULE};` : ""}">${value}</td>
    </tr>`,
      )
      .join("")}
  </table>

  ${sectionLabel("Services")}
  <table role="presentation" cellpadding="0" cellspacing="0" style="font-family:${BODY_FONT};font-size:15px;line-height:1.4">
    ${quote.services
      .map(
        (service) => `<tr>
      <td style="padding:5px 12px 5px 0;vertical-align:top"><div style="width:20px;height:20px;border-radius:999px;background-color:${BRAND};background-image:linear-gradient(${BRAND},${BRAND});color:${NAVY};font-size:12px;font-weight:700;line-height:20px;text-align:center">&#10003;</div></td>
      <td style="padding:5px 0;vertical-align:top;color:${TEXT}">${escapeHtml(service)}</td>
    </tr>`,
      )
      .join("")}
  </table>

  ${sectionLabel("Details")}
  <div style="border-radius:16px;background-color:${TINT};background-image:linear-gradient(${TINT},${TINT});padding:16px 18px;font-family:${BODY_FONT};font-size:15px;line-height:1.55;color:${
    quote.details ? TEXT : MUTED
  };white-space:pre-line">${escapeHtml(quote.details || "No extra notes.")}</div>

</td></tr>
</table>

</td></tr>
</table>
</body>
</html>`;
}

function sectionLabel(text: string) {
  return `<div style="margin:30px 0 8px;font-family:${BODY_FONT};font-size:12px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:${NAVY_SOFT}">${text}</div>`;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
