import { Alert } from '@/store/useAlertStore';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, Eye } from 'lucide-react';

interface AlertListProps {
  alerts: Alert[];
  onSelectAlert: (alert: Alert) => void;
}

const severityConfig: Record<Alert['severity'], { color: string; label: string }> = {
  critical: { color: 'bg-red-500/20 text-red-500 border-red-500/30', label: 'CRITIQUE' },
  high: { color: 'bg-orange-500/20 text-orange-500 border-orange-500/30', label: 'ÉLEVÉ' },
  medium: { color: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30', label: 'MOYEN' },
  low: { color: 'bg-blue-500/20 text-blue-500 border-blue-500/30', label: 'FAIBLE' },
};

export const AlertList = ({ alerts, onSelectAlert }: AlertListProps) => {
  if (alerts.length === 0) {
    return (
      <div className="text-center py-16 border border-dashed rounded-xl bg-card/30">
        <ShieldCheck className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">Aucune menace détectée</h3>
        <p className="text-sm text-muted-foreground mt-1">Le flux est calme ou les filtres sont trop restrictifs.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>IP Source</TableHead>
            <TableHead>Menace</TableHead>
            <TableHead>Sévérité</TableHead>
            <TableHead>Date / Heure</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {alerts.map((alert) => (
            <TableRow
              key={alert.id}
              onClick={() => onSelectAlert(alert)}
              className="cursor-pointer hover:bg-muted/50 transition-colors"
            >
              <TableCell className="font-mono text-sm">{alert.ip}</TableCell>
              <TableCell className="font-medium">{alert.threat_type}</TableCell>
              <TableCell>
                <Badge variant="outline" className={`font-bold ${severityConfig[alert.severity].color}`}>
                  {severityConfig[alert.severity].label}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground text-xs">
                {new Date(alert.timestamp).toLocaleTimeString('fr-FR')}
              </TableCell>
              <TableCell>
                <Badge variant={alert.status === 'banned' ? 'destructive' : 'secondary'} className="capitalize">
                  {alert.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Eye className="h-4 w-4 inline text-muted-foreground hover:text-primary" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};