import React, { useState, useEffect } from 'react';
import { Tax } from '@/services/taxService';
import { useDarkMode } from '@/contexts/DarkModeContext';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

interface TaxFormProps {
  initial?: Partial<Tax>;
  onSubmit: (data: Partial<Tax>) => void;
  onCancel?: () => void;
  loading?: boolean;
}

const TaxForm: React.FC<TaxFormProps> = ({ initial, onSubmit, onCancel, loading }) => {
  const { currentTheme } = useDarkMode();
  const [form, setForm] = useState<Partial<Tax>>({
    name: '',
    rate: 0,
    code: '',
    description: '',
    active: true,
    type: '',
    ...initial,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setForm({
      name: '',
      rate: 0,
      code: '',
      description: '',
      active: true,
      type: '',
      ...initial,
    });
  }, [initial]);

  const handleChange = (field: keyof Tax, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name?.trim()) errs.name = 'Name is required';
    if (form.rate === undefined || form.rate === null || isNaN(Number(form.rate))) errs.rate = 'Rate is required';
    if (!form.code?.trim()) errs.code = 'Code is required';
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Name"
        value={form.name || ''}
        onChange={e => handleChange('name', e.target.value)}
        error={errors.name}
        required
        style={{ background: currentTheme.background.secondary, color: currentTheme.text.primary }}
      />
      <Input
        label="Rate (%)"
        type="number"
        value={form.rate ?? ''}
        onChange={e => handleChange('rate', parseFloat(e.target.value))}
        error={errors.rate}
        required
        min={0}
        step={0.01}
        style={{ background: currentTheme.background.secondary, color: currentTheme.text.primary }}
      />
      <Input
        label="Code"
        value={form.code || ''}
        onChange={e => handleChange('code', e.target.value)}
        error={errors.code}
        required
        style={{ background: currentTheme.background.secondary, color: currentTheme.text.primary }}
      />
      <Input
        label="Description"
        value={form.description || ''}
        onChange={e => handleChange('description', e.target.value)}
        style={{ background: currentTheme.background.secondary, color: currentTheme.text.primary }}
      />
      <div className="flex items-center gap-2">
        <label style={{ color: currentTheme.text.secondary }}>
          <input
            type="checkbox"
            checked={form.active ?? true}
            onChange={e => handleChange('active', e.target.checked)}
            className="mr-2"
          />
          Active
        </label>
        <Input
          label="Type"
          value={form.type || ''}
          onChange={e => handleChange('type', e.target.value)}
          style={{ background: currentTheme.background.secondary, color: currentTheme.text.primary, minWidth: 100 }}
        />
      </div>
      <div className="flex gap-2 mt-4">
        <Button type="submit" disabled={loading} variant="primary">
          {loading ? (initial?.id ? 'Updating...' : 'Creating...') : (initial?.id ? 'Update' : 'Create')} Tax
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
};

export default TaxForm; 