import { Modal } from '../../../../shared/ui/components/Modal';
import { AddProductForm } from './AddProductForm';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductCreated: () => void;
}

export function AddProductModal({ isOpen, onClose, onProductCreated }: AddProductModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Ajouter un produit">
      <AddProductForm
        onCancel={onClose}
        onSuccess={() => {
          onProductCreated();
          onClose();
        }}
      />
    </Modal>
  );
}