import { Button } from '../components/ui';

export function CtaBand({ onExport, onMap }: { onExport: () => void; onMap: () => void }) {
  return (
    <section className="container cta-wrap">
      <div className="cta">
        <div>
          <h2 className="h2" style={{ fontSize: 28 }}>Plan your next inspection round</h2>
          <p className="text-secondary">Export the top 15 as a CSV and share it with your field team.</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Button onClick={onMap}>View on map</Button>
          <Button variant="primary" onClick={onExport}>Export list</Button>
        </div>
      </div>
    </section>
  );
}
