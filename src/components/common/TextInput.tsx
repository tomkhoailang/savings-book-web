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
  textArea?: boolean
  className?: string
  componentClassName?: string
  password?: boolean
  icon?: any
  maxlength?: number
  required?: boolean
  inline?: boolean
  number?: boolean
  decimal?: boolean
}

const TextInput: React.FC<TextInputProps> = ({
  control,
  name,
  label,
  defaultValue = "",
  placeholder,
  textArea = false,
  className,
  componentClassName,
  password = false,
  icon,
  maxlength,
  required,
  inline = false,
  number = false,
  decimal = false
}) => {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={typeof defaultValue === 'number' ? defaultValue : defaultValue.toString()}
      render={({ field, fieldState: { error, isTouched } }) => {
        return (
          <div className={`${inline ? "flex items-center" : ""} ${className}`}>
           {label &&  <Label className={inline ? "mr-2" : "block"}>
              {label} {required ? <span className="text-red-500">*</span> : ""}
            </Label>}
            <div className={inline ? "" : "mt-1"}>
              {textArea ? (
                <Textarea
                  placeholder={placeholder}
                  {...field}
                  className={`${componentClassName} ${
                    error ? "border-red-500" : ""
                  }`}
                />
              ) : password ? (
                <Input
                  type="password"
                  placeholder={placeholder}
                  maxLength={maxlength}
                  {...field}
                  className={`${componentClassName} ${
                    error ? "border-red-500" : ""
                  }`}
                />
              ) : number ? (
                <Input
                  type="number"
                  placeholder={placeholder}
                  maxLength={maxlength}
                  {...field}
                  className={`${componentClassName} ${
                    error ? "border-red-500" : ""
                  }`}
                  
                  onChange={(e) => {
                    const value = e.target.value;
                    const regex = /^\d*\.?\d{0,2}$/;
                    if (regex.test(value) || value === '') {
                      const numValue = value === '' ? 0 : parseFloat(value);
                      field.onChange(numValue >= 0 ? numValue : 0);
                    }
                  }}
                />
              ) : (
                <Input
                  type="text"
                  placeholder={placeholder}
                  maxLength={maxlength}
                  {...field}
                  className={`${componentClassName} ${
                    error ? "border-red-500" : ""
                  }`}
                />
              )}
            </div>
            {error && (
              <p className="text-red-500 text-xs mt-1">{error.message}</p>
            )}
          </div>
        )
      }}
    />
  )
}


export default TextInput
