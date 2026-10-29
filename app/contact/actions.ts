"use server";

import { Resend } from "resend";
import { servicesFor, validate, type QuoteData } from "./quote";

export type SendQuoteResult = { ok: true } | { ok: false; error: string };

const FAILED =
  "We couldn't send your request. Please try again, or give us a call.";

/**
 * Emails a quote request to the business inbox, with Reply-To set to the customer so a reply goes
 * straight back to them.
 */
export async function sendQuote(data: QuoteData): Promise<SendQuoteResult> {
  // The client already validated each step, but this endpoint is public, so check again.
  const invalid = [0, 1, 2].some(
    (step) => Object.keys(validate(step, data)).length > 0,
  );
  const options = servicesFor(data.propertyType);
  const services = options
    .filter((s) => data.services.includes(s.id))
    .map((s) => s.name);
  if (invalid || services.length !== data.services.length)
    return { ok: false, error: "Some of your details look incomplete." };

  const { RESEND_API_KEY, QUOTE_TO_EMAIL, QUOTE_FROM_EMAIL } = process.env;
  if (!RESEND_API_KEY || !QUOTE_TO_EMAIL || !QUOTE_FROM_EMAIL) {
    console.error(
      "Quote email is not configured: set RESEND_API_KEY, QUOTE_TO_EMAIL and QUOTE_FROM_EMAIL.",
    );
    return { ok: false, error: FAILED };
  }

  const name = `${data.firstName.trim()} ${data.lastName.trim()}`;
  const commercial = data.propertyType === "commercial";
  const rows: [string, string][] = [
    ["Type", commercial ? "Commercial" : "Residential"],
    ...(commercial
      ? [["Business", data.businessName.trim()] as [string, string]]
      : []),
    ["Name", name],
    ["Email", data.email.trim()],
    ["Phone", data.phone.trim()],
    [
      "Address",
      `${data.street.trim()}, ${data.city.trim()}, TX ${data.zip.trim()}`,
    ],
    ["Services", services.join(", ")],
    ["Details", data.details.trim().slice(0, 5000) || "No extra notes."],
  ];

  const text = rows.map(([label, value]) => `${label}: ${value}`).join("\n");
  const html = `<table cellpadding="6" style="border-collapse:collapse;font-family:sans-serif;font-size:15px">${rows
    .map(
      ([label, value]) =>
        `<tr><td style="color:#666;vertical-align:top">${label}</td><td style="white-space:pre-line">${escapeHtml(value)}</td></tr>`,
    )
    .join("")}</table>`;

  const { error } = await new Resend(RESEND_API_KEY).emails.send({
    from: QUOTE_FROM_EMAIL,
    to: QUOTE_TO_EMAIL.split(",").map((e) => e.trim()),
    replyTo: data.email.trim(),
    subject: `Quote request: ${commercial ? data.businessName.trim() : name}`,
    text,
    html,
  });
  if (error) {
    console.error("Resend failed to send a quote request:", error);
    return { ok: false, error: FAILED };
  }
  return { ok: true };
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
