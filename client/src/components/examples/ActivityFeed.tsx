import { ActivityFeed } from '../ActivityFeed';
import { Activity } from '@shared/schema';

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
    description: 'Boss Aranamed foi iniciado',
    userId: 'user2',
    createdAt: new Date(Date.now() - 1000 * 60 * 15),
  },
];

export default function ActivityFeedExample() {
  return (
    <div className="p-6 bg-background">
      <ActivityFeed activities={mockActivities} />
    </div>
  );
}
