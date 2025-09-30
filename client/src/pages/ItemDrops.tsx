import { useState } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Gem, Trash2 } from "lucide-react";
import { ItemDrop } from "@shared/schema";

// TODO: remove mock functionality
const mockItemDrops: ItemDrop[] = [
  {
    id: '1',
    itemName: 'Espada Flamejante +15',
    diamondValue: 5000,
    eventId: '9',
    eventName: 'Boss Aranamed',
    participants: 'ShadowHunter#9012, MagicMaster#5678, DragonSlayer#1234',
    addedBy: '@Admin',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
  {
    id: '2',
    itemName: 'Armadura Dragônica Completa',
    diamondValue: 12000,
    eventId: '10',
    eventName: 'Boss Monarca',
    participants: 'ShadowHunter#9012, FireKnight#4455',
    addedBy: '@Moderador',
    createdAt: new Date(Date.now() - 1000 * 60 * 30),
  },
];

const predefinedEvents = [
  { id: '1', name: 'Doações', emoji: '💰' },
  { id: '2', name: 'Boss Briare', emoji: '🐉' },
  { id: '3', name: 'Boss Lythea', emoji: '🐉' },
  { id: '4', name: 'Boss Ostiar', emoji: '🐉' },
  { id: '5', name: 'Boss Leo', emoji: '🦁' },
  { id: '6', name: 'Boss da Guilda', emoji: '🛡️' },
  { id: '7', name: 'Guerra de Território', emoji: '⚔️' },
  { id: '8', name: 'Guerra de Cerco', emoji: '🏰' },
  { id: '9', name: 'Boss Aranamed', emoji: '🐍' },
  { id: '10', name: 'Boss Monarca', emoji: '👑' },
];

export default function ItemDrops() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    itemName: '',
    diamondValue: '',
    eventId: '',
    participants: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Item drop adicionado:', formData);
    setIsDialogOpen(false);
    setFormData({ itemName: '', diamondValue: '', eventId: '', participants: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Drops de Itens</h1>
          <p className="text-muted-foreground mt-1">
            Registre itens dropados em eventos com valor em diamantes
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-drop">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Drop
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Registrar Drop de Item</DialogTitle>
              <DialogDescription>
                Adicione um item que foi dropado em um evento
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="itemName">Nome do Item</Label>
                <Input
                  id="itemName"
                  placeholder="Ex: Espada Flamejante +15"
                  value={formData.itemName}
                  onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                  required
                  data-testid="input-item-name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="diamondValue">Valor em Diamantes</Label>
                <Input
                  id="diamondValue"
                  type="number"
                  placeholder="Ex: 5000"
                  value={formData.diamondValue}
                  onChange={(e) => setFormData({ ...formData, diamondValue: e.target.value })}
                  required
                  data-testid="input-diamond-value"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="event">Evento</Label>
                <Select
                  value={formData.eventId}
                  onValueChange={(value) => setFormData({ ...formData, eventId: value })}
                  required
                >
                  <SelectTrigger data-testid="select-event">
                    <SelectValue placeholder="Selecione o evento" />
                  </SelectTrigger>
                  <SelectContent>
                    {predefinedEvents.map((event) => (
                      <SelectItem key={event.id} value={event.id}>
                        {event.emoji} {event.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="participants">Participantes</Label>
                <Input
                  id="participants"
                  placeholder="Ex: Player1#1234, Player2#5678"
                  value={formData.participants}
                  onChange={(e) => setFormData({ ...formData, participants: e.target.value })}
                  required
                  data-testid="input-participants"
                />
                <p className="text-xs text-muted-foreground">
                  Separe os nomes com vírgula
                </p>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1" data-testid="button-submit-drop">
                  Adicionar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="p-6">
        <div className="rounded-md border border-card-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Evento</TableHead>
                <TableHead>Participantes</TableHead>
                <TableHead>Adicionado por</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockItemDrops.map((drop) => (
                <TableRow key={drop.id} data-testid={`drop-${drop.id}`}>
                  <TableCell className="font-medium">{drop.itemName}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Gem className="w-4 h-4 text-chart-3" />
                      <span className="font-mono font-semibold text-chart-3">
                        {drop.diamondValue.toLocaleString()}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{drop.eventName}</Badge>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <p className="text-sm truncate" title={drop.participants}>
                      {drop.participants}
                    </p>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{drop.addedBy}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(drop.createdAt).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive"
                      data-testid={`button-delete-${drop.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {mockItemDrops.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhum item dropado registrado</p>
          </div>
        )}
      </Card>
    </div>
  );
}
