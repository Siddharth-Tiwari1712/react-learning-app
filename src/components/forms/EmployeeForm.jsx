// STAGE 5a: MANUAL form with controlled inputs.
// Every input's value comes from state; every change goes through state.
//
//   keystroke -> onChange -> setValues -> re-render -> input shows new value
//
// You write: state, change handler, validation, error display, reset.
// That boilerplate is why form libraries exist (see EmployeeFormRHF).
import { useState } from "react";
import Field from "./Field.jsx";
import { validateEmployee, DEPARTMENTS } from "../../utils/validation.js";

const emptyValues = {
  name: "", email: "", role: "", department: "Engineering",
  employmentType: "full-time", isActive: true,
  skills: [""], // DYNAMIC FIELDS: an array of inputs
};

function EmployeeForm({ onSubmit }) {
  const [values, setValues] = useState(emptyValues);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // One handler for all simple inputs, keyed by the input's `name` attribute.
  function handleChange(event) {
    const { name, type, value, checked } = event.target;
    // Functional update + NEW object (never mutate state).
    setValues((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    // Clear that field's error as soon as the user edits it.
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  const changeSkill = (i, v) =>
    setValues((prev) => ({ ...prev, skills: prev.skills.map((s, idx) => (idx === i ? v : s)) }));
  const addSkill = () => setValues((prev) => ({ ...prev, skills: [...prev.skills, ""] }));
  const removeSkill = (i) =>
    setValues((prev) => ({ ...prev, skills: prev.skills.filter((_, idx) => idx !== i) }));

  async function handleSubmit(event) {
    event.preventDefault(); // stop the browser's full-page form submit
    const validationErrors = validateEmployee(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return; // invalid: stay on form

    setSubmitting(true);
    try {
      await onSubmit({ ...values, skills: values.skills.map((s) => s.trim()).filter(Boolean) });
      setValues(emptyValues); // reset after success
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <h3>Add employee (manual controlled form)</h3>

      <Field label="Name" error={errors.name}>
        {(p) => <input {...p} name="name" value={values.name} onChange={handleChange} />}
      </Field>
      <Field label="Email" error={errors.email}>
        {(p) => <input {...p} name="email" type="email" value={values.email} onChange={handleChange} />}
      </Field>
      <Field label="Role" error={errors.role}>
        {(p) => <input {...p} name="role" value={values.role} onChange={handleChange} />}
      </Field>
      <Field label="Department">
        {(p) => (
          <select {...p} name="department" value={values.department} onChange={handleChange}>
            {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
          </select>
        )}
      </Field>

      {/* RADIO: all share one state value; `checked` is derived from state */}
      <fieldset>
        <legend>Employment type</legend>
        {["full-time", "contract"].map((t) => (
          <label key={t} className="inline">
            <input type="radio" name="employmentType" value={t}
              checked={values.employmentType === t} onChange={handleChange} /> {t}
          </label>
        ))}
      </fieldset>

      {/* CHECKBOX uses `checked`, not `value` */}
      <label className="inline">
        <input type="checkbox" name="isActive" checked={values.isActive} onChange={handleChange} /> Active
      </label>

      <fieldset>
        <legend>Skills</legend>
        {values.skills.map((skill, i) => (
          // Index as key is a compromise here: removing a middle row can shift
          // focus. Fine for a learning form; production code would give each row an id.
          <div key={i} className="row">
            <input aria-label={`Skill ${i + 1}`} value={skill} onChange={(e) => changeSkill(i, e.target.value)} />
            <button type="button" className="btn btn--ghost" onClick={() => removeSkill(i)}>✕</button>
          </div>
        ))}
        <button type="button" className="btn btn--ghost" onClick={addSkill}>+ Add skill</button>
      </fieldset>

      <button className="btn" type="submit" disabled={submitting}>
        {submitting ? "Saving…" : "Add employee"}
      </button>
    </form>
  );
}

export default EmployeeForm;
