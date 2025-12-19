import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Footer } from "@/components/Footer";
import MozambiqueMap from "@/components/MozambiqueMap";
import { CitySearchSelect } from "@/components/CitySearchSelect";
import { PriceHistory } from "@/components/PriceHistory";
import { PriceComparison } from "@/components/PriceComparison";
import { PriceComparisonChart } from "@/components/PriceComparisonChart";
import { PriceExportPDF } from "@/components/PriceExportPDF";
import { TravelTimeEstimate, calculateTravelTime } from "@/components/TravelTimeEstimate";
import { ArrowLeft, Calculator, Truck, MapPin, Package, Info, Wheat, TrendingUp, Route, Star, Save, Loader2 } from "lucide-react";
import { formatMZN } from "@/lib/currency";
import { mozambiqueLocations, popularRoutes, getCitiesByProvince, calculateDistance } from "@/data/mozambiqueLocations";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

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
  { value: "tabaco", label: "Tabaco", pricePerKmTon: 3.8 },
  { value: "cana", label: "Cana-de-açúcar", pricePerKmTon: 2.2 },
  { value: "castanha", label: "Castanha de Caju", pricePerKmTon: 4.0 },
  { value: "copra", label: "Copra", pricePerKmTon: 3.0 },
  { value: "gergelim", label: "Gergelim", pricePerKmTon: 3.5 },
  { value: "cha", label: "Chá", pricePerKmTon: 4.2 },
  { value: "coco", label: "Coco", pricePerKmTon: 2.8 },
  { value: "banana", label: "Banana", pricePerKmTon: 2.6 },
  { value: "citrinos", label: "Citrinos", pricePerKmTon: 2.9 },
  { value: "horticolas", label: "Hortícolas", pricePerKmTon: 3.2 },
  { value: "outros", label: "Outros", pricePerKmTon: 2.5 },
];

const priceTableData = [
  { cargo: "Milho", weight: "30 ton", distance: "100 - 200 km", priceMin: 7500, priceMax: 15000 },
  { cargo: "Soja", weight: "28 ton", distance: "200 - 400 km", priceMin: 15680, priceMax: 31360 },
  { cargo: "Trigo", weight: "25 ton", distance: "150 - 300 km", priceMin: 9750, priceMax: 19500 },
  { cargo: "Café", weight: "20 ton", distance: "100 - 250 km", priceMin: 7000, priceMax: 17500 },
  { cargo: "Açúcar", weight: "32 ton", distance: "300 - 500 km", priceMin: 23040, priceMax: 38400 },
  { cargo: "Arroz", weight: "28 ton", distance: "150 - 350 km", priceMin: 11340, priceMax: 26460 },
  { cargo: "Feijão", weight: "22 ton", distance: "100 - 300 km", priceMin: 6600, priceMax: 19800 },
  { cargo: "Algodão", weight: "18 ton", distance: "200 - 400 km", priceMin: 11520, priceMax: 23040 },
  { cargo: "Castanha de Caju", weight: "15 ton", distance: "150 - 350 km", priceMin: 9000, priceMax: 21000 },
  { cargo: "Tabaco", weight: "12 ton", distance: "200 - 500 km", priceMin: 9120, priceMax: 22800 },
];

// Convert mozambiqueLocations to the format expected by MozambiqueMap
const cityData = mozambiqueLocations.map(loc => ({
  name: loc.name,
  lat: loc.lat,
  lng: loc.lng,
  province: loc.province,
}));

const Pricing = () => {
  const { user } = useAuth();
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [cargoType, setCargoType] = useState("");
  const [weight, setWeight] = useState("");
  const [calculatedPrice, setCalculatedPrice] = useState<{ min: number; max: number } | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [historyKey, setHistoryKey] = useState(0);

  const citiesByProvince = getCitiesByProvince();
  const provinces = Object.keys(citiesByProvince).sort();

  const doCalculatePrice = () => {
    if (!origin || !destination || !cargoType || !weight) {
      return null;
    }

    const weightNum = parseFloat(weight);
    if (isNaN(weightNum) || weightNum <= 0) {
      return null;
    }

    const cargo = cargoTypes.find(c => c.value === cargoType);
    if (!cargo) return null;

    const dist = calculateDistance(origin, destination);

    // Base price calculation: price per km per ton * distance * weight
    const basePrice = cargo.pricePerKmTon * dist * weightNum;
    
    // Add variation for market fluctuation (±15%)
    const minPrice = basePrice * 0.85;
    const maxPrice = basePrice * 1.15;

    // Minimum price floor
    const finalMin = Math.max(minPrice, 5000);
    const finalMax = Math.max(maxPrice, 7500);

    return { min: finalMin, max: finalMax, distance: dist };
  };

  const calculatePrice = () => {
    const result = doCalculatePrice();
    if (result) {
      setDistance(result.distance);
      setCalculatedPrice({ min: result.min, max: result.max });
    }
  };

  const saveCalculation = async () => {
    if (!user || !calculatedPrice || !distance) {
      toast.error("Faça login para salvar o cálculo");
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase.from("price_calculations").insert({
        user_id: user.id,
        origin,
        destination,
        cargo_type: cargoType,
        weight_kg: parseFloat(weight),
        distance_km: distance,
        price_min: calculatedPrice.min,
        price_max: calculatedPrice.max,
      });

      if (error) throw error;
      toast.success("Cálculo salvo no histórico!");
      setHistoryKey(prev => prev + 1); // Refresh history
    } catch (error) {
      console.error("Error saving calculation:", error);
      toast.error("Erro ao salvar cálculo");
    } finally {
      setSaving(false);
    }
  };

  const handleCitySelect = (city: string, type: "origin" | "destination") => {
    if (type === "origin") {
      setOrigin(city);
    } else {
      setDestination(city);
    }
  };

  const handlePopularRouteSelect = (route: typeof popularRoutes[0]) => {
    setOrigin(route.origin);
    setDestination(route.destination);
  };

  const handleHistorySelect = (calc: any) => {
    setOrigin(calc.origin);
    setDestination(calc.destination);
    setCargoType(calc.cargo_type);
    setWeight(calc.weight_kg.toString());
    setDistance(calc.distance_km);
    setCalculatedPrice({ min: calc.price_min, max: calc.price_max });
  };

  const getFrequencyBadge = (frequency: string) => {
    const colors: Record<string, string> = {
      "muito alta": "bg-green-500/20 text-green-700 dark:text-green-400",
      "alta": "bg-blue-500/20 text-blue-700 dark:text-blue-400",
      "média": "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400",
      "baixa": "bg-gray-500/20 text-gray-700 dark:text-gray-400",
    };
    return colors[frequency] || colors["média"];
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
            {user ? (
              <Link to="/dashboard">
                <Button size="sm" className="bg-gradient-primary text-primary-foreground font-medium shadow-glow text-sm sm:text-base px-3 sm:px-4">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <>
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
              </>
            )}
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
              Cobertura em todas as {provinces.length} províncias de Moçambique com {mozambiqueLocations.length} localidades.
            </p>
          </div>
        </section>

        {/* Popular Routes Section */}
        <section className="container mx-auto px-3 sm:px-4 pb-8">
          <Card className="border-2 border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Rotas Populares
              </CardTitle>
              <CardDescription>
                As rotas mais utilizadas com preços médios de referência
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {popularRoutes.slice(0, 12).map((route, index) => (
                  <div
                    key={index}
                    onClick={() => handlePopularRouteSelect(route)}
                    className="p-3 bg-muted/50 rounded-lg border border-border hover:border-primary/50 hover:bg-muted cursor-pointer transition-all group"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Route className="w-4 h-4 text-primary" />
                      <span className="font-medium text-sm text-foreground">
                        {route.origin} → {route.destination}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="font-semibold text-primary">{formatMZN(route.avgPrice)}</span>
                      <span className={`px-2 py-0.5 rounded-full ${getFrequencyBadge(route.frequency)}`}>
                        {route.frequency}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{route.cargo}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-4 text-center">
                Clique numa rota para preencher automaticamente a calculadora
              </p>
            </CardContent>
          </Card>
        </section>

        {/* History Section for logged users */}
        <section className="container mx-auto px-3 sm:px-4 pb-8">
          <PriceHistory 
            key={historyKey}
            userId={user?.id || null} 
            onSelectCalculation={handleHistorySelect}
          />
        </section>

        {/* Map Section */}
        <section className="container mx-auto px-3 sm:px-4 pb-8">
          <div className="mb-2 text-center text-sm text-muted-foreground">
            💡 Dica: Clique no mapa para selecionar origem e destino
          </div>
          <MozambiqueMap 
            cities={cityData}
            origin={origin}
            destination={destination}
            onCitySelect={handleCitySelect}
          />
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
                {mozambiqueLocations.length} localidades disponíveis em {provinces.length} províncias • Pesquisa por nome
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 sm:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-green-500" />
                    Origem
                  </Label>
                  <CitySearchSelect
                    locations={mozambiqueLocations}
                    value={origin}
                    onValueChange={setOrigin}
                    placeholder="Pesquisar cidade de origem..."
                  />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-red-500" />
                    Destino
                  </Label>
                  <CitySearchSelect
                    locations={mozambiqueLocations}
                    value={destination}
                    onValueChange={setDestination}
                    placeholder="Pesquisar cidade de destino..."
                  />
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
                    <SelectContent className="max-h-[300px]">
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

              {calculatedPrice && distance && (
                <div className="mt-8 p-6 bg-muted/50 rounded-xl border border-border">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                    <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                      <Info className="w-5 h-5 text-primary" />
                      Resultado da Estimativa
                    </h3>
                    <div className="flex items-center gap-2">
                      <PriceExportPDF
                        origin={origin}
                        destination={destination}
                        cargoType={cargoType}
                        cargoLabel={cargoTypes.find(c => c.value === cargoType)?.label || cargoType}
                        weight={parseFloat(weight)}
                        distance={distance}
                        priceMin={calculatedPrice.min}
                        priceMax={calculatedPrice.max}
                        travelTime={calculateTravelTime(distance).formatted}
                      />
                      {user && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={saveCalculation}
                          disabled={saving}
                        >
                          {saving ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <Save className="w-4 h-4 mr-2" />
                          )}
                          Salvar
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-card p-4 rounded-lg border border-border">
                      <p className="text-sm text-muted-foreground mb-1">Distância Estimada</p>
                      <p className="text-xl font-bold text-foreground">{distance} km</p>
                    </div>
                    <TravelTimeEstimate distance={distance} />
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
                    {!user && " Faça login para salvar este cálculo no seu histórico."}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        {/* Price Comparison Section */}
        {origin && destination && weight && (
          <section className="container mx-auto px-3 sm:px-4 pb-12">
            <PriceComparison
              origin={origin}
              destination={destination}
              weight={weight}
              cargoTypes={cargoTypes}
              selectedCargoType={cargoType}
            />
          </section>
        )}

        {/* Price Comparison Chart Section */}
        {origin && destination && weight && (
          <section className="container mx-auto px-3 sm:px-4 pb-12">
            <PriceComparisonChart
              origin={origin}
              destination={destination}
              weight={weight}
              cargoTypes={cargoTypes}
              selectedCargoType={cargoType}
            />
          </section>
        )}

        {/* Province Coverage */}
        <section className="container mx-auto px-3 sm:px-4 py-8 bg-muted/30">
          <div className="text-center mb-6">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-foreground mb-2">
              Cobertura Nacional Completa
            </h2>
            <p className="text-muted-foreground text-sm">
              Todas as {provinces.length} províncias e {mozambiqueLocations.length} localidades cobertas
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 max-w-5xl mx-auto">
            {provinces.map((province) => {
              const count = citiesByProvince[province].length;
              const capitals = citiesByProvince[province].filter(c => c.type === "capital");
              return (
                <div key={province} className="bg-card p-3 rounded-lg border border-border text-center hover:border-primary/50 transition-colors">
                  <p className="font-medium text-sm text-foreground truncate">{province}</p>
                  <p className="text-xs text-muted-foreground">{count} localidades</p>
                  {capitals.length > 0 && (
                    <p className="text-xs text-primary flex items-center justify-center gap-1 mt-1">
                      <Star className="w-3 h-3" />
                      {capitals[0].name}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Price Table Section */}
        <section className="container mx-auto px-3 sm:px-4 py-12 sm:py-16">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Tabela de Preços de Referência
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Valores em Meticais (MZN) baseados em rotas e cargas típicas de Moçambique
            </p>
          </div>

          <div className="max-w-5xl mx-auto bg-card rounded-xl sm:rounded-2xl shadow-lg border border-border overflow-hidden">
            <div className="overflow-x-auto">
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
            </div>
            <div className="p-4 bg-muted/30 border-t border-border">
              <p className="text-xs sm:text-sm text-muted-foreground text-center">
                * Valores sujeitos a variação conforme disponibilidade, urgência, condições da rota e negociação.
              </p>
            </div>
          </div>
        </section>

        {/* Additional Info */}
        <section className="container mx-auto px-3 sm:px-4 py-12 sm:py-16 bg-muted/30">
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
                  Rastreamento GPS
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
                  Preços transparentes baseados em distância, tipo de carga e peso.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Pricing;
