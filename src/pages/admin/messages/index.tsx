import AdminLayout from "@/components/admin/layout/AdminLayout";
import SectionHeader from "@/components/ui/SectionHeader";
import React from "react";
import { useDarkMode } from "@/contexts/DarkModeContext";
import Button from "@/components/ui/Button";
import Table, { TableColumn } from "@/components/ui/Table";
import { useRouter } from "next/router";
import AdminTableContainer from "@/components/admin/tables/AdminTableContainer";

interface Message {
  id: string;
  sender: string;
  recipient: string;
  subject: string;
  date: string;
}

const columns: TableColumn<Message>[] = [
  { header: "Expéditeur", accessor: "sender" },
  { header: "Destinataire", accessor: "recipient" },
  { header: "Sujet", accessor: "subject" },
  { header: "Date", accessor: "date" },
  // Actions column can be added later with a custom render
];

export default function MessagesPage() {
  const { currentTheme } = useDarkMode();
  const router = useRouter();

  // Placeholder data
  const messages: Message[] = [];

  return (
    <AdminLayout>
      <SectionHeader
        title="Messages"
        subtitle="Gérer les messages du système."
      />
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-end mb-4">
          <Button onClick={() => router.push("/admin/messages/add")}>
            Ajouter un message
          </Button>
        </div>
        <div
          className="rounded-xl p-6"
          style={{
            background: currentTheme.background.card,
            border: `1px solid ${currentTheme.border.primary}`,
          }}>
          <AdminTableContainer borderColor={currentTheme.border.primary}>
            <Table columns={columns} data={messages} />
          </AdminTableContainer>
        </div>
      </div>
    </AdminLayout>
  );
}
