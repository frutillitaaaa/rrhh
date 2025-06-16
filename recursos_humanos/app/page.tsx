import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function Dashboard() {
  return (
    <div className="min-h-screen px-6 py-6 sm:px-12 sm:py-8 bg-gray-50">
      <h1 className="text-2xl font-bold mb-6">Gestión de Empresa</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Estadísticas →</CardTitle>
          </CardHeader>
          <CardContent>
            Evolución nº usuarios (gráfico)
          </CardContent>
        </Card>
          
        <Card>
          <CardHeader>
            <CardTitle>Composición por cargo</CardTitle>
          </CardHeader>
          <CardContent>
            Gráfico de torta (después se insertará)
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
