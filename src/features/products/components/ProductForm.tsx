import { useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import { validateProductForm, type ProductFormErrors, type ProductFormValues } from '../validation/productValidation';
import { SlugAlreadyExistsError, type NewProductInput } from '../api/products.api';
import { PRODUCT_CATEGORIES, type ProductCategory } from '../types/product.types';

interface ProductFormProps {
  /** Pre-fills the form (edit mode). Omit for an empty form (create mode). */
  initialValues?: ProductFormValues;
  submitLabel: string;
  submittingLabel: string;
  /**
   * The ONLY thing that differs between "create" and "edit": what
   * happens with the validated data. This form doesn't import
   * `createProduct` or `updateProduct` anymore — it just calls whatever
   * async function it's given, and reacts to whether that function
   * resolves (success — the caller is responsible for closing the
   * modal, showing a toast, navigating, whatever THAT context needs) or
   * throws (failure — this form handles displaying the error, the same
   * way regardless of which operation it was).
   */
  onSubmit: (input: NewProductInput) => Promise<void>;
  onCancel: () => void;
}

const EMPTY_FORM: ProductFormValues = {
  name: '',
  category: '',
  price: '',
  quantity: '',
  imageUrl: '',
  isAvailable: true,
  isPromoted: false,
};

export function ProductForm({ initialValues, submitLabel, submittingLabel, onSubmit, onCancel }: ProductFormProps) {
  const [values, setValues] = useState<ProductFormValues>(initialValues ?? EMPTY_FORM);
  const [errors, setErrors] = useState<ProductFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [imagePreviewFailed, setImagePreviewFailed] = useState(false);

  function handleChange<K extends keyof ProductFormValues>(field: K, value: ProductFormValues[K]) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  function handleImageUrlChange(value: string) {
    setValues((current) => ({ ...current, imageUrl: value }));
    setImagePreviewFailed(false);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitError(null);

    const { errors: validationErrors, isValid } = validateProductForm(values);
    setErrors(validationErrors);
    if (!isValid) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        name: values.name.trim(),
        category: values.category as ProductCategory,
        price: Number(values.price),
        quantity: Number(values.quantity),
        imageUrl: values.imageUrl.trim() || undefined,
        isAvailable: values.isAvailable,
        isPromoted: values.isPromoted,
      });
      // No further action here on success — closing the form, showing a
      // toast, redirecting: all of that belongs to whoever passed in
      // `onSubmit`, because only THEY know what context they're in.
    } catch (error) {
      // This SlugAlreadyExistsError handling is identical for create and
      // edit — both `createProduct` and `updateProduct` throw the same
      // error class when the name collides with a DIFFERENT product,
      // so one branch here correctly covers both operations.
      if (error instanceof SlugAlreadyExistsError) {
        setErrors((current) => ({
          ...current,
          name: 'Un produit avec un nom très proche existe déjà — choisis un nom différent.',
        }));
      } else {
        setSubmitError(error instanceof Error ? error.message : "Une erreur inattendue s'est produite.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  const trimmedImageUrl = values.imageUrl.trim();
  const showImagePreview = trimmedImageUrl !== '' && !imagePreviewFailed;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {submitError && <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{submitError}</p>}

      <FormField label="Nom" error={errors.name}>
        <input
          type="text"
          value={values.name}
          onChange={(event) => handleChange('name', event.target.value)}
          className={inputClassName(Boolean(errors.name))}
        />
      </FormField>

      <FormField label="Catégorie" error={errors.category}>
        <select
          value={values.category}
          onChange={(event) => handleChange('category', event.target.value as ProductFormValues['category'])}
          className={inputClassName(Boolean(errors.category))}
        >
          <option value="">Choisir...</option>
          {PRODUCT_CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Prix (€)" error={errors.price}>
          <input
            type="text"
            inputMode="decimal"
            value={values.price}
            onChange={(event) => handleChange('price', event.target.value)}
            className={inputClassName(Boolean(errors.price))}
          />
        </FormField>

        <FormField label="Quantité" error={errors.quantity}>
          <input
            type="text"
            inputMode="numeric"
            value={values.quantity}
            onChange={(event) => handleChange('quantity', event.target.value)}
            className={inputClassName(Boolean(errors.quantity))}
          />
        </FormField>
      </div>

      <FormField label="URL de l'image (optionnel)" error={errors.imageUrl}>
        <input
          type="text"
          value={values.imageUrl}
          onChange={(event) => handleImageUrlChange(event.target.value)}
          className={inputClassName(Boolean(errors.imageUrl))}
        />
      </FormField>

      <div>
        <span className="mb-1 block text-sm font-medium text-neutral-700">Aperçu</span>
        <div className="flex h-40 w-full items-center justify-center overflow-hidden rounded-md border border-dashed border-neutral-300 bg-white sm:h-48">
          {showImagePreview ? (
            <img
              key={trimmedImageUrl}
              src={trimmedImageUrl}
              alt="Aperçu du produit"
              onError={() => setImagePreviewFailed(true)}
              className="h-full w-full object-contain"
            />
          ) : (
            <span className="text-sm text-neutral-400">Aucune image</span>
          )}
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-neutral-700">
        <input
          type="checkbox"
          checked={values.isAvailable}
          onChange={(event) => handleChange('isAvailable', event.target.checked)}
        />
        Disponible à la vente
      </label>

      <label className="flex items-center gap-2 text-sm text-neutral-700">
        <input
          type="checkbox"
          checked={values.isPromoted}
          onChange={(event) => handleChange('isPromoted', event.target.checked)}
        />
        Mettre en avant (marketing)
      </label>

      <div className="mt-2 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-amber-400 px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-amber-500 disabled:opacity-50"
        >
          {isSubmitting ? submittingLabel : submitLabel}
        </button>
      </div>
    </form>
  );
}

function inputClassName(hasError: boolean): string {
  return `w-full rounded-md border px-3 py-2 text-sm focus:outline-none ${
    hasError ? 'border-red-400 focus:border-red-500' : 'border-neutral-300 focus:border-neutral-900'
  }`;
}

interface FormFieldProps {
  label: string;
  error?: string;
  children: ReactNode;
}

function FormField({ label, error, children }: FormFieldProps) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="font-medium text-neutral-700">{label}</span>
      {children}
      {error && <span className="text-xs text-red-600">{error}</span>}
    </label>
  );
}
