import assert from "node:assert/strict";
import test from "node:test";
import { getCertificates } from "../src/services/certificateService.js";

test("certificates count unique employees and match numeric and string database IDs", async (context) => {
  context.mock.method(globalThis, "fetch", async (url) => ({
    ok: true,
    json: async () => url === "/api/certificates"
      ? [
        { certificate_type_id: 1, name: "BHV" },
        { certificate_type_id: "2", name: "VCA", description: "Veiligheid", category: "Veiligheid" },
        { certificate_type_id: 3, name: "EHBO" },
      ]
      : [
        { certificate_type_id: "1", employee_id: 10 },
        { certificate_type_id: 1, employee_id: "10" },
        { certificate_type_id: 1, employee_id: 11 },
        { certificate_type_id: 2, employee_id: 10 },
      ],
  }));

  const certificates = await getCertificates();
  assert.deepEqual(certificates.map(({ id, employeeIds }) => ({ id, employeeIds })), [
    { id: "1", employeeIds: ["10", "11"] },
    { id: "2", employeeIds: ["10"] },
    { id: "3", employeeIds: [] },
  ]);
  assert.equal(certificates[0].category, "");
  assert.equal(certificates[0].description, "");
  assert.equal(certificates[1].category, "Veiligheid");
});

test("a failed certificate or employee-link request reports an error instead of incorrect counts", async (context) => {
  for (const failedUrl of ["/api/certificates", "/api/employee_certificates"]) {
    const fetchMock = context.mock.method(globalThis, "fetch", async (url) => ({
      ok: url !== failedUrl,
      json: async () => [],
    }));
    await assert.rejects(getCertificates(), /De certificaten konden niet worden opgehaald/);
    fetchMock.mock.restore();
  }
});

test("an empty certificate catalogue remains empty", async (context) => {
  context.mock.method(globalThis, "fetch", async () => ({ ok: true, json: async () => [] }));
  assert.deepEqual(await getCertificates(), []);
});
