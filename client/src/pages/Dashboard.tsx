import { Users, Calendar, TrendingUp } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { ActivityFeed } from "@/components/ActivityFeed";
import { EventCard } from "@/components/EventCard";
import { Activity, Event } from "@shared/schema";

// TODO: remove mock functionality
const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'member_joined',
    description: 'ShadowHunter#9012 se juntou à guilda',
    userId: 'user1',
    createdAt: new Date(Date.now() - 1000 * 60 * 5),
  },
  {
    id: '2',
    type: 'event_started',
    description: 'Boss Aranamed foi iniciado por @Líder',
    userId: 'user2',
    createdAt: new Date(Date.now() - 1000 * 60 * 15),
  },
  {
    id: '3',
    type: 'points_transferred',
    description: 'DragonSlayer#1234 transferiu 50 pontos para MagicMaster#5678',
    userId: 'user3',
    createdAt: new Date(Date.now() - 1000 * 60 * 30),
  },
];

const mockActiveEvent: Event = {
  id: '1',
  name: 'Boss Aranamed',
  points: 8,
  emoji: '🐍',
  isActive: true,
  startedAt: new Date(Date.now() - 1000 * 60 * 15),
  endedAt: null,
  startedBy: '@Líder',
};

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard do Bot Discord</h1>
        <p className="text-muted-foreground mt-1">
          Bem-vindo ao painel de administração da guilda
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total de Membros"
          value="0"
          subtitle="0 membros ativos desde o último mês"
          icon={Users}
        />
        <StatCard
          title="Eventos Ativos"
          value="0"
          subtitle="0 eventos está em andamento"
          icon={Calendar}
        />
        <StatCard
          title="Level Médio"
          value="0"
          subtitle="Baseado em todos os membros"
          icon={TrendingUp}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ActivityFeed activities={mockActivities} />
        
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Eventos Ativos</h3>
          <EventCard 
            event={mockActiveEvent}
            participantCount={12}
            onCheckIn={() => console.log('Check-in realizado')}
            hasCheckedIn={false}
            canManage={true}
            onEnd={() => console.log('Evento encerrado')}
          />
          <p className="text-sm text-muted-foreground text-center py-4">
            Nenhum evento ativo no momento
          </p>
        </div>
      </div>
    </div>
  );
}
