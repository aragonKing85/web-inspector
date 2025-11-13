export function defineRule(config) {
  if (!config.id) throw new Error("Rule must have an id");
  if (!config.group) throw new Error("Rule must have a group");
  if (!config.message) throw new Error("Rule must have a message");

  return {
    id: config.id,
    group: config.group,
    message: config.message,
    description: config.description || "",
    severity: config.severity || "error",
    mode: config.mode || "overlay",
    category: config.category || "info",
    query: config.query || null,
    test: config.test,
  };
}
