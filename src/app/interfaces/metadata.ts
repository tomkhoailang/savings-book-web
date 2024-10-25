import { DefaultValues, FieldValues, Resolver } from "react-hook-form"

export interface Metadata<
  TData extends AuditedEntity,
  TFormValues extends FieldValues
> {
  getUrl: string
  create?: {
    component: (data: TData | null) => React.ReactNode
    url: string
  }
  update?: {
    component: (data: TData | null) => React.ReactNode
    url: string
  }
  handleResponseData?: (data: TData) => void
  formSchema: Resolver<TFormValues>
  getDefaultValue: (data: TData | null) => DefaultValues<TFormValues>
}
