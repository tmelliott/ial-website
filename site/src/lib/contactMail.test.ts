import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildContactMail } from "./contactMail.ts";

const gmail = "inbox@example.com";

function fields(overrides: Partial<Parameters<typeof buildContactMail>[0]> = {}) {
  return {
    name: "Ada Lovelace",
    email: "ada@example.com",
    phoneNumber: "",
    message: "Hello there",
    person: "",
    ...overrides,
  };
}

describe("buildContactMail", () => {
  it("rejects a missing name, message, or both email and phone", async () => {
    const lookup = async () => undefined;
    for (const input of [
      fields({ name: "  " }),
      fields({ message: "" }),
      fields({ email: "", phoneNumber: "" }),
    ]) {
      const result = await buildContactMail(input, { gmailAddress: gmail, lookupTeamEmail: lookup });
      assert.equal(result.status, 400);
    }
  });

  it("sends a known team member the message and copies the Gmail address", async () => {
    const result = await buildContactMail(fields({ person: "ada" }), {
      gmailAddress: gmail,
      lookupTeamEmail: async (slug) => (slug === "ada" ? "ada@inzight.example" : undefined),
    });
    assert.equal(result.status, 303);
    if (result.status !== 303) return;
    assert.equal(result.location, "/contact/thank-you");
    assert.equal(result.mail.to, "ada@inzight.example");
    assert.equal(result.mail.cc, gmail);
    assert.equal(result.mail.subject, "Contact Form Submission");
  });

  it("sends only to the Gmail address when no person is chosen", async () => {
    const result = await buildContactMail(fields(), {
      gmailAddress: gmail,
      lookupTeamEmail: async () => {
        throw new Error("lookup should not run");
      },
    });
    assert.equal(result.status, 303);
    if (result.status !== 303) return;
    assert.equal(result.mail.to, gmail);
    assert.equal(result.mail.cc, undefined);
    assert.equal(result.location, "/contact/thank-you");
  });

  it("rejects header injection, bad contact details, and oversized messages", async () => {
    const lookup = async () => undefined;
    const deps = { gmailAddress: gmail, lookupTeamEmail: lookup };
    for (const input of [
      fields({ email: "ada@example.com\nBcc: spam@evil.test" }),
      fields({ email: "ada@example.com,attacker@evil.test" }),
      fields({ email: "<ada@example.com>" }),
      fields({ email: '"Ada" <ada@example.com>' }),
      fields({ email: "ada@example.com\u2028Bcc: spam@evil.test" }),
      fields({ name: "Ada\rLovelace" }),
      fields({ phoneNumber: "not a phone", email: "" }),
      fields({ person: "../admin" }),
      fields({ message: "x".repeat(4001) }),
    ]) {
      const result = await buildContactMail(input, deps);
      assert.equal(result.status, 400);
    }
  });

  it("ignores a team address that is not a single mailbox", async () => {
    const result = await buildContactMail(fields({ person: "ada" }), {
      gmailAddress: gmail,
      lookupTeamEmail: async () => "ada@inzight.example\nBcc: spam@evil.test",
    });
    assert.equal(result.status, 303);
    if (result.status !== 303) return;
    assert.equal(result.mail.to, gmail);
    assert.equal(result.mail.cc, undefined);
    assert.equal(result.mail.replyTo, "ada@example.com");
  });

  it("escapes HTML in the message body", async () => {
    const result = await buildContactMail(
      fields({ name: `Tom & "Jo"`, email: "a@b.co", message: `<script>alert("x")</script>` }),
      { gmailAddress: gmail, lookupTeamEmail: async () => undefined },
    );
    assert.equal(result.status, 303);
    if (result.status !== 303) return;
    assert.match(result.mail.html, /Tom &amp; &quot;Jo&quot;/);
    assert.match(result.mail.html, /&lt;script&gt;alert\(&quot;x&quot;\)&lt;\/script&gt;/);
    assert.equal(result.mail.html.includes("<script>"), false);
  });
});
