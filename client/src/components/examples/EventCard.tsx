import { EventCard } from '../EventCard';
import { Event } from '@shared/schema';

const mockEvent: Event = {
  id: '1',
  name: 'Boss Aranamed',
  points: 8,
  emoji: '🐍',
  isActive: true,
  startedAt: new Date(),
  endedAt: null,
  startedBy: '@Líder',
};

export default function EventCardExample() {
  return (
    <div className="p-6 bg-background">
      <EventCard
        event={mockEvent}
        participantCount={12}
        onCheckIn={() => console.log('Check-in')}
        canManage={true}
        onEnd={() => console.log('Encerrar')}
      />
    </div>
  );
}
