import assert from "node:assert/strict";
import test from "node:test";
import certificates from "../src/data/certificates.js";
import { getCertificateDetails } from "../src/utils/certificateDetails.js";

test("every certificate in the example catalogue has researched details and source links", () => {
  for (const certificate of certificates) {
    const details = getCertificateDetails(certificate);
    assert.equal(details.researched, true, certificate.name);
    assert.ok(details.topics.length > 0, certificate.name);
    assert.ok(details.sources.length > 0, certificate.name);
    for (const source of details.sources) assert.equal(new URL(source.url).protocol, "https:");
  }
});

test("known aliases and punctuation resolve without relying on example certificate IDs", () => {
  assert.equal(getCertificateDetails({ id: "123", name: "  vca-b  " }).names[0], "VCA Basis");
  assert.equal(getCertificateDetails({ name: "PRINCE2® Foundation" }).names[0], "PRINCE2 Foundation");
  assert.equal(getCertificateDetails({ name: "NEN3140 VOP" }).names[0], "NEN 3140 VOP");
});

test("a renamed certificate does not inherit researched claims from its old ID", () => {
  const details = getCertificateDetails({ id: "bhv", name: "Interne introductie", description: "  Onze eigen introductie.  " });
  assert.equal(details.researched, false);
  assert.equal(details.summary, "Onze eigen introductie.");
  assert.deepEqual(details.sources, []);
});

test("unknown credentials are not confused with another scheme and have an honest fallback", () => {
  for (const name of ["PRINCE2 Practitioner", "Project Management Professional", "First Aid Certification", "Veiligheidstraining", "EHBO voor kinderen"]) {
    const details = getCertificateDetails({ name });
    assert.equal(details.researched, false, name);
    assert.match(details.summary, /nog geen inhoudelijke beschrijving/);
    assert.deepEqual(details.sources, []);
  }
});
