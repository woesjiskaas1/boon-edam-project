import assert from "node:assert/strict";
import test from "node:test";
import { sortSkills, updateSkillSort } from "../src/utils/skillSorting.js";

test("switching columns retains both directions and gives the clicked column priority", () => {
  let sorts = [{ column: "name", direction: "ascending" }];
  sorts = updateSkillSort(sorts, "name");
  sorts = updateSkillSort(sorts, "employees");
  assert.deepEqual(sorts, [
    { column: "employees", direction: "ascending" },
    { column: "name", direction: "descending" },
  ]);

  sorts = updateSkillSort(sorts, "employees");
  sorts = updateSkillSort(sorts, "name");
  assert.deepEqual(sorts, [
    { column: "name", direction: "ascending" },
    { column: "employees", direction: "descending" },
  ]);
});

test("equal employee counts keep the selected Z–A order while counts sort numerically", () => {
  const skills = [
    { id: "alpha", name: "Alpha" },
    { id: "beta", name: "Beta" },
    { id: "gamma", name: "Gamma" },
    { id: "delta", name: "Delta" },
  ];
  const counts = new Map([["alpha", 2], ["beta", 2], ["gamma", 10], ["delta", 0]]);
  const sorts = [
    { column: "employees", direction: "descending" },
    { column: "name", direction: "descending" },
  ];

  assert.deepEqual(sortSkills(skills, counts, sorts).map((skill) => skill.id), [
    "gamma", "beta", "alpha", "delta",
  ]);
  assert.deepEqual(skills.map((skill) => skill.id), ["alpha", "beta", "gamma", "delta"]);
  assert.deepEqual(sortSkills(skills.filter((skill) => skill.id !== "gamma"), counts, sorts)
    .map((skill) => skill.id), ["beta", "alpha", "delta"]);
});

test("equal names use the retained employee sort and names sort naturally", () => {
  const skills = [
    { id: "first", name: "Skill 2" },
    { id: "second", name: "skill 2" },
    { id: "third", name: "Skill 10" },
  ];
  const counts = new Map([["first", 1], ["second", 3], ["third", 5]]);
  assert.deepEqual(sortSkills(skills, counts, [
    { column: "name", direction: "ascending" },
    { column: "employees", direction: "descending" },
  ]).map((skill) => skill.id), ["second", "first", "third"]);
});

test("an empty filtered table stays empty", () => {
  assert.deepEqual(sortSkills([], new Map(), [{ column: "name", direction: "ascending" }]), []);
});
