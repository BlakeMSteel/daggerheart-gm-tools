import { useId } from "react";
import { useObjectUrl } from "./useObjectUrl";

interface ImageInputProps {
  label: string;
  value: Blob | null;
  onChange: (image: Blob | null) => void;
}

export function ImageInput({ label, value, onChange }: ImageInputProps) {
  const inputId = useId();
  const url = useObjectUrl(value);

  return (
    <div className="image-input">
      <div className="image-preview">
        {url ? <img src={url} alt={label} /> : <span>No image</span>}
      </div>
      <div className="image-actions">
        <label htmlFor={inputId} className="button">
          {value ? "Replace image" : "Add image"}
        </label>
        <input
          id={inputId}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onChange(file);
            e.target.value = "";
          }}
        />
        {value && (
          <button type="button" onClick={() => onChange(null)}>
            Remove
          </button>
        )}
      </div>
    </div>
  );
}
