import type { Metadata } from "next";
import Link from "next/link";

import PageHeader from "../../components/PageHeader";

export const metadata: Metadata = {
  title: "Privacy Policy - iNZight Analytics Ltd",
  description:
    "How iNZight Analytics Ltd collects and uses personal information submitted through our website contact form.",
};

export default function PrivacyPage() {
  return (
    <div>
      <PageHeader primary="Privacy Policy" />

      <div className="px-8 pb-24">
        <div className="max-w-6xl mx-auto pt-8 lg:pt-12">
          <div className="max-w-3xl prose lg:text-lg [&_p]:first:text-lg [&_p]:first:font-semibold [&_p]:mb-6 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:lg:text-3xl [&_h2]:font-normal [&_h2]:mt-12 [&_h2]:mb-6 [&_h2]:first:mt-0 [&_ul]:my-4 [&_li]:my-1 [&_a]:text-accent-600 [&_a]:no-underline [&_a]:hover:underline">
            <p>
              iNZight Analytics Ltd (&ldquo;we&rdquo;, &ldquo;us&rdquo;) respects
              your privacy. This policy explains what personal information we
              collect through our website and how we use it.
            </p>

            <h2>Information we collect</h2>
            <p>
              When you use our{" "}
              <Link href="/contact">contact form</Link>, we collect personal
              information from you, including:
            </p>
            <ul>
              <li>your name</li>
              <li>
                your contact information (such as email address or phone
                number)
              </li>
              <li>the content of your message</li>
            </ul>

            <h2>How we use your information</h2>
            <p>We collect your personal information in order to:</p>
            <ul>
              <li>respond to messages sent through our contact form</li>
            </ul>
            <p>
              We do not sell your personal information. We only use it for the
              purpose described above.
            </p>

            <h2>Your rights</h2>
            <p>
              Under the Privacy Act 2020, you have the right to ask for a copy of
              any personal information we hold about you, and to ask for it to be
              corrected if you think it is wrong.
            </p>
            <p>
              To request a copy of your information, or to have it corrected,
              please contact us at{" "}
              <a href="mailto:support@inzight.co.nz">support@inzight.co.nz</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
