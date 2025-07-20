import AdminLayout from "@/components/admin/layout/AdminLayout";
import SectionHeader from "@/components/ui/SectionHeader";
import React, { useEffect, useState } from "react";
import { useDarkMode } from "@/contexts/DarkModeContext";
import TaxTable from '@/components/admin/tables/TaxTable';
import TaxForm from '@/components/admin/forms/TaxForm';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { fetchTaxes, createTax, updateTax, deleteTax, Tax } from '@/services/taxService';
import ConfirmDeleteModal from '@/components/admin/modals/ConfirmDeleteModal';
import { API_CONFIG } from '@/config/api';
import CompanyInfoSection from '@/components/admin/settings/CompanyInfoSection';

interface CompanyInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
  taxId: string;
}

async function fetchCompanyInfo(): Promise<CompanyInfo> {
  const res = await fetch(`${API_CONFIG.BASE_URL}/api/company`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to fetch company info');
  return res.json();
}

async function updateCompanyInfo(data: CompanyInfo): Promise<CompanyInfo> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_CONFIG.BASE_URL}/api/company`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(data),
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to update company info');
  return res.json();
}

export default function AdminSettings() {
  const { currentTheme } = useDarkMode();
  const [taxes, setTaxes] = useState<Tax[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingTax, setEditingTax] = useState<Tax | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [taxToDelete, setTaxToDelete] = useState<Tax | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [companyLoading, setCompanyLoading] = useState(false);
  const [companyError, setCompanyError] = useState<string | null>(null);
  const [companyEdit, setCompanyEdit] = useState(false);
  const [companyCreate, setCompanyCreate] = useState(false);
  const [companyForm, setCompanyForm] = useState<CompanyInfo>({
    name: '',
    address: '',
    phone: '',
    email: '',
    taxId: '',
  });
  const [companyFormLoading, setCompanyFormLoading] = useState(false);

  const loadTaxes = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchTaxes();
      setTaxes(data);
    } catch (err) {
      setError((err as Error).message || 'Failed to load taxes');
    } finally {
      setLoading(false);
    }
  };

  const loadCompanyInfo = async () => {
    setCompanyLoading(true);
    setCompanyError(null);
    try {
      const data = await fetchCompanyInfo();
      setCompanyInfo(data);
      setCompanyForm(data);
    } catch (err) {
      setCompanyError((err as Error).message || 'Failed to load company info');
    } finally {
      setCompanyLoading(false);
    }
  };

  useEffect(() => {
    loadTaxes();
    loadCompanyInfo();
  }, []);

  const handleCreate = () => {
    setEditingTax(null);
    setShowModal(true);
  };

  const handleEdit = (tax: Tax) => {
    setEditingTax(tax);
    setShowModal(true);
  };

  const handleDelete = (tax: Tax) => {
    setTaxToDelete(tax);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!taxToDelete) return;
    setDeleteLoading(true);
    setError(null);
    try {
      await deleteTax(taxToDelete.id);
      setDeleteModalOpen(false);
      setTaxToDelete(null);
      await loadTaxes();
    } catch (err) {
      setError((err as Error).message || 'Failed to delete tax');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleFormSubmit = async (data: Partial<Tax>) => {
    setFormLoading(true);
    setError(null);
    try {
      if (editingTax) {
        await updateTax(editingTax.id, data);
      } else {
        await createTax(data);
      }
      setShowModal(false);
      await loadTaxes();
    } catch (err) {
      setError((err as Error).message || 'Failed to save tax');
    } finally {
      setFormLoading(false);
    }
  };

  const handleCompanyFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCompanyForm({ ...companyForm, [e.target.name]: e.target.value });
  };

  const handleCompanyFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCompanyFormLoading(true);
    setCompanyError(null);
    try {
      if (companyCreate) {
        await updateCompanyInfo(companyForm);
      } else {
        const updated = await updateCompanyInfo(companyForm);
        setCompanyInfo(updated);
      }
      setCompanyEdit(false);
      setCompanyCreate(false);
      await loadCompanyInfo(); // Refresh company info after save
    } catch (err) {
      setCompanyError((err as Error).message || 'Failed to update company info');
    } finally {
      setCompanyFormLoading(false);
    }
  };

  return (
    <AdminLayout>
      <SectionHeader
        title="Paramètres administrateur"
        subtitle="Configuration et préférences du site."
      />
      {/* Company Info Section */}
      <CompanyInfoSection
        companyInfo={companyInfo}
        companyLoading={companyLoading}
        companyError={companyError}
        companyEdit={companyEdit}
        setCompanyEdit={setCompanyEdit}
        companyCreate={companyCreate}
        setCompanyCreate={setCompanyCreate}
        companyForm={companyForm}
        setCompanyForm={setCompanyForm}
        companyFormLoading={companyFormLoading}
        handleCompanyFormChange={handleCompanyFormChange}
        handleCompanyFormSubmit={handleCompanyFormSubmit}
        currentTheme={currentTheme}
      />
      {/* Taxes Section */}
      <div
        className="mt-8 overflow-x-auto rounded-lg border p-6"
        style={{
          borderColor: currentTheme.border.primary,
          background: currentTheme.background.card,
        }}>
        <h2 className="text-xl font-semibold mb-4" style={{ color: currentTheme.text.primary }}>Taxes</h2>
        <div className="mb-4 flex justify-between items-center">
          <span style={{ color: currentTheme.text.secondary }}>Manage VAT, sales tax, and other rates for your marketplace.</span>
          <Button variant="primary" onClick={handleCreate}>Add Tax</Button>
        </div>
        {error && <div className="mb-4 text-red-500">{error}</div>}
        <TaxTable taxes={taxes} onEdit={handleEdit} onDelete={handleDelete} loading={loading} />
      </div>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingTax ? 'Edit Tax' : 'Add Tax'}>
        <TaxForm
          initial={editingTax || undefined}
          onSubmit={handleFormSubmit}
          onCancel={() => setShowModal(false)}
          loading={formLoading}
        />
      </Modal>
      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => { setDeleteModalOpen(false); setTaxToDelete(null); }}
        onConfirm={handleConfirmDelete}
        loading={deleteLoading}
        userName={taxToDelete?.name}
        textColor={currentTheme.text.primary}
        borderColor={currentTheme.border.primary}
        errorColor={currentTheme.status.error}
        secondaryTextColor={currentTheme.text.secondary}
      />
    </AdminLayout>
  );
}
