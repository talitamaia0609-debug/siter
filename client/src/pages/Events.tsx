import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Event } from "@shared/schema";
import { EventCard } from "@/components/EventCard";

// TODO: remove mock functionality
const predefinedEvents: Event[] = [
  { id: '1', name: 'Doações', points: 1, emoji: '💰', isActive: false, startedAt: null, endedAt: null, startedBy: null },
  { id: '2', name: 'Boss Briare', points: 2, emoji: '🐉', isActive: false, startedAt: null, endedAt: null, startedBy: null },
  { id: '3', name: 'Boss Lythea', points: 4, emoji: '🐉', isActive: false, startedAt: null, endedAt: null, startedBy: null },
  { id: '4', name: 'Boss Ostiar', points: 6, emoji: '🐉', isActive: false, startedAt: null, endedAt: null, startedBy: null },
  { id: '5', name: 'Boss Leo', points: 6, emoji: '🦁', isActive: false, startedAt: null, endedAt: null, startedBy: null },
  { id: '6', name: 'Boss da Guilda', points: 10, emoji: '🛡️', isActive: false, startedAt: null, endedAt: null, startedBy: null },
  { id: '7', name: 'Guerra de Território', points: 100, emoji: '⚔️', isActive: false, startedAt: null, endedAt: null, startedBy: null },
  { id: '8', name: 'Guerra de Cerco', points: 150, emoji: '🏰', isActive: false, startedAt: null, endedAt: null, startedBy: null },
  { id: '9', name: 'Boss Aranamed', points: 8, emoji: '🐍', isActive: false, startedAt: null, endedAt: null, startedBy: null },
  { id: '10', name: 'Boss Monarca', points: 10, emoji: '👑', isActive: false, startedAt: null, endedAt: null, startedBy: null },
];

export default function Events() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Eventos</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie eventos e particip ações da guilda
          </p>
        </div>
        <Button data-testid="button-start-event">
          <Plus className="w-4 h-4 mr-2" />
          Iniciar Evento
        </Button>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Eventos Disponíveis</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {predefinedEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              participantCount={0}
              canManage={true}
            />
          ))}
        </div>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Histórico de Eventos</h2>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Nenhum evento finalizado ainda</p>
        </div>
      </Card>
    </div>
  );
}
