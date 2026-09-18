import { Modal } from '../../../../shared/ui/components/Modal';
import { createProduct, type NewProductInput } from '../../api/products.api';
import type { Product } from '../../types/product.types';
import { ProductForm } from '../ProductForm';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductCreated: (product: Product) => void;
}

export function AddProductModal({ isOpen, onClose, onProductCreated }: AddProductModalProps) {
  async function handleSubmit(input: NewProductInput) {
    const created = await createProduct(input);
    onProductCreated(created);
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Ajouter un produit">
      <ProductForm
        submitLabel="Créer le produit"
        submittingLabel="Création..."
        onSubmit={handleSubmit}
        onCancel={onClose}
      />
    </Modal>
  );
}