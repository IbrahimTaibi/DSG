import React from "react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";

export default function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  loading,
  userName,
  textColor,
  borderColor,
  errorColor,
  secondaryTextColor,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
  userName?: string;
  textColor?: string;
  borderColor?: string;
  errorColor?: string;
  secondaryTextColor?: string;
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Confirmer la suppression"
      size="sm">
      <div className="space-y-4">
        <p style={{ color: textColor }}>
          Êtes-vous sûr de vouloir supprimer l&apos;utilisateur{" "}
          <strong>{userName}</strong> ? Cette action est irréversible.
        </p>
        <div className="flex justify-end gap-3">
          <Button
            onClick={onClose}
            className="px-4 py-2"
            style={{
              color: secondaryTextColor,
              background: "transparent",
              border: borderColor ? `1px solid ${borderColor}` : undefined,
            }}>
            Annuler
          </Button>
          <Button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2"
            style={{
              color: "#fff",
              background: errorColor,
            }}>
            {loading ? "Suppression..." : "Supprimer"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
