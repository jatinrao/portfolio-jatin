'use client';

import { useState } from 'react';
import { FormField } from '@/components/atoms/FormField';
import { LangId } from '@/lib/locale';
// import { SubmitButton } from '../atoms/SubmitButton';
// import type { FeedbackFormField } from '../../types/feedbackSection';

interface FeedbackFormProps {
  fields: any[];
  submitLabel: string;
  submitIcon?: string | null;
  locale: LangId;
}

export function FeedbackForm({ fields, submitLabel, submitIcon, locale }: FeedbackFormProps) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'pending' | 'sent' | 'error'>('idle');

  function handleChange(name: string, value: string) {
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('pending');

    try {
      // TODO: wire this up to your actual submission endpoint (an API route
      // or server action) — Sanity itself isn't a form-submission backend.
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!response.ok) throw new Error('Submission failed');
      setStatus('sent');
      setValues({});
    } catch {
      setStatus('error');
    }
  }

  if (status === 'sent') {
    return (
      <div className="flex items-center font-label-caps text-sm text-secondary md:col-span-2">
        SIGNAL RECEIVED — thanks, we'll be in touch.
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:col-span-2"
    >
      {fields.map((field) => (
        <FormField
          key={field.name}
          field={field}
          locale={locale}
          value={values[field.name] ?? ''}
          onChange={handleChange}
        />
      ))}

      <div className="flex justify-end sm:col-span-2">
        {/* <SubmitButton label={submitLabel} icon={submitIcon} pending={status === 'pending'} /> */}
      </div>

      {status === 'error' && (
        <p className="font-label-caps text-[10px] uppercase text-red-600 sm:col-span-2">
          Transmission failed — please try again.
        </p>
      )}
    </form>
  );
}