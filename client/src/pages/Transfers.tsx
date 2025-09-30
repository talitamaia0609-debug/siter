import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Check, X } from "lucide-react";
import { PointTransfer } from "@shared/schema";

// TODO: remove mock functionality
const mockTransfers: PointTransfer[] = [
  {
    id: '1',
    fromMemberId: '1',
    toMemberId: '2',
    points: 50,
    approvedBy: null,
    status: 'pending',
    createdAt: new Date(Date.now() - 1000 * 60 * 30),
  },
  {
    id: '2',
    fromMemberId: '3',
    toMemberId: '1',
    points: 100,
    approvedBy: '@Admin',
    status: 'approved',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
  },
];

export default function Transfers() {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Pendente</Badge>;
      case 'approved':
        return <Badge className="bg-chart-2 hover:bg-chart-2">Aprovado</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejeitado</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transferências de Pontos</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie transferências de pontos entre membros
          </p>
        </div>
        <Button data-testid="button-request-transfer">
          <Plus className="w-4 h-4 mr-2" />
          Solicitar Transferência
        </Button>
      </div>

      <Card className="p-6">
        <div className="rounded-md border border-card-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>De</TableHead>
                <TableHead>Para</TableHead>
                <TableHead className="text-center">Pontos</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Aprovado por</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockTransfers.map((transfer) => (
                <TableRow key={transfer.id} data-testid={`transfer-${transfer.id}`}>
                  <TableCell className="font-medium">ShadowHunter#9012</TableCell>
                  <TableCell className="font-medium">MagicMaster#5678</TableCell>
                  <TableCell className="text-center font-mono font-semibold text-chart-2">
                    {transfer.points}
                  </TableCell>
                  <TableCell>{getStatusBadge(transfer.status)}</TableCell>
                  <TableCell>{transfer.approvedBy || '-'}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(transfer.createdAt).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell className="text-right">
                    {transfer.status === 'pending' && (
                      <div className="flex items-center justify-end gap-2">
                        <Button size="sm" variant="ghost" className="text-chart-2" data-testid={`button-approve-${transfer.id}`}>
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-destructive" data-testid={`button-reject-${transfer.id}`}>
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {mockTransfers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhuma transferência registrada</p>
          </div>
        )}
      </Card>
    </div>
  );
}
