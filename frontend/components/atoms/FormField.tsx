import { FieldLabel } from '@/components/atoms/FieldLabel';
import { TextFieldInput } from '@/components/atoms/TextFieldInput';
import { TextAreaFieldInput } from '@/components/atoms/TextAreaFieldInput';
import { FEEDBACK_SECTION_QUERY_RESULT } from '@/sanity.types';
import { LangId, localize } from '@/lib/locale';





interface FormFieldProps {
  field: any;
  locale: LangId;
  value: string;
  onChange: (name: string, value: string) => void;
}

export function FormField({ field, locale, value, onChange }: FormFieldProps) {
    if (!field) return null;
  const label = localize(field.label, locale);
  const placeholder = localize(field.placeholder, locale);
  const wrapperClass = field.colSpan ? 'flex flex-col gap-2 sm:col-span-2' : 'flex flex-col gap-2';

  return (
    <div className={wrapperClass}>
      <FieldLabel step={field.step ?? undefined} label={label} htmlFor={field.name} />
      {field.fieldType === 'textarea' ? (
        <TextAreaFieldInput
          id={field.name}
          name={field.name}
          placeholder={placeholder}
          required={field.required ?? undefined}
          value={value}
          onChange={(e) => onChange(field.name, e.target.value)}
        />
      ) : (
        <TextFieldInput
          id={field.name}
          name={field.name}
          type={field.fieldType === 'email' ? 'email' : 'text'}
          placeholder={placeholder}
          required={field.required ?? undefined}
          value={value}
          onChange={(e) => onChange(field.name, e.target.value)}
        />
      )}
    </div>
  );
}