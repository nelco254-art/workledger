interface SettingsPanelProps {
  compactMode: boolean
  onCompactModeChange: (enabled: boolean) => void
}

export function SettingsPanel({
  compactMode,
  onCompactModeChange,
}: SettingsPanelProps) {
  return (
    <section
      className="settings-panel"
      aria-labelledby="workspace-preferences-heading"
    >
      <header className="settings-header">
        <h3 id="workspace-preferences-heading">Workspace preferences</h3>
        <p>Adjust how WorkLedger appears on this device.</p>
      </header>

      <div className="preference-row">
        <div>
          <h4>Compact layout</h4>
          <p id="compact-layout-description">
            Reduce navigation, card, and table spacing to show more information
            at once.
          </p>
        </div>

        <label className="toggle-control">
          <input
            aria-describedby="compact-layout-description"
            checked={compactMode}
            onChange={(event) =>
              onCompactModeChange(event.target.checked)
            }
            type="checkbox"
          />

          <span className="toggle-track" aria-hidden="true">
            <span className="toggle-thumb" />
          </span>

          <span>{compactMode ? 'Compact' : 'Comfortable'}</span>
        </label>
      </div>

      <p className="settings-status" aria-live="polite">
        Layout density is set to{' '}
        <strong>{compactMode ? 'compact' : 'comfortable'}</strong>.
      </p>
    </section>
  )
}