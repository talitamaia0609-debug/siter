import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Trophy, TrendingUp, Star, Sword } from "lucide-react";
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
  {
    id: '3',
    discordId: '456789123',
    name: 'DragonSlayer#1234',
    class: 'Arqueiro',
    level: 88,
    power: 132000,
    eventPoints: 312,
    createdAt: new Date(),
  },
];

export default function Rankings() {
  const [activeTab, setActiveTab] = useState("level");

  const getSortedMembers = (sortBy: 'level' | 'power' | 'eventPoints') => {
    return [...mockMembers].sort((a, b) => b[sortBy] - a[sortBy]);
  };

  const getMedalEmoji = (position: number) => {
    if (position === 0) return '🥇';
    if (position === 1) return '🥈';
    if (position === 2) return '🥉';
    return null;
  };

  const getClassStats = () => {
    const classMap = new Map<string, { members: Member[], totalLevel: number, totalPower: number, totalPoints: number }>();
    
    mockMembers.forEach(member => {
      if (!classMap.has(member.class)) {
        classMap.set(member.class, { members: [], totalLevel: 0, totalPower: 0, totalPoints: 0 });
      }
      const classData = classMap.get(member.class)!;
      classData.members.push(member);
      classData.totalLevel += member.level;
      classData.totalPower += member.power;
      classData.totalPoints += member.eventPoints;
    });

    return Array.from(classMap.entries()).map(([className, data]) => ({
      class: className,
      memberCount: data.members.length,
      avgLevel: Math.round(data.totalLevel / data.members.length),
      avgPower: Math.round(data.totalPower / data.members.length),
      totalPoints: data.totalPoints,
    })).sort((a, b) => b.totalPoints - a.totalPoints);
  };

  const RankingList = ({ members, valueKey, label }: { members: Member[], valueKey: keyof Member, label: string }) => (
    <div className="space-y-3">
      {members.map((member, index) => (
        <div 
          key={member.id} 
          className="flex items-center gap-4 p-4 rounded-lg bg-card border border-card-border hover-elevate"
          data-testid={`rank-${index + 1}`}
        >
          <div className="flex items-center justify-center w-12 h-12 rounded-md bg-muted font-mono font-semibold">
            {getMedalEmoji(index) || `#${index + 1}`}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{member.name}</p>
            <Badge variant="secondary" className="mt-1">{member.class}</Badge>
          </div>
          <div className="text-right">
            <p className="text-2xl font-mono font-semibold text-chart-2">{member[valueKey]?.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Rankings</h1>
        <p className="text-muted-foreground mt-1">
          Confira os melhores membros da guilda
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="level" data-testid="tab-level">
            <TrendingUp className="w-4 h-4 mr-2" />
            Level
          </TabsTrigger>
          <TabsTrigger value="power" data-testid="tab-power">
            <Star className="w-4 h-4 mr-2" />
            Power
          </TabsTrigger>
          <TabsTrigger value="events" data-testid="tab-events">
            <Trophy className="w-4 h-4 mr-2" />
            Pontos de Eventos
          </TabsTrigger>
          <TabsTrigger value="class" data-testid="tab-class">
            <Sword className="w-4 h-4 mr-2" />
            Classe
          </TabsTrigger>
        </TabsList>

        <TabsContent value="level">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Ranking por Level</h2>
            <RankingList members={getSortedMembers('level')} valueKey="level" label="Level" />
          </Card>
        </TabsContent>

        <TabsContent value="power">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Ranking por Power</h2>
            <RankingList members={getSortedMembers('power')} valueKey="power" label="Power" />
          </Card>
        </TabsContent>

        <TabsContent value="events">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Ranking por Pontos de Eventos</h2>
            <RankingList members={getSortedMembers('eventPoints')} valueKey="eventPoints" label="Pontos" />
          </Card>
        </TabsContent>

        <TabsContent value="class">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Ranking por Classe</h2>
            <div className="space-y-3">
              {getClassStats().map((classData, index) => (
                <div 
                  key={classData.class} 
                  className="flex items-center gap-4 p-4 rounded-lg bg-card border border-card-border hover-elevate"
                  data-testid={`class-rank-${index + 1}`}
                >
                  <div className="flex items-center justify-center w-12 h-12 rounded-md bg-muted font-mono font-semibold">
                    {getMedalEmoji(index) || `#${index + 1}`}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold">{classData.class}</h3>
                      <Badge variant="secondary">{classData.memberCount} membros</Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Level Médio</p>
                        <p className="font-mono font-semibold">{classData.avgLevel}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Power Médio</p>
                        <p className="font-mono font-semibold">{classData.avgPower.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Total de Pontos</p>
                        <p className="font-mono font-semibold text-chart-2">{classData.totalPoints}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
