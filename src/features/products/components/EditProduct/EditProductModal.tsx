import { Modal } from "../../../../shared/ui/components/Modal";
import { updateProduct, type NewProductInput } from "../../api/products.api";
import type { Product } from "../../types/product.types";
import type { ProductFormValues } from "../../validation/productValidation";
import { ProductForm } from "../ProductForm";


export interface ProductUpdatedInfo {
  name: string;
  slug: string;
  lastUpdated: Date;
  /**
   * Whether the slug changed as a result of this edit. This is the
   * ONE piece of information the caller genuinely needs to decide what
   * to do next: if the product being edited is currently displayed at
   * `/produits/:slug` and the slug just changed, that URL is now stale
   * — the caller has to redirect. If it didn't change, the caller can
   * just refresh the data in place.
   */
  slugChanged: boolean;
}

interface EditProductModalProps {
  /** `null` = closed. Same "one value doubles as open/closed AND which
   * product" pattern as `DeleteProductModal` — see the reasoning there. */
  product: Product | null;
  onClose: () => void;
  onProductUpdated: (info: ProductUpdatedInfo) => void;
}

export function EditProductModal({ product, onClose, onProductUpdated }: EditProductModalProps) {
  async function handleSubmit(input: NewProductInput) {
    // `product` can't actually be null here in practice — this function
    // only runs from a submit inside a form that only exists while
    // `product` is truthy (see the `{product && (...)}` guard below).
    // The check exists purely to satisfy TypeScript, not because this
    // path is reachable with a null product.
    if (!product) return;

    const { slug, lastUpdated } = await updateProduct(product.id, input);
    onProductUpdated({
      name: input.name,
      slug,
      lastUpdated,
      slugChanged: slug !== product.slug,
    });
    onClose();
  }

  // Built fresh from `product` every time this component renders — and
  // because `Modal` fully unmounts `ProductForm` when closed (no
  // "always mounted, just hidden" trick here, unlike `MobileMenuPanel`
  // which needed that for its slide animation), opening the edit modal
  // on a DIFFERENT product later is guaranteed to start from THAT
  // product's values, never a leftover edit from the previous one.
  const initialValues: ProductFormValues | undefined = product
    ? {
        name: product.name,
        category: product.category,
        price: String(product.price),
        quantity: String(product.quantity),
        imageUrl: product.imageUrl ?? '',
        isAvailable: product.isAvailable,
        isPromoted: product.isPromoted,
      }
    : undefined;

  return (
    <Modal isOpen={product !== null} onClose={onClose} title="Modifier le produit">
      {product && (
        <ProductForm
          initialValues={initialValues}
          submitLabel="Enregistrer les modifications"
          submittingLabel="Enregistrement..."
          onSubmit={handleSubmit}
          onCancel={onClose}
        />
      )}
    </Modal>
  );
}