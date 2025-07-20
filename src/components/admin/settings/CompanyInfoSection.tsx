import React from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

interface CompanyInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
  taxId: string;
}

interface CompanyInfoSectionProps {
  companyInfo: CompanyInfo | null;
  companyLoading: boolean;
  companyError: string | null;
  companyEdit: boolean;
  setCompanyEdit: (v: boolean) => void;
  companyCreate: boolean;
  setCompanyCreate: (v: boolean) => void;
  companyForm: CompanyInfo;
  setCompanyForm: (v: CompanyInfo) => void;
  companyFormLoading: boolean;
  handleCompanyFormChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCompanyFormSubmit: (e: React.FormEvent) => void;
  currentTheme: any;
}

const CompanyInfoSection: React.FC<CompanyInfoSectionProps> = ({
  companyInfo,
  companyLoading,
  companyError,
  companyEdit,
  setCompanyEdit,
  companyCreate,
  setCompanyCreate,
  companyForm,
  setCompanyForm,
  companyFormLoading,
  handleCompanyFormChange,
  handleCompanyFormSubmit,
  currentTheme,
}) => {
  return (
    <div
      className="mt-8 overflow-x-auto rounded-lg border p-6 mb-8"
      style={{
        borderColor: currentTheme.border.primary,
        background: currentTheme.background.card,
      }}
    >
      <h2 className="text-xl font-semibold mb-4" style={{ color: currentTheme.text.primary }}>Informations sur l&apos;entreprise</h2>
      {companyLoading ? (
        <div style={{ color: currentTheme.text.secondary }}>Chargement...</div>
      ) : companyError ? (
        <div style={{ color: currentTheme.status.error }} className="mb-2">{companyError}</div>
      ) : !companyInfo ? null : !companyEdit ? (
        <div className="mb-4 space-y-2">
          <div style={{ color: currentTheme.text.primary }}><b>Nom:</b> <span style={{ color: currentTheme.text.secondary }}>{companyInfo.name}</span></div>
          <div style={{ color: currentTheme.text.primary }}><b>Adresse:</b> <span style={{ color: currentTheme.text.secondary }}>{companyInfo.address}</span></div>
          <div style={{ color: currentTheme.text.primary }}><b>Téléphone:</b> <span style={{ color: currentTheme.text.secondary }}>{companyInfo.phone}</span></div>
          <div style={{ color: currentTheme.text.primary }}><b>Email:</b> <span style={{ color: currentTheme.text.secondary }}>{companyInfo.email}</span></div>
          <div style={{ color: currentTheme.text.primary }}><b>Identifiant fiscal:</b> <span style={{ color: currentTheme.text.secondary }}>{companyInfo.taxId}</span></div>
          <Button variant="primary" onClick={() => { setCompanyEdit(true); setCompanyForm(companyInfo); }} className="mt-2">Modifier</Button>
        </div>
      ) : null}
      {/* Modal for create/edit */}
      {(companyEdit || companyCreate) && (
        <Modal isOpen={companyEdit || companyCreate} onClose={() => { setCompanyEdit(false); setCompanyCreate(false); }} title={companyCreate ? "Créer les infos de l&apos;entreprise" : "Modifier les infos de l&apos;entreprise"}>
          <form onSubmit={handleCompanyFormSubmit} className="space-y-4">
            <div>
              <label className="block font-medium mb-1" style={{ color: currentTheme.text.primary }}>Nom</label>
              <input type="text" name="name" value={companyForm.name} onChange={handleCompanyFormChange} className="w-full border rounded px-3 py-2" required />
            </div>
            <div>
              <label className="block font-medium mb-1" style={{ color: currentTheme.text.primary }}>Adresse</label>
              <input type="text" name="address" value={companyForm.address} onChange={handleCompanyFormChange} className="w-full border rounded px-3 py-2" required />
            </div>
            <div>
              <label className="block font-medium mb-1" style={{ color: currentTheme.text.primary }}>Téléphone</label>
              <input type="text" name="phone" value={companyForm.phone} onChange={handleCompanyFormChange} className="w-full border rounded px-3 py-2" required />
            </div>
            <div>
              <label className="block font-medium mb-1" style={{ color: currentTheme.text.primary }}>Email</label>
              <input type="email" name="email" value={companyForm.email} onChange={handleCompanyFormChange} className="w-full border rounded px-3 py-2" required />
            </div>
            <div>
              <label className="block font-medium mb-1" style={{ color: currentTheme.text.primary }}>Identifiant fiscal</label>
              <input type="text" name="taxId" value={companyForm.taxId} onChange={handleCompanyFormChange} className="w-full border rounded px-3 py-2" required />
            </div>
            <div className="flex gap-2 mt-2">
              <Button variant="primary" type="submit">{companyFormLoading ? 'Enregistrement…' : 'Enregistrer'}</Button>
              <Button variant="secondary" type="button" onClick={() => { setCompanyEdit(false); setCompanyCreate(false); setCompanyForm(companyInfo || { name: '', address: '', phone: '', email: '', taxId: '' }); }}>Annuler</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default CompanyInfoSection; 