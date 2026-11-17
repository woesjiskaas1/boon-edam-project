export function updateSkillSort(sorts, column) {
  const currentSort = sorts.find((sort) => sort.column === column);

  return [
    {
      column,
      direction: currentSort?.direction === "ascending" ? "descending" : "ascending",
    },
    ...sorts.filter((sort) => sort.column !== column),
  ];
}

export function sortSkills(skills, employeeCounts, sorts) {
  return [...skills].sort((first, second) => {
    const nameOrder = first.name.localeCompare(second.name, "nl", {
      sensitivity: "base",
      numeric: true,
    });

    for (const sort of sorts) {
      const order = sort.column === "name"
        ? nameOrder
        : employeeCounts.get(first.id) - employeeCounts.get(second.id);

      if (order !== 0) return order * (sort.direction === "ascending" ? 1 : -1);
    }

    return nameOrder;
  });
}
