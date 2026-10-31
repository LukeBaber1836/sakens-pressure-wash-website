import type { Metadata } from "next";
import Link from "next/link";
import { LEGAL_EMAIL, LegalPage } from "../components/legal-page";
import { pageMetadata } from "../seo";

export const metadata: Metadata = pageMetadata({
  title: "Terms of Service",
  description:
    "The terms for using the Saken's Pressure Washing website and for the estimates and exterior cleaning services we provide in Tyler and East Texas.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service">
      <p>
        These Terms of Service (&ldquo;Terms&rdquo;) apply to your use of sakenpressurewash.com
        (the &ldquo;Site&rdquo;) and to the estimates and services provided by Saken&apos;s Pressure
        Washing LLC (&ldquo;we,&rdquo; &ldquo;us&rdquo; or &ldquo;our&rdquo;). By using the Site or
        hiring us, you agree to these Terms. If a written estimate or agreement for your job says
        something different, that document controls for that job.
      </p>

      <h2>Estimates</h2>
      <p>
        Estimates are free. Submitting a request through the Site does not book a job or create a
        contract. Prices are based on an in-person look at your property, and a job is confirmed
        only once you accept a written estimate from us. Prices shown or discussed before that are
        approximate, and an estimate may change if the work turns out to be different from what was
        described or inspected.
      </p>

      <h2>Scheduling and weather</h2>
      <p>
        We do our best to arrive when scheduled. Rain, freezing temperatures, high winds or other
        unsafe conditions may require us to reschedule, and we&apos;ll let you know as soon as we
        can. If you need to change or cancel an appointment, please tell us as early as possible.
      </p>

      <h2>Your responsibilities</h2>
      <p>To help the job go safely and smoothly, please:</p>
      <ul>
        <li>Give us access to the areas to be cleaned and to a working outdoor water spigot</li>
        <li>Close windows and doors, and move vehicles, furniture and fragile items out of the way</li>
        <li>Keep pets and children away from the work area</li>
        <li>
          Tell us beforehand about known problems, such as loose shingles, damaged siding, failing
          paint, leaky windows or exposed wiring and outlets
        </li>
      </ul>

      <h2>Results and existing conditions</h2>
      <p>
        We use methods suited to each surface, but results depend on the age, material and condition
        of what we clean. Some stains, such as rust, oil, paint, hard water or deep organic staining,
        may lighten without coming out completely. Cleaning can also reveal existing problems that
        dirt or growth had hidden, such as oxidation, faded or failing paint, cracks, loose mortar,
        worn shingles or failed window seals. We are not responsible for these pre-existing
        conditions.
      </p>

      <h2>Payment</h2>
      <p>
        Payment is due as stated on your estimate or invoice. If something about the work
        isn&apos;t right, please tell us promptly so we have the chance to make it right.
      </p>

      <h2>Insurance and limitation of liability</h2>
      <p>
        We are insured and take care to protect your property. To the fullest extent the law
        allows, our total liability for any claim related to our services is limited to the amount
        you paid for the service involved, and we are not liable for indirect, incidental or
        consequential damages. Any damage you believe we caused should be reported to us promptly
        so we can inspect it.
      </p>

      <h2>Using the Site</h2>
      <p>
        You agree to use the Site only for lawful purposes and to provide accurate information when
        you contact us. Don&apos;t try to disrupt the Site, access it in unauthorized ways, or use it
        to send spam or harmful content.
      </p>
      <p>
        The text, photos, videos, logos and other content on the Site belong to Saken&apos;s
        Pressure Washing LLC or are used with permission, and may not be copied or reused without
        our written consent. Photos show real jobs, but results on your property may differ.
        Customer reviews reflect the views of the people who wrote them.
      </p>
      <p>
        The Site is provided &ldquo;as is.&rdquo; We work to keep it accurate and available but
        don&apos;t guarantee that it will always be error-free or uninterrupted, and we aren&apos;t
        liable for damages arising from your use of it, to the fullest extent the law allows. Links
        to other websites are provided for convenience, and we aren&apos;t responsible for their
        content.
      </p>

      <h2>Privacy</h2>
      <p>
        Our <Link href="/privacy">Privacy Policy</Link> explains how we handle the information you
        share with us.
      </p>

      <h2>Governing law</h2>
      <p>
        These Terms are governed by the laws of the State of Texas. Any dispute will be handled in
        the state or federal courts located in Smith County, Texas.
      </p>

      <h2>Changes to these Terms</h2>
      <p>
        We may update these Terms from time to time. When we do, we&apos;ll change the &ldquo;Last
        updated&rdquo; date above. Continuing to use the Site or our services after a change means
        you accept the updated Terms.
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
