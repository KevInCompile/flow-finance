import "./input.css";

interface ModelInput {
  label: string;
  type: string;
  value?: string;
  onChange?: () => void;
  name?: string;
}

export default function Input(props: ModelInput) {
  return (
    <div className="inputField">
      <input required {...props} />
      <label>{props.label} *</label>
    </div>
  );
}
