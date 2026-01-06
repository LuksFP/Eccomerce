import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useShipping, ShippingOption } from "@/hooks/useShipping";
import { formatPrice } from "@/utils/formatPrice";
import { Truck, Loader2, MapPin, Clock, Zap, Rocket } from "lucide-react";

type ShippingCalculatorProps = {
  onShippingSelect: (option: ShippingOption | null) => void;
  initialCep?: string;
};

const shippingIcons: Record<string, React.ReactNode> = {
  economico: <Truck className="h-4 w-4" />,
  padrao: <Clock className="h-4 w-4" />,
  expresso: <Zap className="h-4 w-4" />,
  super_expresso: <Rocket className="h-4 w-4" />,
};

export const ShippingCalculator = ({ onShippingSelect, initialCep = "" }: ShippingCalculatorProps) => {
  const [cep, setCep] = useState(initialCep);
  const { isLoading, options, error, calculateShipping, selectedOption, setSelectedOption } = useShipping();

  useEffect(() => {
    if (selectedOption) {
      onShippingSelect(selectedOption);
    }
  }, [selectedOption, onShippingSelect]);

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 5) {
      value = value.slice(0, 5) + "-" + value.slice(5, 8);
    }
    setCep(value);
  };

  const handleCalculate = () => {
    calculateShipping(cep);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleCalculate();
    }
  };

  const handleOptionChange = (optionId: string) => {
    const option = options.find((o) => o.id === optionId);
    if (option) {
      setSelectedOption(option);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <MapPin className="h-4 w-4 text-primary" />
          Calcular Frete
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <div className="flex-1">
            <Label htmlFor="cep" className="sr-only">
              CEP
            </Label>
            <Input
              id="cep"
              placeholder="00000-000"
              value={cep}
              onChange={handleCepChange}
              onKeyDown={handleKeyDown}
              maxLength={9}
              className="h-10"
            />
          </div>
          <Button onClick={handleCalculate} disabled={isLoading || cep.length < 8}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Calcular"}
          </Button>
        </div>

        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}

        {options.length > 0 && (
          <div className="space-y-3">
            <p className="text-sm font-medium text-muted-foreground">
              Opções de entrega:
            </p>
            <RadioGroup
              value={selectedOption?.id || ""}
              onValueChange={handleOptionChange}
              className="space-y-2"
            >
              {options.map((option) => (
                <label
                  key={option.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedOption?.id === option.id
                      ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                      : "border-border hover:bg-muted/50"
                  }`}
                >
                  <RadioGroupItem value={option.id} id={option.id} className="sr-only" />
                  <div className={`p-2 rounded-lg ${
                    selectedOption?.id === option.id 
                      ? "bg-primary/10 text-primary" 
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {shippingIcons[option.id]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm">{option.name}</p>
                      {option.id === "super_expresso" && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium">
                          MAIS RÁPIDO
                        </span>
                      )}
                      {option.id === "economico" && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-success/10 text-success font-medium">
                          MAIS BARATO
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{option.days}</p>
                  </div>
                  <p className={`font-bold text-sm ${
                    selectedOption?.id === option.id ? "text-primary" : ""
                  }`}>
                    {formatPrice(option.price)}
                  </p>
                </label>
              ))}
            </RadioGroup>
          </div>
        )}

        {!options.length && !error && !isLoading && (
          <p className="text-sm text-muted-foreground text-center py-2">
            Digite seu CEP para ver as opções de entrega
          </p>
        )}
      </CardContent>
    </Card>
  );
};
