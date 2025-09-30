import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Event } from "@shared/schema";
import { Users, Clock } from "lucide-react";

interface EventCardProps {
  event: Event;
  participantCount?: number;
  onCheckIn?: () => void;
  onEnd?: () => void;
  hasCheckedIn?: boolean;
  canManage?: boolean;
}

export function EventCard({ 
  event, 
  participantCount = 0, 
  onCheckIn, 
  onEnd,
  hasCheckedIn = false,
  canManage = false
}: EventCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{event.emoji}</span>
          <div>
            <h3 className="text-lg font-semibold">{event.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary" className="font-mono">
                {event.points} pontos
              </Badge>
              {event.isActive && (
                <Badge variant="default" className="bg-chart-2 hover:bg-chart-2">
                  Ativo
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
        <div className="flex items-center gap-1">
          <Users className="w-4 h-4" />
          <span data-testid="participant-count">{participantCount} participantes</span>
        </div>
        {event.startedAt && (
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>Iniciado {new Date(event.startedAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        )}
      </div>

      {event.isActive && (
        <div className="flex gap-2">
          {onCheckIn && (
            <Button 
              onClick={onCheckIn}
              disabled={hasCheckedIn}
              className="flex-1"
              data-testid="button-checkin"
            >
              {hasCheckedIn ? '✓ Check-in Realizado' : 'Fazer Check-in'}
            </Button>
          )}
          {canManage && onEnd && (
            <Button 
              onClick={onEnd}
              variant="destructive"
              data-testid="button-end-event"
            >
              Encerrar Evento
            </Button>
          )}
        </div>
      )}
    </Card>
  );
}
