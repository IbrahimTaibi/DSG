import React from "react";
import Input from "@/components/ui/Input";
import { useDarkMode } from "@/contexts/DarkModeContext";

export interface DeliveryAgent {
  id: string;
  name: string;
  email?: string;
}

interface DeliveryAgentSelectorProps {
  agents: DeliveryAgent[];
  selectedAgentId: string;
  onSelect: (id: string) => void;
  loading: boolean;
}

const DeliveryAgentSelector: React.FC<DeliveryAgentSelectorProps> = ({ agents, selectedAgentId, onSelect, loading }) => {
  const { currentTheme } = useDarkMode();
  const [search, setSearch] = React.useState("");

  // Debug logs for troubleshooting
  console.log('selectedAgentId', selectedAgentId);
  console.log('agents', agents);

  const filteredAgents = agents.filter(agent => {
    const searchTerm = search.trim().toLowerCase();
    if (!searchTerm) return true;
    const name = agent.name?.toLowerCase() || "";
    const email = agent.email?.toLowerCase() || "";
    return name.includes(searchTerm) || email.includes(searchTerm);
  });

  return (
    <>
      <Input
        placeholder="Rechercher un livreur par nom ou email..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ marginBottom: 16 }}
      />
      <div style={{ maxHeight: 300, overflowY: 'auto' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 24 }}>Chargement...</div>
        ) : filteredAgents.length === 0 ? (
          <div style={{ color: currentTheme.text.muted, textAlign: 'center', padding: 24 }}>Aucun livreur trouvé.</div>
        ) : (
          filteredAgents.map(agent => (
            <div
              key={agent.id || agent.email}
              onClick={() => {
                console.log('Clicked agent', agent);
                onSelect(agent.id);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '10px 12px',
                marginBottom: 8,
                borderRadius: 8,
                cursor: 'pointer',
                background: selectedAgentId === agent.id ? currentTheme.status.info + '15' : currentTheme.background.secondary,
                border: selectedAgentId === agent.id ? `1.5px solid ${currentTheme.status.info}` : `1px solid ${currentTheme.border.primary}`,
                color: currentTheme.text.primary,
                fontWeight: selectedAgentId === agent.id ? 600 : 400,
                transition: 'all 0.15s',
              }}
            >
              <input
                type="radio"
                name="deliveryAgent"
                checked={selectedAgentId === agent.id}
                onChange={e => {
                  e.stopPropagation();
                  console.log('Radio change agent', agent);
                  onSelect(agent.id);
                }}
                onClick={e => e.stopPropagation()}
                style={{ marginRight: 10 }}
              />
              <span style={{ fontWeight: 500 }}>{agent.name}</span>
              <span style={{ marginLeft: 8, color: currentTheme.text.secondary, fontSize: 12 }}>{agent.email}</span>
              {selectedAgentId === agent.id && (
                <span style={{ marginLeft: 'auto', color: currentTheme.status.info, fontWeight: 700 }}>
                  ✓
                </span>
              )}
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default DeliveryAgentSelector; 