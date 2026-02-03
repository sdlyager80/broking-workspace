import { useState } from 'react';
import { DxcFlex, DxcTypography, DxcHeading, DxcButton, DxcTabs, DxcTextarea } from '@dxc-technology/halstack-react';
import { getSlaStatusColor, formatDateTime } from '../../data/mockData';
import './CaseView.css';

function CaseView({ caseData, onClose }) {
  const [activeTab, setActiveTab] = useState(0);
  const [userNote, setUserNote] = useState('');
  const [workNotesText, setWorkNotesText] = useState(caseData.workNotes || '');

  const c = caseData;

  const getDocStatusColor = (status) => {
    switch (status) {
      case 'processed': return '#24A148';
      case 'processing': return '#0095FF';
      case 'uploaded': return '#FF6B00';
      case 'failed': return '#D0021B';
      default: return '#999';
    }
  };

  const getIntegrationStatusColor = (status) => {
    switch (status) {
      case 'Complete':
      case 'Sent': return '#24A148';
      case 'Partial': return '#FF6B00';
      case 'Failed': return '#D0021B';
      case 'Not Started': return '#999';
      default: return '#999';
    }
  };

  // ─── Tab 1: Overview (Interaction Record layout) ───
  const renderOverview = () => (
    <div className="tab-content">
      {/* Ingestion status banner */}
      <div className={`ingestion-banner ${c.ingestionStatus === 'Completed' ? 'ingestion-success' : 'ingestion-pending'}`}>
        <DxcTypography fontWeight="font-weight-bold" color="#ffffff">
          SUBMISSION INTAKE {c.ingestionStatus === 'Completed' ? '\u2013 SUCCESSFULLY INGESTED' : '\u2013 INGESTION IN PROGRESS'}
        </DxcTypography>
        <DxcFlex gap="var(--spacing-gap-s)">
          <DxcButton label="View Full Record" mode="secondary" onClick={() => {}} />
          <DxcButton label="View Case" mode="secondary" onClick={() => {}} />
        </DxcFlex>
      </div>

      <div className="interaction-layout">
        {/* Left sidebar - Interaction Record fields */}
        <div className="interaction-sidebar">
          <SidebarField label="Interaction Record ID" value={c.interactionRecordId} />
          <SidebarField label="Record Status" value={c.recordStatus} hasIcon />
          <SidebarField label="Contact ID" value={c.contactId} isLink />
          <SidebarField label="Broker" value={c.broker} hasIcon />
          <SidebarField label="Stage" value={c.stage} hasIcon />
          <div className="sidebar-field">
            <span className="sidebar-label">Documents Ingested</span>
            <DxcFlex gap="var(--spacing-gap-s)" alignItems="center">
              <span className="sidebar-value">{c.documentsIngested.ingested ? 'Yes' : 'No'}</span>
              <span className="sidebar-value">{c.documentsIngested.count}</span>
            </DxcFlex>
          </div>
          <SidebarField label="Status" value={c.ingestionStatus} hasIcon />
          <SidebarField label="Channel" value={c.channel} hasIcon />
        </div>

        {/* Main content area */}
        <div className="interaction-main">
          {/* Short Description (= email subject) */}
          <div className="interaction-section">
            <span className="section-label">Short Description</span>
            <div className="section-box">
              <DxcTypography fontStyle="italic" color="var(--color-fg-neutral-stronger)">
                {c.shortDescription}
              </DxcTypography>
            </div>
          </div>

          {/* Email Body (the ingested email content) */}
          <div className="interaction-section">
            <span className="section-label">Email Body</span>
            <div className="section-box email-body-box">
              <pre className="email-body-text">{c.emailBody}</pre>
            </div>
          </div>

          {/* Work Notes (editable area for user notes) */}
          <div className="interaction-section">
            <span className="section-label">Work Notes</span>
            <div className="section-box section-box-tall">
              <textarea
                className="worknotes-textarea"
                value={workNotesText}
                onChange={(e) => setWorkNotesText(e.target.value)}
                placeholder="Add work notes here..."
                rows={4}
              />
            </div>
          </div>

          {/* Submission Intake Documents */}
          <div className="interaction-section">
            <span className="section-label">Submission Intake Documents</span>
            <div className="section-box">
              <DxcTypography fontSize="font-scale-01" fontStyle="italic" color="var(--color-fg-neutral-stronger)">
                These are the files which have been ingested from the email, including a copy of the email
              </DxcTypography>
              <div className="documents-strip">
                {c.documents.map((doc, i) => (
                  <div key={i} className="doc-icon-card" title={doc.name}>
                    <span className="material-icons" style={{ fontSize: '32px', color: doc.isEmail ? '#0095FF' : '#555' }}>
                      {doc.isEmail ? 'email' : 'description'}
                    </span>
                    <span className="doc-icon-label">{doc.name.length > 18 ? doc.name.substring(0, 18) + '...' : doc.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Add Notes to record */}
          <div className="interaction-section">
            <DxcFlex justifyContent="space-between" alignItems="center">
              <span className="section-label">Add Notes to record</span>
              <DxcButton label="UPDATE RECORD" mode="primary" onClick={() => {}} />
            </DxcFlex>
            <div className="notes-list">
              {c.notes.map((note, i) => (
                <div key={i} className="note-entry">
                  <DxcTypography fontSize="font-scale-01">
                    <strong>{note.source} WROTE:</strong> {note.text || ''}
                  </DxcTypography>
                </div>
              ))}
              <div className="note-entry note-entry-input">
                <DxcTypography fontSize="font-scale-01"><strong>USER_WROTE:</strong></DxcTypography>
                <textarea
                  className="note-textarea"
                  value={userNote}
                  onChange={(e) => setUserNote(e.target.value)}
                  placeholder="Add a note..."
                  rows={2}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right sidebar - MEA Classification */}
        <div className="mea-sidebar">
          <DxcTypography fontSize="font-scale-01" color="#0095FF" fontWeight="font-weight-semibold">
            MEA will return
          </DxcTypography>
          <div className="mea-field">
            <DxcTypography fontSize="font-scale-01" color="var(--color-fg-neutral-stronger)">What &ldquo;thing it is&rdquo;</DxcTypography>
            <DxcTypography fontWeight="font-weight-semibold">
              {c.meaClassification.documentType || '\u2014'}
            </DxcTypography>
          </div>
          <div className="mea-field">
            <DxcTypography fontSize="font-scale-01" color="var(--color-fg-neutral-stronger)">Confidence Score</DxcTypography>
            <DxcTypography fontWeight="font-weight-semibold">
              {c.meaClassification.confidenceScore ? `${c.meaClassification.confidenceScore}%` : '\u2014'}
            </DxcTypography>
          </div>
          <div className="mea-field">
            <DxcTypography fontSize="font-scale-01" color="var(--color-fg-neutral-stronger)">&ldquo;number of attachments&rdquo;</DxcTypography>
            <DxcTypography fontWeight="font-weight-semibold">
              {c.meaClassification.attachmentCount}
            </DxcTypography>
          </div>
          <div className="mea-field">
            <DxcTypography fontSize="font-scale-01" color="var(--color-fg-neutral-stronger)">&ldquo;set of messages&rdquo;</DxcTypography>
            {c.meaClassification.messages.map((msg, i) => (
              <DxcTypography key={i} fontSize="font-scale-01">{msg}</DxcTypography>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // ─── Tab 2: Documents ───
  const renderDocuments = () => (
    <div className="tab-content">
      <DxcFlex direction="column" gap="var(--spacing-gap-s)">
        <DxcTypography fontSize="font-scale-01" color="var(--color-fg-neutral-stronger)">
          DMS Library: {c.dmsLibraryAddress}
        </DxcTypography>
        <table className="data-table">
          <thead>
            <tr>
              <th>Document name</th>
              <th>Document type</th>
              <th>Status</th>
              <th>MEA doc ref</th>
              <th>Extraction status</th>
              <th>DMS doc ref</th>
              <th>DMS link</th>
            </tr>
          </thead>
          <tbody>
            {c.documents.map((doc, i) => (
              <tr key={i}>
                <td>
                  <DxcFlex gap="var(--spacing-gap-xs)" alignItems="center">
                    <span className="material-icons" style={{ fontSize: '16px', color: doc.isEmail ? '#0095FF' : '#555' }}>
                      {doc.isEmail ? 'email' : 'description'}
                    </span>
                    {doc.name}
                  </DxcFlex>
                </td>
                <td>{doc.type || '\u2014'}</td>
                <td>
                  <span className="status-pill" style={{ backgroundColor: getDocStatusColor(doc.status) }}>
                    {doc.status}
                  </span>
                </td>
                <td>{doc.meaDocRef || '\u2014'}</td>
                <td>{doc.meaExtractionStatus || '\u2014'}</td>
                <td>{doc.dmsDocRef || '\u2014'}</td>
                <td>
                  {doc.dmsLink ? (
                    <a href={doc.dmsLink} className="link" target="_blank" rel="noopener noreferrer">Open</a>
                  ) : '\u2014'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </DxcFlex>
    </div>
  );

  // ─── Tab 3: Timeline ───
  const renderTimeline = () => (
    <div className="tab-content">
      <table className="data-table">
        <thead>
          <tr>
            <th>Event type</th>
            <th>Description</th>
            <th>Source</th>
            <th>Date / Time</th>
            <th>Generated by</th>
          </tr>
        </thead>
        <tbody>
          {[...c.timeline].reverse().map((evt, i) => (
            <tr key={i}>
              <td>
                <DxcFlex gap="var(--spacing-gap-xs)" alignItems="center">
                  <span className="material-icons" style={{ fontSize: '16px', color: '#0095FF' }}>
                    {evt.eventType.includes('Created') ? 'add_circle' :
                     evt.eventType.includes('Assigned') ? 'person' :
                     evt.eventType.includes('Classification') ? 'label' :
                     evt.eventType.includes('Queue') ? 'swap_horiz' :
                     evt.eventType.includes('DMS') ? 'cloud_upload' :
                     evt.eventType.includes('SLA') ? 'timer' :
                     evt.eventType.includes('Document') ? 'attach_file' :
                     evt.eventType.includes('AO') ? 'send' : 'event'}
                  </span>
                  {evt.eventType}
                </DxcFlex>
              </td>
              <td>{evt.description}</td>
              <td>
                <span className={`source-badge source-${evt.source.toLowerCase()}`}>
                  {evt.source}
                </span>
              </td>
              <td>{formatDateTime(evt.dateTime)}</td>
              <td>{evt.generatedBy}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // ─── Tab 4: Classification ───
  const renderClassification = () => (
    <div className="tab-content">
      <div className="info-card">
        <div className="info-grid">
          <InfoField label="Classification status" value={c.classification.status} />
          <InfoField label="Transaction type (ABE Name)" value={c.classification.transactionType || '\u2014'} />
        </div>
        <div className="info-grid">
          <InfoField label="Classification timestamp" value={formatDateTime(c.classification.timestamp)} />
          <InfoField label="Classified by" value={c.classification.classifiedBy || '\u2014'} />
        </div>
        <div className="info-grid">
          <InfoField label="Notes / rationale" value={c.classification.notes || '\u2014'} wide />
        </div>
      </div>
    </div>
  );

  // ─── Tab 5: Integrations ───
  const renderIntegrations = () => (
    <div className="tab-content">
      <DxcFlex direction="column" gap="var(--spacing-gap-m)">
        <div className="info-card">
          <DxcTypography fontWeight="font-weight-semibold" style={{ marginBottom: '12px' }}>AO Integration</DxcTypography>
          <div className="info-grid">
            <InfoField label="AO send status">
              <span className="status-pill" style={{ backgroundColor: getIntegrationStatusColor(c.integrations.aoSendStatus) }}>
                {c.integrations.aoSendStatus}
              </span>
            </InfoField>
            <InfoField label="AO last attempt date/time" value={formatDateTime(c.integrations.aoLastAttempt)} />
            <InfoField label="AO correlation ID" value={c.integrations.aoCorrelationId || '\u2014'} />
          </div>
        </div>
        <div className="info-card">
          <DxcTypography fontWeight="font-weight-semibold" style={{ marginBottom: '12px' }}>DMS Integration</DxcTypography>
          <div className="info-grid">
            <InfoField label="DMS send status">
              <span className="status-pill" style={{ backgroundColor: getIntegrationStatusColor(c.integrations.dmsSendStatus) }}>
                {c.integrations.dmsSendStatus}
              </span>
            </InfoField>
            <InfoField label="DMS last attempt date/time" value={formatDateTime(c.integrations.dmsLastAttempt)} />
          </div>
          {c.integrations.lastError && (
            <div className="error-summary">
              <span className="material-icons" style={{ fontSize: '16px', color: '#D0021B' }}>error_outline</span>
              <DxcTypography fontSize="font-scale-01">{c.integrations.lastError}</DxcTypography>
            </div>
          )}
        </div>
      </DxcFlex>
    </div>
  );

  // ─── Tab 6: Admin ───
  const renderAdmin = () => (
    <div className="tab-content">
      <div className="info-card">
        <div className="info-grid">
          <InfoField label="Created by" value={c.admin.createdBy} />
          <InfoField label="Created date/time" value={formatDateTime(c.admin.createdDate)} />
        </div>
        <div className="info-grid">
          <InfoField label="Last updated date/time" value={formatDateTime(c.admin.lastUpdated)} />
          <InfoField label="Broker ID" value={c.brokerId} />
        </div>
        <div className="info-grid">
          <InfoField label="Internal Case ID" value={c.admin.internalIds.caseId} />
          <InfoField label="Workflow ID" value={c.admin.internalIds.workflowId} />
        </div>
        {c.admin.featureFlags.length > 0 && (
          <div className="info-grid">
            <InfoField label="Feature flags" value={c.admin.featureFlags.join(', ')} />
          </div>
        )}
        <div className="info-grid">
          <InfoField label="Environment">
            <span className="env-badge">{c.admin.environment}</span>
          </InfoField>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { label: "Overview" },
    { label: "Documents" },
    { label: "Timeline" },
    { label: "Classification" },
    { label: "Integrations" },
    { label: "Admin" },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 0: return renderOverview();
      case 1: return renderDocuments();
      case 2: return renderTimeline();
      case 3: return renderClassification();
      case 4: return renderIntegrations();
      case 5: return renderAdmin();
      default: return renderOverview();
    }
  };

  // Progress bar
  const progressStages = ['Ingestion', 'Classification', 'Validation', 'Fulfilment', 'Processing', 'Complete'];
  const currentStageIdx = progressStages.indexOf(c.processingStage);
  const progressPct = currentStageIdx >= 0 ? ((currentStageIdx + 1) / progressStages.length) * 100 : 10;

  return (
    <div className="case-view">
      {/* Header Strip */}
      <div className="case-header">
        <DxcFlex justifyContent="space-between" alignItems="center">
          <DxcFlex gap="var(--spacing-gap-m)" alignItems="center">
            <DxcHeading level={4} text={c.id} />
            <span className="sla-badge-lg" style={{ backgroundColor: getSlaStatusColor(c.slaStatus) }}>
              {c.slaStatus}
            </span>
          </DxcFlex>
          <DxcFlex gap="var(--spacing-gap-s)">
            <DxcButton label="Assign" mode="secondary" onClick={() => {}} />
            <DxcButton label="Hold" mode="secondary" onClick={() => {}} />
            <DxcButton label="Move to next stage" mode="primary" onClick={() => {}} />
          </DxcFlex>
        </DxcFlex>

        <DxcTypography fontSize="font-scale-01" color="var(--color-fg-neutral-stronger)">
          Broker: {c.broker} &middot; Queue: {c.queue} &middot; Assignee: {c.assignee || 'Unassigned'}
        </DxcTypography>
      </div>

      {/* Progress Strip */}
      <div className="progress-strip">
        <DxcTypography fontWeight="font-weight-semibold" fontSize="font-scale-02">Case Progress</DxcTypography>
        <div className="progress-bar-container">
          <div className="progress-bar" style={{ width: `${progressPct}%` }} />
        </div>

        <div className="progress-fields">
          <div className="progress-field">
            <DxcTypography fontSize="font-scale-01" color="var(--color-fg-neutral-stronger)">Classification status</DxcTypography>
            <DxcTypography fontWeight="font-weight-semibold">{c.classificationStatus}</DxcTypography>
          </div>
          <div className="progress-field">
            <DxcTypography fontSize="font-scale-01" color="var(--color-fg-neutral-stronger)">Transaction type (ABE Name)</DxcTypography>
            <DxcTypography fontWeight="font-weight-semibold">{c.transactionType || '\u2014'}</DxcTypography>
          </div>
          <div className="progress-field">
            <DxcTypography fontSize="font-scale-01" color="var(--color-fg-neutral-stronger)">SLA / Age</DxcTypography>
            <DxcTypography fontWeight="font-weight-semibold">{c.slaRemaining}</DxcTypography>
          </div>
          <div className="progress-field">
            <DxcTypography fontSize="font-scale-01" color="var(--color-fg-neutral-stronger)">Received</DxcTypography>
            <DxcTypography fontWeight="font-weight-semibold">{formatDateTime(c.receivedDate)}</DxcTypography>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="case-tabs">
        <DxcTabs
          activeTabIndex={activeTab}
          onTabClick={(i) => setActiveTab(i)}
          tabs={tabs}
        />
      </div>

      {/* Tab Content */}
      {renderTabContent()}
    </div>
  );
}

// Reusable sidebar field
function SidebarField({ label, value, hasIcon, isLink }) {
  return (
    <div className="sidebar-field">
      <span className="sidebar-label">{label}</span>
      <DxcFlex gap="var(--spacing-gap-xs)" alignItems="center">
        {isLink ? (
          <a href={`mailto:${value}`} className="sidebar-link">{value}</a>
        ) : (
          <span className="sidebar-value">{value}</span>
        )}
        {hasIcon && (
          <span className="material-icons" style={{ fontSize: '14px', color: '#999', cursor: 'pointer' }}>lock</span>
        )}
      </DxcFlex>
    </div>
  );
}

// Reusable info field
function InfoField({ label, value, isLink, wide, children }) {
  return (
    <div className={`info-field ${wide ? 'info-field-wide' : ''}`}>
      <DxcTypography fontSize="font-scale-01" color="var(--color-fg-neutral-stronger)">{label}</DxcTypography>
      {children ? children : (
        isLink && value && value !== '\u2014' ? (
          <a href={value} className="link" target="_blank" rel="noopener noreferrer">
            Open MEA case
          </a>
        ) : (
          <DxcTypography fontWeight="font-weight-semibold">{value || '\u2014'}</DxcTypography>
        )
      )}
    </div>
  );
}

export default CaseView;
