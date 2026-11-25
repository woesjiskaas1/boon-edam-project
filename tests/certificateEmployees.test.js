import assert from "node:assert/strict";
import test from "node:test";
import { getCertificateEmployees } from "../src/utils/certificateEmployees.js";

test("live certificate links normalize numeric and string database IDs", () => {
  const employees = [
    { id: "EMP001", databaseId: 1, name: "Anna" },
    { id: "EMP002", databaseId: "2", name: "Bas" },
  ];

  assert.deepEqual(getCertificateEmployees({ employeeIds: ["1", 2] }, employees), [
    { id: "1", employee: employees[0] },
    { id: "2", employee: employees[1] },
  ]);
});

test("live certificate links do not confuse employee numbers with database IDs", () => {
  const employees = [
    { id: "2", databaseId: 1, name: "Anna" },
    { id: "1", databaseId: 2, name: "Bas" },
  ];

  assert.deepEqual(getCertificateEmployees({ employeeIds: ["1"] }, employees), [
    { id: "1", employee: employees[0] },
  ]);
  assert.deepEqual(getCertificateEmployees({ employeeIds: ["EMP003"] }, [
    { id: "EMP003", databaseId: 3, name: "Chris" },
  ]), [{ id: "EMP003", employee: null }]);
});

test("example certificate links match employee numbers without using database IDs", () => {
  const employees = [
    { id: "EMP001", databaseId: 2, name: "Anna" },
    { id: "EMP002", databaseId: "EMP001", name: "Bas" },
  ];

  assert.deepEqual(getCertificateEmployees({ employeeIds: ["EMP001", "2"] }, employees, true), [
    { id: "2", employee: null },
    { id: "EMP001", employee: employees[0] },
  ]);
});

test("unresolved certificate links stay visible without matching missing database IDs", () => {
  const employees = [
    { id: "EMP001", name: "Anna" },
    { id: "EMP002", databaseId: null, name: "Bas" },
    { id: "EMP003", databaseId: "", name: "Chris" },
  ];

  assert.deepEqual(getCertificateEmployees({ employeeIds: ["unknown", "undefined", "null", ""] }, employees), [
    { id: "", employee: null },
    { id: "null", employee: null },
    { id: "undefined", employee: null },
    { id: "unknown", employee: null },
  ]);
});

test("certificate employees are deduplicated and sorted naturally by name or unresolved ID", () => {
  const employees = [
    { id: "EMP001", databaseId: 1, name: "Zoë" },
    { id: "EMP002", databaseId: 2, name: "Anna 10" },
    { id: "EMP003", databaseId: 3, name: "anna 2" },
    { id: "EMP004", databaseId: 4, name: "" },
  ];
  const employeeIds = [1, "1", "2", 3, "EMP010", "EMP002", 4];

  assert.deepEqual(getCertificateEmployees({ employeeIds }, employees).map(({ id }) => id), [
    "4", "3", "2", "EMP002", "EMP010", "1",
  ]);
  assert.deepEqual(employeeIds, [1, "1", "2", 3, "EMP010", "EMP002", 4]);
  assert.deepEqual(employees.map(({ databaseId }) => databaseId), [1, 2, 3, 4]);
});

test("certificates without employee links return an empty list", () => {
  assert.deepEqual(getCertificateEmployees({}, []), []);
  assert.deepEqual(getCertificateEmployees({ employeeIds: [] }, []), []);
});
