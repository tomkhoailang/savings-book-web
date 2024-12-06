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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"

interface DropdownProps {
  control: any
  name: string
  label?: string
  defaultValue?: string | number
  placeholder?: string
  className?: string
  inline?: boolean
  required?: boolean
  datasource: any
}

const DropdownControl: React.FC<DropdownProps> = ({
  control,
  name,
  label,
  defaultValue = "",
  placeholder,
  className,
  required = true,
  inline = false,
  datasource,
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

            <div className="mt-1">
            <Select
              value={field.value}
              onValueChange={(value) => {
                field.onChange(parseInt(value))
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                {datasource.map((item: any, index: any) => {
                  return (
                    <SelectItem
                      key={`dropdown-${name}-${index}`}
                      value={item.value}
                    >
                      {item.label}
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
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

export default DropdownControl
