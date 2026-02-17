import * as React from "react"
import { Input } from "./input"

interface CurrencyInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value: number;
  onChange: (value: number) => void;
}

export function CurrencyInput({ value, onChange, className, ...props }: CurrencyInputProps) {
  const formatValue = (val: number) => {
    return new Intl.NumberFormat("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(val);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove everything that is not a digit
    const digits = e.target.value.replace(/\D/g, "");
    
    // Convert to number (centavo based)
    const numericValue = parseInt(digits || "0", 10) / 100;
    
    onChange(numericValue);
  };

  return (
    <Input
      {...props}
      type="text"
      className={className}
      value={formatValue(value)}
      onChange={handleChange}
    />
  );
}
