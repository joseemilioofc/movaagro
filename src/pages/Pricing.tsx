import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Footer } from "@/components/Footer";
import { ArrowLeft, Calculator, Truck, MapPin, Package, Info, Wheat } from "lucide-react";
import { formatMZN } from "@/lib/currency";

const cargoTypes = [
  { value: "milho", label: "Milho", pricePerKmTon: 2.5 },
  { value: "soja", label: "Soja", pricePerKmTon: 2.8 },
  { value: "trigo", label: "Trigo", pricePerKmTon: 2.6 },
  { value: "cafe", label: "Café", pricePerKmTon: 3.5 },
  { value: "acucar", label: "Açúcar", pricePerKmTon: 2.4 },
  { value: "arroz", label: "Arroz", pricePerKmTon: 2.7 },
  { value: "feijao", label: "Feijão", pricePerKmTon: 3.0 },
  { value: "algodao", label: "Algodão", pricePerKmTon: 3.2 },
  { value: "amendoim", label: "Amendoim", pricePerKmTon: 2.9 },
  { value: "outros", label: "Outros", pricePerKmTon: 2.5 },
];

const origins = [
  "Maputo",
  "Matola",
  "Beira",
  "Nampula",
  "Chimoio",
  "Tete",
  "Quelimane",
  "Lichinga",
  "Pemba",
  "Xai-Xai",
  "Maxixe",
  "Inhambane",
];

const destinations = [...origins];

// Estimated distances between cities (in km) - simplified matrix
const distanceMatrix: Record<string, Record<string, number>> = {
  "Maputo": { "Maputo": 0, "Matola": 15, "Beira": 1200, "Nampula": 2000, "Chimoio": 950, "Tete": 1600, "Quelimane": 1500, "Lichinga": 2400, "Pemba": 2500, "Xai-Xai": 220, "Maxixe": 450, "Inhambane": 470 },
  "Matola": { "Maputo": 15, "Matola": 0, "Beira": 1185, "Nampula": 1985, "Chimoio": 935, "Tete": 1585, "Quelimane": 1485, "Lichinga": 2385, "Pemba": 2485, "Xai-Xai": 205, "Maxixe": 435, "Inhambane": 455 },
  "Beira": { "Maputo": 1200, "Matola": 1185, "Beira": 0, "Nampula": 800, "Chimoio": 250, "Tete": 600, "Quelimane": 500, "Lichinga": 1200, "Pemba": 1300, "Xai-Xai": 980, "Maxixe": 750, "Inhambane": 730 },
  "Nampula": { "Maputo": 2000, "Matola": 1985, "Beira": 800, "Nampula": 0, "Chimoio": 1050, "Tete": 900, "Quelimane": 400, "Lichinga": 600, "Pemba": 500, "Xai-Xai": 1780, "Maxixe": 1550, "Inhambane": 1530 },
  "Chimoio": { "Maputo": 950, "Matola": 935, "Beira": 250, "Nampula": 1050, "Chimoio": 0, "Tete": 350, "Quelimane": 750, "Lichinga": 1450, "Pemba": 1550, "Xai-Xai": 730, "Maxixe": 500, "Inhambane": 480 },
  "Tete": { "Maputo": 1600, "Matola": 1585, "Beira": 600, "Nampula": 900, "Chimoio": 350, "Tete": 0, "Quelimane": 700, "Lichinga": 800, "Pemba": 1100, "Xai-Xai": 1380, "Maxixe": 1150, "Inhambane": 1130 },
  "Quelimane": { "Maputo": 1500, "Matola": 1485, "Beira": 500, "Nampula": 400, "Chimoio": 750, "Tete": 700, "Quelimane": 0, "Lichinga": 800, "Pemba": 900, "Xai-Xai": 1280, "Maxixe": 1050, "Inhambane": 1030 },
  "Lichinga": { "Maputo": 2400, "Matola": 2385, "Beira": 1200, "Nampula": 600, "Chimoio": 1450, "Tete": 800, "Quelimane": 800, "Lichinga": 0, "Pemba": 700, "Xai-Xai": 2180, "Maxixe": 1950, "Inhambane": 1930 },
  "Pemba": { "Maputo": 2500, "Matola": 2485, "Beira": 1300, "Nampula": 500, "Chimoio": 1550, "Tete": 1100, "Quelimane": 900, "Lichinga": 700, "Pemba": 0, "Xai-Xai": 2280, "Maxixe": 2050, "Inhambane": 2030 },
  "Xai-Xai": { "Maputo": 220, "Matola": 205, "Beira": 980, "Nampula": 1780, "Chimoio": 730, "Tete": 1380, "Quelimane": 1280, "Lichinga": 2180, "Pemba": 2280, "Xai-Xai": 0, "Maxixe": 230, "Inhambane": 250 },
  "Maxixe": { "Maputo": 450, "Matola": 435, "Beira": 750, "Nampula": 1550, "Chimoio": 500, "Tete": 1150, "Quelimane": 1050, "Lichinga": 1950, "Pemba": 2050, "Xai-Xai": 230, "Maxixe": 0, "Inhambane": 20 },
  "Inhambane": { "Maputo": 470, "Matola": 455, "Beira": 730, "Nampula": 1530, "Chimoio": 480, "Tete": 1130, "Quelimane": 1030, "Lichinga": 1930, "Pemba": 2030, "Xai-Xai": 250, "Maxixe": 20, "Inhambane": 0 },
};

const priceTableData = [
  { cargo: "Milho", weight: "30 ton", distance: "100 - 200 km", priceMin: 7500, priceMax: 15000 },
  { cargo: "Soja", weight: "28 ton", distance: "200 - 400 km", priceMin: 15680, priceMax: 31360 },
  { cargo: "Trigo", weight: "25 ton", distance: "150 - 300 km", priceMin: 9750, priceMax: 19500 },
  { cargo: "Café", weight: "20 ton", distance: "100 - 250 km", priceMin: 7000, priceMax: 17500 },
  { cargo: "Açúcar", weight: "32 ton", distance: "300 - 500 km", priceMin: 23040, priceMax: 38400 },
  { cargo: "Arroz", weight: "28 ton", distance: "150 - 350 km", priceMin: 11340, priceMax: 26460 },
  { cargo: "Feijão", weight: "22 ton", distance: "100 - 300 km", priceMin: 6600, priceMax: 19800 },
  { cargo: "Algodão", weight: "18 ton", distance: "200 - 400 km", priceMin: 11520, priceMax: 23040 },
];

const Pricing = () => {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [cargoType, setCargoType] = useState("");
  const [weight, setWeight] = useState("");
  const [calculatedPrice, setCalculatedPrice] = useState<{ min: number; max: number } | null>(null);
  const [distance, setDistance] = useState<number | null>(null);

  const calculatePrice = () => {
    if (!origin || !destination || !cargoType || !weight) {
      return;
    }

    const weightNum = parseFloat(weight);
    if (isNaN(weightNum) || weightNum <= 0) {
      return;
    }

    const cargo = cargoTypes.find(c => c.value === cargoType);
    if (!cargo) return;

    const dist = distanceMatrix[origin]?.[destination] || 500;
    setDistance(dist);

    // Base price calculation: price per km per ton * distance * weight
    const basePrice = cargo.pricePerKmTon * dist * weightNum;
    
    // Add variation for market fluctuation (±15%)
    const minPrice = basePrice * 0.85;
    const maxPrice = basePrice * 1.15;

    // Minimum price floor
    const finalMin = Math.max(minPrice, 5000);
    const finalMax = Math.max(maxPrice, 7500);

    setCalculatedPrice({ min: finalMin, max: finalMax });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <nav className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Truck className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
            </div>
            <span className="text-xl sm:text-2xl font-display font-bold text-foreground">MOVA</span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
            <Link to="/auth">
              <Button variant="outline" size="sm" className="font-medium text-sm sm:text-base px-3 sm:px-4 border-2">
                Entrar
              </Button>
            </Link>
            <Link to="/auth?tab=signup">
              <Button size="sm" className="bg-gradient-primary text-primary-foreground font-medium shadow-glow text-sm sm:text-base px-3 sm:px-4">
                Cadastrar
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="container mx-auto px-3 sm:px-4 py-8 sm:py-12">
          <div className="text-center mb-8 sm:mb-12">
            <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6">
              <ArrowLeft className="w-4 h-4" />
              Voltar ao início
            </Link>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
              Preços e <span className="text-gradient">Calculadora</span> de Frete
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-base sm:text-lg">
              Calcule o custo estimado do seu frete com base na origem, destino, tipo de carga e peso.
            </p>
          </div>
        </section>

        {/* Calculator Section */}
        <section className="container mx-auto px-3 sm:px-4 pb-12 sm:pb-16">
          <Card className="max-w-4xl mx-auto shadow-lg border-2 border-primary/20">
            <CardHeader className="bg-gradient-primary text-primary-foreground rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
                <Calculator className="w-6 h-6" />
                Calculadora de Frete
              </CardTitle>
              <CardDescription className="text-primary-foreground/80">
                Preencha os campos abaixo para obter uma estimativa de preço
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 sm:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="origin" className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    Origem
                  </Label>
                  <Select value={origin} onValueChange={setOrigin}>
                    <SelectTrigger id="origin">
                      <SelectValue placeholder="Selecione a cidade de origem" />
                    </SelectTrigger>
                    <SelectContent>
                      {origins.map((city) => (
                        <SelectItem key={city} value={city}>{city}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="destination" className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-destructive" />
                    Destino
                  </Label>
                  <Select value={destination} onValueChange={setDestination}>
                    <SelectTrigger id="destination">
                      <SelectValue placeholder="Selecione a cidade de destino" />
                    </SelectTrigger>
                    <SelectContent>
                      {destinations.map((city) => (
                        <SelectItem key={city} value={city}>{city}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cargoType" className="flex items-center gap-2">
                    <Wheat className="w-4 h-4 text-primary" />
                    Tipo de Carga
                  </Label>
                  <Select value={cargoType} onValueChange={setCargoType}>
                    <SelectTrigger id="cargoType">
                      <SelectValue placeholder="Selecione o tipo de carga" />
                    </SelectTrigger>
                    <SelectContent>
                      {cargoTypes.map((cargo) => (
                        <SelectItem key={cargo.value} value={cargo.value}>{cargo.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weight" className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-primary" />
                    Peso (toneladas)
                  </Label>
                  <Input
                    id="weight"
                    type="number"
                    placeholder="Ex: 30"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    min="1"
                    max="100"
                  />
                </div>
              </div>

              <Button 
                onClick={calculatePrice} 
                className="w-full mt-6 bg-gradient-primary text-primary-foreground font-semibold h-12 text-lg"
                disabled={!origin || !destination || !cargoType || !weight}
              >
                <Calculator className="w-5 h-5 mr-2" />
                Calcular Preço
              </Button>

              {calculatedPrice && (
                <div className="mt-8 p-6 bg-muted/50 rounded-xl border border-border">
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Info className="w-5 h-5 text-primary" />
                    Resultado da Estimativa
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-card p-4 rounded-lg border border-border">
                      <p className="text-sm text-muted-foreground mb-1">Distância Estimada</p>
                      <p className="text-xl font-bold text-foreground">{distance} km</p>
                    </div>
                    <div className="bg-card p-4 rounded-lg border border-border">
                      <p className="text-sm text-muted-foreground mb-1">Preço Mínimo</p>
                      <p className="text-xl font-bold text-primary">{formatMZN(calculatedPrice.min)}</p>
                    </div>
                    <div className="bg-card p-4 rounded-lg border border-border">
                      <p className="text-sm text-muted-foreground mb-1">Preço Máximo</p>
                      <p className="text-xl font-bold text-primary">{formatMZN(calculatedPrice.max)}</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-4">
                    * Este é um valor estimado. O preço final será negociado entre as partes envolvidas.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        {/* Price Table Section */}
        <section className="container mx-auto px-3 sm:px-4 py-12 sm:py-16 bg-muted/30">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Tabela de Preços de Referência
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Valores em Meticais (MZN) baseados em rotas e cargas típicas de Moçambique
            </p>
          </div>

          <div className="max-w-5xl mx-auto bg-card rounded-xl sm:rounded-2xl shadow-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-primary">
                  <TableHead className="font-bold text-primary-foreground">Tipo de Carga</TableHead>
                  <TableHead className="font-bold text-primary-foreground">Peso Típico</TableHead>
                  <TableHead className="font-bold text-primary-foreground">Distância</TableHead>
                  <TableHead className="font-bold text-primary-foreground text-right">Faixa de Preço (MZN)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {priceTableData.map((row, index) => (
                  <TableRow key={index} className={index % 2 === 0 ? "bg-muted/20" : ""}>
                    <TableCell className="font-medium">{row.cargo}</TableCell>
                    <TableCell>{row.weight}</TableCell>
                    <TableCell>{row.distance}</TableCell>
                    <TableCell className="text-right font-semibold text-primary">
                      {formatMZN(row.priceMin)} - {formatMZN(row.priceMax)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="p-4 bg-muted/30 border-t border-border">
              <p className="text-xs sm:text-sm text-muted-foreground text-center">
                * Valores sujeitos a variação conforme disponibilidade, urgência, condições da rota e negociação.
              </p>
            </div>
          </div>
        </section>

        {/* Additional Info */}
        <section className="container mx-auto px-3 sm:px-4 py-12 sm:py-16">
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Truck className="w-5 h-5 text-primary" />
                  Frota Verificada
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Todos os transportadores são verificados para garantir segurança e qualidade no serviço.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Package className="w-5 h-5 text-primary" />
                  Rastreamento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Acompanhe sua carga em tempo real com nosso sistema de GPS integrado.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-primary" />
                  Preço Justo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Negocie diretamente com transportadores e obtenha o melhor preço para seu frete.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Link to="/auth?tab=signup">
              <Button size="lg" className="bg-gradient-primary text-primary-foreground font-semibold px-8 h-14 text-lg shadow-glow">
                Começar Agora
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Pricing;
