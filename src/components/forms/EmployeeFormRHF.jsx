// STAGE 5b: same form with React Hook Form.
// RHF registers inputs as UNCONTROLLED (reads values from the DOM via refs),
// so typing does NOT re-render the whole form on each keystroke.
// Compare the size of this file with EmployeeForm.jsx.
import { useForm, useFieldArray } from "react-hook-form";
import Field from "./Field.jsx";
import { DEPARTMENTS } from "../../utils/validation.js";

function EmployeeFormRHF({ onSubmit }) {
  const {
    register,          // connects an input to the form
    handleSubmit,      // validates, then calls our function with clean data
    control,           // needed by useFieldArray
    reset,
    formState: { errors, isSubmitting }, // reading `errors` subscribes to them
  } = useForm({
    defaultValues: {
      name: "", email: "", role: "", department: "Engineering",
      employmentType: "full-time", isActive: true,
      skills: [{ value: "" }], // useFieldArray needs objects
    },
  });

  // Dynamic fields: RHF gives stable ids (field.id) to use as keys.
  const { fields, append, remove } = useFieldArray({ control, name: "skills" });

  async function submit(data) {
    await onSubmit({ ...data, skills: data.skills.map((s) => s.value.trim()).filter(Boolean) });
    reset();
  }

  return (
    <form className="form" onSubmit={handleSubmit(submit)} noValidate>
      <h3>Add employee (React Hook Form)</h3>

      <Field label="Name" error={errors.name?.message}>
        {(p) => <input {...p} {...register("name", {
          required: "Name is required",
          minLength: { value: 2, message: "Name must be at least 2 characters" },
        })} />}
      </Field>
      <Field label="Email" error={errors.email?.message}>
        {(p) => <input {...p} type="email" {...register("email", {
          required: "Email is required",
          pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email" },
        })} />}
      </Field>
      <Field label="Role" error={errors.role?.message}>
        {(p) => <input {...p} {...register("role", { required: "Role is required" })} />}
      </Field>
      <Field label="Department">
        {(p) => (
          <select {...p} {...register("department")}>
            {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
          </select>
        )}
      </Field>

      <fieldset>
        <legend>Employment type</legend>
        {["full-time", "contract"].map((t) => (
          <label key={t} className="inline">
            <input type="radio" value={t} {...register("employmentType")} /> {t}
          </label>
        ))}
      </fieldset>
      <label className="inline"><input type="checkbox" {...register("isActive")} /> Active</label>

      <fieldset>
        <legend>Skills</legend>
        {fields.map((field, i) => (
          <div key={field.id} className="row">
            <input aria-label={`Skill ${i + 1}`} {...register(`skills.${i}.value`)} />
            <button type="button" className="btn btn--ghost" onClick={() => remove(i)}>✕</button>
          </div>
        ))}
        <button type="button" className="btn btn--ghost" onClick={() => append({ value: "" })}>+ Add skill</button>
      </fieldset>

      <button className="btn" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving…" : "Add employee"}
      </button>
    </form>
  );
}

export default EmployeeFormRHF;
