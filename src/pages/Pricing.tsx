import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Footer } from "@/components/Footer";
import MozambiqueMap from "@/components/MozambiqueMap";
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
  { value: "tabaco", label: "Tabaco", pricePerKmTon: 3.8 },
  { value: "cana", label: "Cana-de-açúcar", pricePerKmTon: 2.2 },
  { value: "castanha", label: "Castanha de Caju", pricePerKmTon: 4.0 },
  { value: "copra", label: "Copra", pricePerKmTon: 3.0 },
  { value: "gergelim", label: "Gergelim", pricePerKmTon: 3.5 },
  { value: "outros", label: "Outros", pricePerKmTon: 2.5 },
];

// All major cities of Mozambique with coordinates
const cityData = [
  // Maputo Province
  { name: "Maputo", lat: -25.9692, lng: 32.5732, province: "Maputo Cidade" },
  { name: "Matola", lat: -25.9625, lng: 32.4589, province: "Maputo" },
  { name: "Boane", lat: -26.0333, lng: 32.3333, province: "Maputo" },
  { name: "Marracuene", lat: -25.7333, lng: 32.6667, province: "Maputo" },
  { name: "Namaacha", lat: -25.9833, lng: 32.0167, province: "Maputo" },
  
  // Gaza Province
  { name: "Xai-Xai", lat: -25.0519, lng: 35.0473, province: "Gaza" },
  { name: "Chókwè", lat: -24.5333, lng: 32.9833, province: "Gaza" },
  { name: "Chibuto", lat: -24.0833, lng: 33.5333, province: "Gaza" },
  { name: "Bilene", lat: -25.2833, lng: 33.2333, province: "Gaza" },
  { name: "Mandlakazi", lat: -24.0667, lng: 34.9667, province: "Gaza" },
  { name: "Macia", lat: -25.0333, lng: 33.1000, province: "Gaza" },
  
  // Inhambane Province
  { name: "Inhambane", lat: -23.8650, lng: 35.3833, province: "Inhambane" },
  { name: "Maxixe", lat: -23.8500, lng: 35.3333, province: "Inhambane" },
  { name: "Vilankulo", lat: -22.0000, lng: 35.3167, province: "Inhambane" },
  { name: "Massinga", lat: -23.3167, lng: 35.3833, province: "Inhambane" },
  { name: "Jangamo", lat: -24.0833, lng: 35.0167, province: "Inhambane" },
  { name: "Morrumbene", lat: -23.6833, lng: 35.3500, province: "Inhambane" },
  
  // Sofala Province
  { name: "Beira", lat: -19.8436, lng: 34.8389, province: "Sofala" },
  { name: "Dondo", lat: -19.6167, lng: 34.7333, province: "Sofala" },
  { name: "Gorongosa", lat: -18.6833, lng: 34.0667, province: "Sofala" },
  { name: "Nhamatanda", lat: -19.1833, lng: 34.1667, province: "Sofala" },
  { name: "Marromeu", lat: -18.2833, lng: 35.9333, province: "Sofala" },
  { name: "Búzi", lat: -19.8833, lng: 34.1167, province: "Sofala" },
  
  // Manica Province
  { name: "Chimoio", lat: -19.1164, lng: 33.4833, province: "Manica" },
  { name: "Manica", lat: -18.9500, lng: 32.8833, province: "Manica" },
  { name: "Catandica", lat: -18.0500, lng: 33.1833, province: "Manica" },
  { name: "Gondola", lat: -19.0833, lng: 33.6667, province: "Manica" },
  { name: "Sussundenga", lat: -19.3333, lng: 33.2333, province: "Manica" },
  { name: "Báruè", lat: -17.6333, lng: 33.4000, province: "Manica" },
  
  // Tete Province
  { name: "Tete", lat: -16.1564, lng: 33.5867, province: "Tete" },
  { name: "Moatize", lat: -16.1167, lng: 33.7500, province: "Tete" },
  { name: "Songo", lat: -15.6167, lng: 32.7667, province: "Tete" },
  { name: "Ulónguè", lat: -14.7167, lng: 34.3667, province: "Tete" },
  { name: "Changara", lat: -16.3833, lng: 33.1833, province: "Tete" },
  { name: "Zumbo", lat: -15.6167, lng: 30.4167, province: "Tete" },
  { name: "Cahora Bassa", lat: -15.6000, lng: 32.7167, province: "Tete" },
  
  // Zambézia Province
  { name: "Quelimane", lat: -17.8786, lng: 36.8883, province: "Zambézia" },
  { name: "Mocuba", lat: -16.8500, lng: 36.9833, province: "Zambézia" },
  { name: "Gurué", lat: -15.4667, lng: 36.9833, province: "Zambézia" },
  { name: "Milange", lat: -16.1167, lng: 35.7667, province: "Zambézia" },
  { name: "Alto Molócuè", lat: -15.6167, lng: 37.7000, province: "Zambézia" },
  { name: "Nicoadala", lat: -17.6167, lng: 36.8333, province: "Zambézia" },
  { name: "Maganja da Costa", lat: -17.3167, lng: 37.5000, province: "Zambézia" },
  { name: "Pebane", lat: -17.2667, lng: 38.1500, province: "Zambézia" },
  
  // Nampula Province
  { name: "Nampula", lat: -15.1167, lng: 39.2667, province: "Nampula" },
  { name: "Nacala", lat: -14.5667, lng: 40.6833, province: "Nampula" },
  { name: "Angoche", lat: -16.2333, lng: 39.9167, province: "Nampula" },
  { name: "Monapo", lat: -15.0333, lng: 40.2667, province: "Nampula" },
  { name: "Ilha de Moçambique", lat: -15.0333, lng: 40.7333, province: "Nampula" },
  { name: "Ribaué", lat: -15.0667, lng: 38.2667, province: "Nampula" },
  { name: "Malema", lat: -14.9500, lng: 37.4000, province: "Nampula" },
  { name: "Meconta", lat: -15.1000, lng: 39.5667, province: "Nampula" },
  
  // Niassa Province
  { name: "Lichinga", lat: -13.3000, lng: 35.2333, province: "Niassa" },
  { name: "Cuamba", lat: -14.8000, lng: 36.5333, province: "Niassa" },
  { name: "Mandimba", lat: -14.3500, lng: 35.7167, province: "Niassa" },
  { name: "Marrupa", lat: -13.1833, lng: 37.5000, province: "Niassa" },
  { name: "Metangula", lat: -12.7000, lng: 34.7500, province: "Niassa" },
  { name: "Ngauma", lat: -13.1333, lng: 35.5333, province: "Niassa" },
  
  // Cabo Delgado Province
  { name: "Pemba", lat: -12.9667, lng: 40.5000, province: "Cabo Delgado" },
  { name: "Montepuez", lat: -13.1333, lng: 39.0000, province: "Cabo Delgado" },
  { name: "Chiúre", lat: -13.4167, lng: 39.8500, province: "Cabo Delgado" },
  { name: "Mocímboa da Praia", lat: -11.3500, lng: 40.3500, province: "Cabo Delgado" },
  { name: "Palma", lat: -10.7667, lng: 40.4667, province: "Cabo Delgado" },
  { name: "Mueda", lat: -11.6833, lng: 39.5500, province: "Cabo Delgado" },
  { name: "Macomia", lat: -12.2333, lng: 40.1333, province: "Cabo Delgado" },
  { name: "Ancuabe", lat: -13.0500, lng: 39.8500, province: "Cabo Delgado" },
  { name: "Ibo", lat: -12.3500, lng: 40.6000, province: "Cabo Delgado" },
];

const origins = cityData.map(c => c.name).sort();
const destinations = [...origins];

// Function to calculate approximate distance between two cities
const calculateDistance = (city1: string, city2: string): number => {
  const c1 = cityData.find(c => c.name === city1);
  const c2 = cityData.find(c => c.name === city2);
  
  if (!c1 || !c2) return 500;
  if (city1 === city2) return 0;
  
  // Haversine formula for distance calculation
  const R = 6371; // Earth's radius in km
  const dLat = (c2.lat - c1.lat) * Math.PI / 180;
  const dLon = (c2.lng - c1.lng) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(c1.lat * Math.PI / 180) * Math.cos(c2.lat * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const straightLineDistance = R * c;
  
  // Add 30% for road distance approximation
  return Math.round(straightLineDistance * 1.3);
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
  { cargo: "Castanha de Caju", weight: "15 ton", distance: "150 - 350 km", priceMin: 9000, priceMax: 21000 },
  { cargo: "Tabaco", weight: "12 ton", distance: "200 - 500 km", priceMin: 9120, priceMax: 22800 },
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

    const dist = calculateDistance(origin, destination);
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

  const handleCitySelect = (city: string, type: "origin" | "destination") => {
    if (type === "origin") {
      setOrigin(city);
    } else {
      setDestination(city);
    }
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
              Cobertura em todas as províncias de Moçambique.
            </p>
          </div>
        </section>

        {/* Map Section */}
        <section className="container mx-auto px-3 sm:px-4 pb-8">
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
                Preencha os campos abaixo para obter uma estimativa de preço - {cityData.length} cidades disponíveis
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 sm:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="origin" className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-green-500" />
                    Origem
                  </Label>
                  <Select value={origin} onValueChange={setOrigin}>
                    <SelectTrigger id="origin">
                      <SelectValue placeholder="Selecione a cidade de origem" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      {origins.map((city) => {
                        const cityInfo = cityData.find(c => c.name === city);
                        return (
                          <SelectItem key={city} value={city}>
                            {city} {cityInfo && <span className="text-muted-foreground text-xs">({cityInfo.province})</span>}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="destination" className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-red-500" />
                    Destino
                  </Label>
                  <Select value={destination} onValueChange={setDestination}>
                    <SelectTrigger id="destination">
                      <SelectValue placeholder="Selecione a cidade de destino" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      {destinations.map((city) => {
                        const cityInfo = cityData.find(c => c.name === city);
                        return (
                          <SelectItem key={city} value={city}>
                            {city} {cityInfo && <span className="text-muted-foreground text-xs">({cityInfo.province})</span>}
                          </SelectItem>
                        );
                      })}
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

        {/* Province Coverage */}
        <section className="container mx-auto px-3 sm:px-4 py-8 bg-muted/30">
          <div className="text-center mb-6">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-foreground mb-2">
              Cobertura Nacional
            </h2>
            <p className="text-muted-foreground text-sm">
              Todas as 11 províncias de Moçambique cobertas
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 max-w-4xl mx-auto">
            {["Maputo Cidade", "Maputo", "Gaza", "Inhambane", "Sofala", "Manica", "Tete", "Zambézia", "Nampula", "Niassa", "Cabo Delgado"].map((province) => {
              const count = cityData.filter(c => c.province === province).length;
              return (
                <div key={province} className="bg-card p-3 rounded-lg border border-border text-center">
                  <p className="font-medium text-sm text-foreground">{province}</p>
                  <p className="text-xs text-muted-foreground">{count} {count === 1 ? "cidade" : "cidades"}</p>
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
