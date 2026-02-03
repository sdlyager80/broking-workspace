import { useState, useMemo } from 'react';
import { DxcFlex, DxcTypography, DxcSelect, DxcHeading } from '@dxc-technology/halstack-react';
import { mockCases, brokers, transactionTypes, queues, users, getSlaStatusColor, formatDateTime } from '../../data/mockData';
import './Queue.css';

function Queue({ onCaseSelect, selectedCaseId, user }) {
  const [filterQueue, setFilterQueue] = useState('All');
  const [filterAssignee, setFilterAssignee] = useState('Any');
  const [filterBroker, setFilterBroker] = useState('Any');
  const [filterTxType, setFilterTxType] = useState('Any');

  const queueOptions = [
    { label: "All queues", value: "All" },
    ...queues.map(q => ({ label: q, value: q })),
  ];

  const assigneeOptions = [
    { label: "Any / All", value: "Any" },
    { label: "Me", value: "Me" },
    { label: "Unassigned", value: "Unassigned" },
    ...users.map(u => ({ label: u.name, value: u.name })),
  ];

  const brokerOptions = [
    { label: "Any", value: "Any" },
    ...brokers.map(b => ({ label: b, value: b })),
  ];

  const txTypeOptions = [
    { label: "Any", value: "Any" },
    ...transactionTypes.map(t => ({ label: t, value: t })),
  ];

  const filteredCases = useMemo(() => {
    return mockCases.filter(c => {
      if (filterQueue !== 'All' && c.queue !== filterQueue) return false;
      if (filterAssignee === 'Me' && c.assignee !== user.name) return false;
      if (filterAssignee === 'Unassigned' && c.assignee !== null) return false;
      if (filterAssignee !== 'Any' && filterAssignee !== 'Me' && filterAssignee !== 'Unassigned' && c.assignee !== filterAssignee) return false;
      if (filterBroker !== 'Any' && c.broker !== filterBroker) return false;
      if (filterTxType !== 'Any' && c.transactionType !== filterTxType) return false;
      return true;
    });
  }, [filterQueue, filterAssignee, filterBroker, filterTxType, user.name]);

  return (
    <div className="queue-container">
      <div className="queue-header">
        <DxcFlex direction="column" gap="var(--spacing-gap-xs)">
          <DxcTypography fontSize="font-scale-01" color="var(--color-fg-neutral-stronger)">
            Submission Intake &middot; Queue Workspace
          </DxcTypography>
          <DxcHeading level={3} text="Queue" />
          <DxcTypography fontSize="font-scale-01" color="var(--color-fg-neutral-stronger)">
            Filter and pick a case. This is a clickable mock.
          </DxcTypography>
        </DxcFlex>
      </div>

      {/* Filters */}
      <div className="queue-filters">
        <DxcFlex gap="var(--spacing-gap-m)" wrap="wrap">
          <div className="filter-field">
            <DxcTypography fontSize="font-scale-01" fontWeight="font-weight-semibold">Queue</DxcTypography>
            <DxcSelect
              options={queueOptions}
              value={filterQueue}
              onBlur={({ value }) => setFilterQueue(value)}
              size="fillParent"
              placeholder="All queues"
            />
          </div>
          <div className="filter-field">
            <DxcTypography fontSize="font-scale-01" fontWeight="font-weight-semibold">Assignee</DxcTypography>
            <DxcSelect
              options={assigneeOptions}
              value={filterAssignee}
              onBlur={({ value }) => setFilterAssignee(value)}
              size="fillParent"
              placeholder="Any / All"
            />
          </div>
          <div className="filter-field">
            <DxcTypography fontSize="font-scale-01" fontWeight="font-weight-semibold">Broker</DxcTypography>
            <DxcSelect
              options={brokerOptions}
              value={filterBroker}
              onBlur={({ value }) => setFilterBroker(value)}
              size="fillParent"
              placeholder="Any"
              searchable
            />
          </div>
          <div className="filter-field">
            <DxcTypography fontSize="font-scale-01" fontWeight="font-weight-semibold">Transaction Type (ABE Name)</DxcTypography>
            <DxcSelect
              options={txTypeOptions}
              value={filterTxType}
              onBlur={({ value }) => setFilterTxType(value)}
              size="fillParent"
              placeholder="Any"
              searchable
            />
          </div>
        </DxcFlex>
      </div>

      {/* Case list */}
      <div className="queue-list">
        {filteredCases.length === 0 && (
          <div className="queue-empty">
            <span className="material-icons" style={{ fontSize: '40px', color: '#ccc' }}>inbox</span>
            <DxcTypography color="var(--color-fg-neutral-stronger)">No cases match the current filters.</DxcTypography>
          </div>
        )}

        {filteredCases.map(c => (
          <div
            key={c.id}
            className={`queue-card ${selectedCaseId === c.id ? 'queue-card-selected' : ''}`}
            onClick={() => onCaseSelect(c)}
          >
            <DxcFlex justifyContent="space-between" alignItems="flex-start">
              <DxcFlex gap="var(--spacing-gap-s)" alignItems="center">
                <div className="sla-dot" style={{ backgroundColor: getSlaStatusColor(c.slaStatus) }} />
                <DxcTypography fontWeight="font-weight-semibold">{c.id}</DxcTypography>
                <span className="sla-badge" style={{ backgroundColor: getSlaStatusColor(c.slaStatus) }}>
                  {c.slaStatus}
                </span>
              </DxcFlex>
              <DxcFlex direction="column" alignItems="flex-end" gap="var(--spacing-gap-none)">
                <DxcTypography fontSize="font-scale-01" color="var(--color-fg-neutral-stronger)">SLA / Age</DxcTypography>
                <DxcTypography fontSize="font-scale-02" fontWeight="font-weight-semibold">
                  {c.slaRemaining}
                </DxcTypography>
              </DxcFlex>
            </DxcFlex>

            <DxcTypography fontSize="font-scale-01" color="var(--color-fg-neutral-stronger)">
              {c.broker}
            </DxcTypography>

            <DxcFlex gap="var(--spacing-gap-s)" wrap="wrap" style={{ marginTop: '4px' }}>
              <span className="tag tag-queue">{c.queue === "Submission Intake" ? "Submission Intake" : c.queue}</span>
              <span className="tag">Classification: {c.classificationStatus}</span>
              {c.transactionType && <span className="tag tag-tx">Tx: {c.transactionType}</span>}
              {!c.transactionType && <span className="tag">Tx: &mdash;</span>}
            </DxcFlex>

            <DxcFlex justifyContent="space-between" alignItems="center" style={{ marginTop: '4px' }}>
              <span className="tag tag-assignee">
                Assignee: {c.assignee || 'Unassigned'}
              </span>
              <DxcFlex gap="var(--spacing-gap-s)" alignItems="center">
                <span className="tag">Channel: {c.channel}</span>
                <DxcTypography fontSize="font-scale-01" color="var(--color-fg-neutral-stronger)">
                  Received: {formatDateTime(c.receivedDate)}
                </DxcTypography>
              </DxcFlex>
            </DxcFlex>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Queue;
