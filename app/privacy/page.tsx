import type { Metadata } from "next";
import Link from "next/link";
import { LEGAL_EMAIL, LegalPage } from "../components/legal-page";
import type { IconType } from "react-icons";
import { SiPosthog, SiResend, SiVercel } from "react-icons/si";
import { pageMetadata } from "../seo";

const providers: { name: string; use: string; Logo?: IconType }[] = [
  { name: "Vercel", use: "website hosting", Logo: SiVercel },
  { name: "Resend", use: "email delivery for estimate requests", Logo: SiResend },
  { name: "PostHog", use: "website analytics", Logo: SiPosthog },
  { name: "OpenFreeMap", use: "the map on our service area page" },
];

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy",
  description:
    "How Saken's Pressure Washing collects, uses and protects the information you share through our website and when you request an estimate.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy">
      <p>
        Saken&apos;s Pressure Washing LLC (&ldquo;we,&rdquo; &ldquo;us&rdquo; or &ldquo;our&rdquo;)
        respects your privacy. This policy explains what information we collect through
        sakenpressurewash.com (the &ldquo;Site&rdquo;) and when you contact us, how we use it, and
        the choices you have.
      </p>

      <h2>Information we collect</h2>
      <p>
        <strong>Information you give us.</strong> When you request an estimate or contact us, we
        collect what you choose to share, such as your name, email address, phone number, property
        address, business name, the services you&apos;re interested in, and any details about your
        property. We also keep records of calls, texts and emails you exchange with us.
      </p>
      <p>
        <strong>Information collected automatically.</strong> When you visit the Site, we use an
        analytics service to understand how it&apos;s used. This can include the pages you view,
        buttons and links you click, the site that referred you, your browser and device type, and
        your approximate location based on your IP address. This service uses cookies or similar
        browser storage to recognize returning visitors.
      </p>

      <h2>How we use your information</h2>
      <ul>
        <li>To respond to your requests and prepare estimates</li>
        <li>To schedule, perform and invoice the work you hire us for</li>
        <li>To call, text or email you about your request or job</li>
        <li>To understand how visitors use the Site and improve it</li>
        <li>To protect the Site and our business, and to meet legal obligations</li>
      </ul>
      <p>
        We only contact you about your request and any work we do for you. We don&apos;t send
        promotional messages unless you&apos;ve asked to receive them, and message and data rates
        from your carrier may apply to texts.
      </p>

      <h2>How we share your information</h2>
      <p>
        We do not sell your personal information or share it for advertising. We share it only with
        service providers who help us run the business and the Site, and only as needed for them to
        do that work:
      </p>
      {/* Logos stand in for the bullets; a provider without one keeps the same indent. */}
      <ul className="list-none! pl-0!">
        {providers.map(({ name, use, Logo }) => (
          <li key={name} className="flex items-center gap-3">
            <span className="grid size-5 shrink-0 place-items-center" aria-hidden="true">
              {Logo && <Logo className="size-[18px] text-brand-foreground" />}
            </span>
            <span>
              <strong>{name}</strong>: {use}
            </span>
          </li>
        ))}
        <li className="flex items-center gap-3">
          <span className="size-5 shrink-0" aria-hidden="true" />
          The scheduling, estimating and invoicing software we use to manage customer jobs
        </li>
      </ul>
      <p>
        We may also disclose information if the law requires it, to protect our rights or the
        safety of others, or as part of a sale or transfer of the business.
      </p>

      <h2>Cookies and analytics</h2>
      <p>
        Our analytics service sets cookies or similar browser storage. You can block or delete
        cookies in your browser settings; the Site will still work. We don&apos;t use advertising
        cookies or track you across other websites.
      </p>

      <h2>How long we keep information</h2>
      <p>
        We keep customer and estimate information for as long as needed to serve you, keep
        accurate business records, and meet tax and legal requirements. Analytics data is kept in
        aggregate form or deleted on a regular schedule.
      </p>

      <h2>How we protect information</h2>
      <p>
        We use best-practice safeguards to protect your information, and our service providers use
        industry-standard security. No method of transmission or storage is completely secure, so
        we can&apos;t guarantee absolute security.
      </p>

      <h2>Your choices</h2>
      <p>
        You can ask us to tell you what personal information we have about you, correct it, or
        delete it, subject to records we must keep by law. To make a request, email us at{" "}
        <a href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</a>. You can also ask us at any time to
        stop contacting you.
      </p>

      <h2>Children&apos;s privacy</h2>
      <p>
        The Site is meant for adults and is not directed to children under 13. We don&apos;t
        knowingly collect personal information from children. If you believe a child has sent us
        information, contact us and we&apos;ll delete it.
      </p>

      <h2>Other websites</h2>
      <p>
        The Site links to other sites, such as our Google, Facebook and LinkedIn pages. Their own
        privacy policies apply when you visit them.
      </p>

      <h2>Changes to this policy</h2>
      <p>
        We may update this policy from time to time. When we do, we&apos;ll change the &ldquo;Last
        updated&rdquo; date above. Please also review our{" "}
        <Link href="/terms">Terms of Service</Link>.
      </p>

      <h2>Contact us</h2>
      <p>
        Saken&apos;s Pressure Washing LLC
        <br />
        Tyler, Texas
        <br />
        Email: <a href={`mailto:${LEGAL_EMAIL}`}>{LEGAL_EMAIL}</a>
        <br />
        Phone: <a href="tel:9035398960">(903) 539-8960</a>
      </p>
    </LegalPage>
  );
}
