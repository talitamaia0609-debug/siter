import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, ShoppingCart } from "lucide-react";
import { MarketplaceItem } from "@shared/schema";

// TODO: remove mock functionality
const mockItems: MarketplaceItem[] = [
  {
    id: '1',
    name: 'Espada Flamejante +10',
    description: 'Espada rara com bônus de fogo',
    sellerId: '1',
    price: 500,
    status: 'available',
    createdAt: new Date(),
  },
  {
    id: '2',
    name: 'Armadura Dragônica',
    description: 'Conjunto completo de armadura lendária',
    sellerId: '2',
    price: 1200,
    status: 'available',
    createdAt: new Date(),
  },
];

export default function Marketplace() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Marketplace</h1>
          <p className="text-muted-foreground mt-1">
            Itens à venda entre membros da guilda
          </p>
        </div>
        <Button data-testid="button-add-item">
          <Plus className="w-4 h-4 mr-2" />
          Vender Item
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mockItems.map((item) => (
          <Card key={item.id} className="p-6 hover-elevate" data-testid={`item-${item.id}`}>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-mono font-semibold text-chart-2">{item.price}</p>
                  <p className="text-xs text-muted-foreground">pontos</p>
                </div>
                <Badge variant={item.status === 'available' ? 'default' : 'secondary'}>
                  {item.status === 'available' ? 'Disponível' : 'Vendido'}
                </Badge>
              </div>

              <Button className="w-full" disabled={item.status !== 'available'} data-testid={`button-buy-${item.id}`}>
                <ShoppingCart className="w-4 h-4 mr-2" />
                Comprar
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {mockItems.length === 0 && (
        <Card className="p-12">
          <div className="text-center">
            <p className="text-muted-foreground">Nenhum item à venda no momento</p>
          </div>
        </Card>
      )}
    </div>
  );
}
