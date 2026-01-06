import { useState, useCallback } from "react";

export type ShippingOption = {
  id: string;
  name: string;
  price: number;
  days: string;
  description: string;
};

type UseShippingReturn = {
  isLoading: boolean;
  options: ShippingOption[];
  error: string | null;
  calculateShipping: (cep: string) => Promise<void>;
  selectedOption: ShippingOption | null;
  setSelectedOption: (option: ShippingOption) => void;
};

// Simulated shipping calculation based on CEP regions
const calculateShippingOptions = (cep: string): ShippingOption[] => {
  const cepNumber = parseInt(cep.replace(/\D/g, ""));
  
  // Base prices by region (simulated)
  let basePrice = 15;
  let baseDays = 5;
  
  // São Paulo region
  if (cepNumber >= 1000000 && cepNumber <= 19999999) {
    basePrice = 12;
    baseDays = 3;
  }
  // Rio de Janeiro region
  else if (cepNumber >= 20000000 && cepNumber <= 28999999) {
    basePrice = 15;
    baseDays = 4;
  }
  // Minas Gerais region
  else if (cepNumber >= 30000000 && cepNumber <= 39999999) {
    basePrice = 18;
    baseDays = 5;
  }
  // South region
  else if (cepNumber >= 80000000 && cepNumber <= 99999999) {
    basePrice = 22;
    baseDays = 6;
  }
  // Northeast region
  else if (cepNumber >= 40000000 && cepNumber <= 65999999) {
    basePrice = 28;
    baseDays = 8;
  }
  // North region
  else if (cepNumber >= 66000000 && cepNumber <= 77999999) {
    basePrice = 35;
    baseDays = 10;
  }
  // Center-West region
  else if (cepNumber >= 70000000 && cepNumber <= 79999999) {
    basePrice = 25;
    baseDays = 7;
  }

  return [
    {
      id: "economico",
      name: "Econômico",
      price: basePrice,
      days: `${baseDays + 3} a ${baseDays + 5} dias úteis`,
      description: "Entrega padrão com melhor custo-benefício",
    },
    {
      id: "padrao",
      name: "Padrão",
      price: basePrice + 8,
      days: `${baseDays} a ${baseDays + 2} dias úteis`,
      description: "Entrega balanceada entre preço e prazo",
    },
    {
      id: "expresso",
      name: "Expresso",
      price: basePrice + 18,
      days: `${Math.max(1, baseDays - 2)} a ${baseDays} dias úteis`,
      description: "Entrega prioritária com agilidade",
    },
    {
      id: "super_expresso",
      name: "Super Expresso",
      price: basePrice + 30,
      days: `${Math.max(1, baseDays - 3)} a ${Math.max(2, baseDays - 2)} dias úteis`,
      description: "A entrega mais rápida disponível",
    },
  ];
};

export const useShipping = (): UseShippingReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState<ShippingOption[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<ShippingOption | null>(null);

  const calculateShipping = useCallback(async (cep: string) => {
    const cleanCep = cep.replace(/\D/g, "");
    
    if (cleanCep.length !== 8) {
      setError("CEP inválido. Digite 8 dígitos.");
      setOptions([]);
      setSelectedOption(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    try {
      const shippingOptions = calculateShippingOptions(cleanCep);
      setOptions(shippingOptions);
      // Auto-select the standard option
      setSelectedOption(shippingOptions[1]);
    } catch {
      setError("Erro ao calcular frete. Tente novamente.");
      setOptions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    options,
    error,
    calculateShipping,
    selectedOption,
    setSelectedOption,
  };
};
