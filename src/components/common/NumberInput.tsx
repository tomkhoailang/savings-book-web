import { Control, Controller, FieldValues } from "react-hook-form"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { Label } from "../ui/label"
import { number } from "zod"

interface TextInputProps {
  control: any
  name: string
  label?: string
  defaultValue?: string | number
  placeholder?: string
  className?: string
  inline?: boolean
  decimalPoint?: number
  step?: number
  required?: boolean,
  change?: any
}

const NumberInput: React.FC<TextInputProps> = ({
  control,
  name,
  label,
  defaultValue = "",
  placeholder,
  className,
  required = true,
  inline = false,
  step = 1,
  decimalPoint = 0,
  change
}) => {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field, fieldState: { error, isTouched } }) => {
        return (
          <div className={`${inline ? "flex items-center" : ""} ${className}`}>
            {label && <Label className={inline ? "mr-2" : "block"}>
              {label} {required ? <span className="text-red-500">*</span> : ""}
            </Label>}
            <Input
              type="number"
              placeholder={placeholder}
              {...field}
              className={`${error ? "border-red-500" : ""} mt-1`}
              value={field.value === 0 ? "" : field.value}  
              step={step}
              onChange={(e) => {
                let inputValue = e.target.value
                inputValue = inputValue.replace(/^0+/, "")
                if (decimalPoint !== 0) {
                  const regex = new RegExp(`^\\d*\\.?\\d{0,${decimalPoint}}$`)
                  if (regex.test(inputValue) || inputValue === "") {
                    let numValue = inputValue === "" ? 0 : parseFloat(inputValue)
                    field.onChange(numValue >= 0 ? numValue : 0)
                  }
                } else {
                  inputValue = inputValue.replace(/[.,]/g, "");
                  let numValue = inputValue === "" ? 0 : parseFloat(inputValue);
                  field.onChange(numValue >= 0 ? numValue : 0);
                }
                if (change && typeof change === "function") {
                  change()
                }
                
              }}
            />

            {error && (
              <p className="text-red-500 text-xs mt-1">{error.message}</p>
            )}
          </div>
        )
      }}
    />
  )
}

export default NumberInput
