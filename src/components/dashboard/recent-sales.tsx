import { useSales } from '@/hooks/use-sales';
import { Badge } from '@/components/ui/badge';

export function RecentSales() {
  const { sales } = useSales();

  const recentSales = sales
    .sort((a, b) => b.id.localeCompare(a.id))
    .slice(0, 5);

  if (recentSales.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-sm text-muted-foreground">No sales found</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {recentSales.map((sale) => (
        <div className="flex items-center" key={sale.id}>
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">{sale.title}</p>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {sale.status}
              </Badge>
              {sale.client && (
                <p className="text-sm text-muted-foreground">
                  Client: {sale.client}
                </p>
              )}
            </div>
          </div>
          <div className="ml-auto font-medium text-sm text-muted-foreground">
            ${sale.value.toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  );
}
