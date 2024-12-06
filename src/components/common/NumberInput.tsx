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
  required?: boolean
  change?: any
  min?: number
  max?: number
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
  change,
  min,
  max,
}) => {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field, fieldState: { error, isTouched } }) => {
        return (
          <div className={`${inline ? "flex items-center" : ""} ${className}`}>
            {label && (
              <Label className={inline ? "mr-2" : "block"}>
                {label}{" "}
                {required ? <span className="text-red-500">*</span> : ""}
              </Label>
            )}

            {decimalPoint !== 0 ? (
              <Input
                type="number"
                min={min}
                max={max}
                placeholder={placeholder}
                {...field}
                className={`${error ? "border-red-500" : ""} mt-1`}
                step={step}
                onChange={(e) => {
                  console.log(1)
                  let inputValue = e.target.value
                  inputValue = inputValue.replace(/^0+/, "")
                  const regex = new RegExp(`^\\d*\\.?\\d{0,${decimalPoint}}$`)
                  if (regex.test(inputValue) || inputValue === "") {
                    let numValue =
                      inputValue === "" ? 0 : parseFloat(inputValue)

                    numValue = numValue >= 0 ? numValue : 0
                    if (max) {
                      numValue = numValue >= max ? max : numValue
                    }
                    if (min) {
                      numValue = numValue < min ? min : numValue
                    }

                    field.onChange(numValue)
                    e.target.value = "0.1"
                  }
                  if (change && typeof change === "function") {
                    change()
                  }
                }}
              />
            ) : (
              <Input
                type="number"
                min={min}
                max={max}
                placeholder={placeholder}
                {...field}
                className={`${error ? "border-red-500" : ""} mt-1`}
                step={step}
                onChange={(e) => {
                  let inputValue = e.target.value
                  inputValue = inputValue.replace(/^0+/, "")
                  let numValue = inputValue === "" ? 0 : parseFloat(inputValue)

                  const regex = new RegExp(`^\\d*\\.?\\d{0,${decimalPoint}}$`)
                  if (regex.test(inputValue) || inputValue === "") {
                    numValue = numValue >= 0 ? numValue : 0
                    if (max) {
                      numValue = numValue >= max ? max : numValue
                    }
                    if (min) {
                      numValue = numValue < min ? min : numValue
                    }

                    field.onChange(numValue)
                    e.target.value = "0.1"
                  }

                  if (change && typeof change === "function") {
                    change()
                  }
                }}
              />
            )}

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
