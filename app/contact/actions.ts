"use server";

import { SeverityNumber } from "@opentelemetry/api-logs";
import { after } from "next/server";
import { Resend } from "resend";
import {
  flushPostHogLogs,
  getPostHogLogLogger,
} from "../../instrumentation";
import { servicesFor, validate, type QuoteData } from "./quote";
import {
  quoteEmailHtml,
  quoteEmailSubject,
  quoteEmailText,
  type QuoteEmail,
} from "./quote-email";

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

  const commercial = data.propertyType === "commercial";
  const logQuoteEmailOutcome = (
    status: "configuration_missing" | "delivery_failed" | "sent",
    severityNumber: SeverityNumber,
  ) => {
    const logger = getPostHogLogLogger();
    if (!logger) return;

    logger.emit({
      body: "Quote request email processing completed",
      severityNumber,
      attributes: {
        event: "quote_request_email",
        status,
        property_type: data.propertyType,
        service_count: services.length,
        commercial,
      },
    });
    after(flushPostHogLogs);
  };

  const { RESEND_API_KEY, QUOTE_TO_EMAIL, QUOTE_FROM_EMAIL } = process.env;
  if (!RESEND_API_KEY || !QUOTE_TO_EMAIL || !QUOTE_FROM_EMAIL) {
    logQuoteEmailOutcome("configuration_missing", SeverityNumber.ERROR);
    console.error(
      "Quote email is not configured: set RESEND_API_KEY, QUOTE_TO_EMAIL and QUOTE_FROM_EMAIL.",
    );
    return { ok: false, error: FAILED };
  }

  const quote: QuoteEmail = {
    commercial,
    businessName: commercial ? data.businessName.trim() : "",
    name: `${data.firstName.trim()} ${data.lastName.trim()}`,
    email: data.email.trim(),
    phone: data.phone.trim(),
    address: `${data.street.trim()}, ${data.city.trim()}, ${data.state} ${data.zip.trim()}`,
    services,
    details: data.details.trim().slice(0, 5000),
  };

  const { error } = await new Resend(RESEND_API_KEY).emails.send({
    from: QUOTE_FROM_EMAIL,
    to: QUOTE_TO_EMAIL.split(",").map((e) => e.trim()),
    replyTo: quote.email,
    subject: quoteEmailSubject(quote),
    text: quoteEmailText(quote),
    html: quoteEmailHtml(quote),
  });
  if (error) {
    logQuoteEmailOutcome("delivery_failed", SeverityNumber.ERROR);
    console.error("Resend failed to send a quote request:", error);
    return { ok: false, error: FAILED };
  }
  logQuoteEmailOutcome("sent", SeverityNumber.INFO);
  return { ok: true };
}
