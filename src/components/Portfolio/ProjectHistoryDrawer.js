import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import Icon from '../ui/Icon';
import { useProject } from '../../context/ProjectContext';
import styles from './ProjectHistoryDrawer.module.css';

const ProjectHistoryDrawer = ({ isOpen, onClose }) => {
  const {
    savedProjects,
    saveCurrentProject,
    loadSavedProject,
    deleteSavedProject,
    duplicateSavedProject,
    projectData,
    formatMoney
  } = useProject();

  const [customName, setCustomName] = useState('');
  const [isSavingNew, setIsSavingNew] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    saveCurrentProject(customName);
    setCustomName('');
    setIsSavingNew(false);
  };

  const handleExportAllJSON = () => {
    const dataStr = JSON.stringify(savedProjects, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SitePilot_Portfolio_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const content = (
    <div className={styles.portalWrapper}>
      {/* Dark Dimming Backdrop */}
      <div className={styles.backdrop} onClick={onClose} aria-hidden="true" />

      {/* Slide-out Drawer */}
      <div className={styles.drawer} role="dialog" aria-modal="true" aria-label="Project Portfolio">
        <div className={styles.header}>
          <div className={styles.titleGroup}>
            <Icon name="spreadsheet" size={22} color="var(--primary)" />
            <div>
              <h2 className={styles.title}>Project Portfolio</h2>
              <p className={styles.subtitle}>{savedProjects.length} saved project estimates</p>
            </div>
          </div>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close drawer">
            ✕
          </button>
        </div>

        {/* Quick Save Current Project Section */}
        {projectData.buildingSize && parseFloat(projectData.buildingSize) > 0 && (
          <div className={styles.saveSection}>
            {isSavingNew ? (
              <form onSubmit={handleSave} className={styles.saveForm}>
                <input
                  type="text"
                  className={styles.saveInput}
                  placeholder="Enter project name (e.g. Lekki 4-Bed Duplex)"
                  value={customName}
                  onChange={e => setCustomName(e.target.value)}
                  autoFocus
                />
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <button type="button" className={styles.btnCancel} onClick={() => setIsSavingNew(false)}>
                    Cancel
                  </button>
                  <button type="submit" className={styles.btnSave}>
                    Save
                  </button>
                </div>
              </form>
            ) : (
              <button
                type="button"
                className={styles.btnSaveActive}
                onClick={() => setIsSavingNew(true)}
              >
                <Icon name="check" size={14} color="#fff" style={{ marginRight: '0.35rem' }} />
                Save Current Estimate to Portfolio
              </button>
            )}
          </div>
        )}

        {/* Projects List */}
        <div className={styles.projectList}>
          {savedProjects.length === 0 ? (
            <div className={styles.emptyState}>
              <Icon name="box" size={32} color="var(--text-secondary)" />
              <p className={styles.emptyTitle}>No saved estimates yet</p>
              <p className={styles.emptyDesc}>
                Complete an estimate and click "Save to Portfolio" to manage and compare multiple construction projects.
              </p>
            </div>
          ) : (
            savedProjects.map((p) => {
              const pData = p.projectData || {};
              const dateFormatted = new Date(p.date).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              });

              return (
                <div key={p.id} className={styles.projectCard}>
                  <div className={styles.cardHeader}>
                    <h3 className={styles.projectName}>{p.title}</h3>
                    <span className={styles.projectDate}>{dateFormatted}</span>
                  </div>

                  <div className={styles.metaRow}>
                    <span className={styles.metaBadge}>
                      {(pData.projectType || 'Residential').toUpperCase()}
                    </span>
                    <span className={styles.metaText}>
                      {pData.buildingSize} {p.unit || 'sqm'} • {pData.floors || 1} Floors
                    </span>
                    <span className={styles.metaLocation}>{pData.location || 'Site'}</span>
                  </div>

                  <div className={styles.cardFooter}>
                    <div className={styles.cardCost}>
                      {formatMoney(p.totalCost)}
                    </div>
                    <div className={styles.cardActions}>
                      <button
                        type="button"
                        className={styles.actionBtn}
                        onClick={() => {
                          loadSavedProject(p.id);
                          onClose();
                        }}
                        title="Load estimate"
                      >
                        Load
                      </button>
                      <button
                        type="button"
                        className={styles.actionBtn}
                        onClick={() => duplicateSavedProject(p.id)}
                        title="Duplicate estimate"
                      >
                        Copy
                      </button>
                      <button
                        type="button"
                        className={styles.actionBtnDanger}
                        onClick={() => deleteSavedProject(p.id)}
                        title="Delete estimate"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Drawer Footer */}
        {savedProjects.length > 0 && (
          <div className={styles.footer}>
            <button
              type="button"
              className={styles.btnExport}
              onClick={handleExportAllJSON}
              title="Download portfolio backup JSON"
            >
              Export Portfolio (.JSON)
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return typeof document !== 'undefined'
    ? ReactDOM.createPortal(content, document.body)
    : null;
};

export default ProjectHistoryDrawer;
