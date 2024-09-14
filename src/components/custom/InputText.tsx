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
}) => {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field, fieldState: { error, isTouched } }) => {
        return (
          <>
            <Label>
              {label} {required ? <span className="text-red-500">*</span> : ""}
            </Label>
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
            {error && (
              <p className="text-red-500 text-xs mt-1 ">{error.message}</p>
            )}
          </>
        )
      }}
    />
  )
}

export default TextInput
