import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Trophy,
  ShoppingBag, 
 
  ArrowRightLeft,
  Menu,
  Sparkles,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/App";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const navItems = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/members", label: "Membros", icon: Users },
  { path: "/events", label: "Eventos", icon: Calendar },
  { path: "/rankings", label: "Ranking", icon: Trophy },
  { path: "/item-drops", label: "Drops de Itens", icon: Sparkles },
  { path: "/marketplace", label: "Marketplace", icon: ShoppingBag },
  { path: "/transfers", label: "Transferências", icon: ArrowRightLeft },
];

interface TopNavProps {
  onMenuClick?: () => void;
}

export function TopNav({ onMenuClick }: TopNavProps) {
  const [location, setLocation] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await apiRequest("POST", "/auth/logout");
      await queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      setLocation("/login");
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao fazer logout",
        variant: "destructive",
      });
    }
  };

  const getAvatarUrl = () => {
    if (!user?.avatar) return undefined;
    return `https://cdn.discordapp.com/avatars/${user.discordId}/${user.avatar}.png`;
  };

  const getUserInitials = () => {
    if (!user?.username) return "U";
    return user.username.charAt(0).toUpperCase();
  };

  return (
    <div className="border-b border-border bg-background">
      <div className="flex items-center justify-between gap-4 px-4 py-3">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onMenuClick}
            data-testid="button-menu-toggle"
          >
            <Menu className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold">Discord Bot Admin Panel</h1>
        </div>

        {isAuthenticated && user && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8" data-testid="avatar-user">
                <AvatarImage src={getAvatarUrl()} alt={user.username} />
                <AvatarFallback>{getUserInitials()}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium" data-testid="text-username">
                {user.username}
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              data-testid="button-logout"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
      
      <nav className="flex items-center gap-1 px-4 overflow-x-auto">
        {navItems.map((item) => {
          const isActive = location === item.path;
          const Icon = item.icon;
          
          return (
            <Link key={item.path} href={item.path}>
              <button
                className={`
                  flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap
                  transition-colors border-b-2 hover-elevate
                  ${isActive 
                    ? 'border-primary text-foreground' 
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                  }
                `}
                data-testid={`nav-${item.label.toLowerCase()}`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
