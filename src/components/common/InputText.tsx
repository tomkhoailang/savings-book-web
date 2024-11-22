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

interface TextInputProps {
  control: any
  name: string
  label: string
  defaultValue?: string
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
  readonly?: boolean
  disabled?: boolean
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
  disabled,
  readonly,
  required,
  inline = false,
  number = false,
}) => {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field, fieldState: { error, isTouched } }) => {
        return (
          <div className={`${inline ? "flex items-center" : ""} ${className}`}>
            <Label className={inline ? "mr-2" : "block"}>
              {label} {required ? <span className="text-red-500">*</span> : ""}
            </Label>
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
                    const value = e.target.value ? Number(e.target.value) : 0
                    field.onChange(value >= 0 ? value : 0)
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
