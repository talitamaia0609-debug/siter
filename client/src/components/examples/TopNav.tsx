import { TopNav } from '../TopNav';

export default function TopNavExample() {
  return (
    <div className="h-screen bg-background">
      <TopNav />
      <div className="p-6">
        <p className="text-muted-foreground">Conteúdo da página</p>
      </div>
    </div>
  );
}
