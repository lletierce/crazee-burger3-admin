import { Modal } from '../../../../shared/ui/components/Modal';
import type { Product } from '../../types/product.types';
import { AddProductForm } from './AddProductForm';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductCreated: (product: Product) => void;
}

export function AddProductModal({ isOpen, onClose, onProductCreated }: AddProductModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Ajouter un produit">
      <AddProductForm
        onCancel={onClose}
        onSuccess={(product) => {
          onProductCreated(product);
          onClose();
        }}
      />
    </Modal>
  );
}