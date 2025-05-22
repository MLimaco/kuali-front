import * as React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Label, Pie, PieChart } from "recharts";

// Configuración de colores para cada tipo de log
const chartConfig = {
  total: {
    label: "Total",
  },
  correo: {
    label: "Correo",
    color: "hsl(var(--chart-1))", // Azul
  },
  whatsapp: {
    label: "WhatsApp",
    color: "hsl(var(--chart-2))", // Verde
  },
  videollamada: {
    label: "Videollamada",
    color: "hsl(var(--chart-3))", // Naranja
  },
  presencial: {
    label: "Presencial",
    color: "hsl(var(--chart-4))", // Morado
  },
};

export function LogsChart({ logs, selectedLead }) {
  // Calcular datos para el gráfico
  const chartData = React.useMemo(() => {
    // Si no hay logs, retornar array vacío
    if (!logs || logs.length === 0) return [];
    
    // Agrupar logs por tipo
    const typeCounts = {};
    logs.forEach(log => {
      const type = log.type || "otro";
      typeCounts[type] = (typeCounts[type] || 0) + 1;
    });
    
    // Convertir a formato para recharts
    return Object.entries(typeCounts).map(([type, count]) => ({
      type,
      count,
      fill: chartConfig[type]?.color || "hsl(var(--chart-5))", // Color por defecto para tipos no definidos
    }));
  }, [logs]);
  
  // Calcular total de logs
  const totalLogs = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.count, 0);
  }, [chartData]);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Distribución de Logs</CardTitle>
        <CardDescription>
          {selectedLead ? `Logs de ${selectedLead.firstName} ${selectedLead.lastName}` : "Todos los logs"}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        {chartData.length === 0 ? (
          <div className="flex h-48 items-center justify-center text-muted-foreground">
            No hay datos disponibles
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[250px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={chartData}
                dataKey="count"
                nameKey="type"
                innerRadius={60}
                strokeWidth={5}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold"
                          >
                            {totalLogs}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            Logs
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          {selectedLead
            ? `Mostrando ${totalLogs} logs para ${selectedLead.firstName}`
            : `Mostrando un total de ${totalLogs} logs`}
        </div>
      </CardFooter>
    </Card>
  );
}