import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Plus, Search, Pencil, Eye } from "lucide-react";
import { Member } from "@shared/schema";

// TODO: remove mock functionality
const mockMembers: Member[] = [
  {
    id: '1',
    discordId: '123456789',
    name: 'ShadowHunter#9012',
    class: 'Guerreiro',
    level: 85,
    power: 125000,
    eventPoints: 245,
    createdAt: new Date(),
  },
  {
    id: '2',
    discordId: '987654321',
    name: 'MagicMaster#5678',
    class: 'Mago',
    level: 82,
    power: 118000,
    eventPoints: 198,
    createdAt: new Date(),
  },
];

export default function Members() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredMembers = mockMembers.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Membros da Guilda</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie todos os membros da guilda
          </p>
        </div>
        <Button data-testid="button-add-member">
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Membro
        </Button>
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar membros..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
              data-testid="input-search-members"
            />
          </div>
        </div>

        <div className="rounded-md border border-card-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Classe</TableHead>
                <TableHead className="text-center">Level</TableHead>
                <TableHead className="text-center">Power</TableHead>
                <TableHead className="text-center">Pontos de Evento</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMembers.map((member) => (
                <TableRow key={member.id} data-testid={`row-member-${member.id}`}>
                  <TableCell className="font-medium">{member.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{member.class}</Badge>
                  </TableCell>
                  <TableCell className="text-center font-mono">{member.level}</TableCell>
                  <TableCell className="text-center font-mono">{member.power.toLocaleString()}</TableCell>
                  <TableCell className="text-center font-mono text-chart-2">{member.eventPoints}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button size="sm" variant="ghost" data-testid={`button-view-${member.id}`}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" data-testid={`button-edit-${member.id}`}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredMembers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhum membro encontrado</p>
          </div>
        )}
      </Card>
    </div>
  );
}
