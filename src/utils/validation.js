// STAGE 5: plain validation function used by the MANUAL form.
// Returns an object like { name: "Name is required" }. Empty object = valid.
export function validateEmployee(values) {
  const errors = {};
  if (!values.name.trim()) errors.name = "Name is required";
  else if (values.name.trim().length < 2) errors.name = "Name must be at least 2 characters";

  if (!values.email.trim()) errors.email = "Email is required";
  else if (!/^\S+@\S+\.\S+$/.test(values.email)) errors.email = "Enter a valid email";

  if (!values.role.trim()) errors.role = "Role is required";
  return errors;
}

export const DEPARTMENTS = ["Engineering", "Product", "Design", "Quality", "People"];
