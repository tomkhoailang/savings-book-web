import { DefaultValues, FieldValues, Resolver } from "react-hook-form"


export interface SocketType {
  type: string,
  handleData: (data: any) => any
}


export interface Metadata<
  TData extends AuditedEntity,
  TFormValues extends FieldValues
> {
  getUrl: string
  selectMultipleRow: boolean
  create?: {
    component: (data: TData | null) => React.ReactNode
    url: string
  }
  update?: {
    component: (data: TData | null) => React.ReactNode
    url: string
  }
  socket?: SocketType[]
  deleteUrl: string,
  handleResponseData?: (data: TData) => void
  formSchema: Resolver<TFormValues>
  getDefaultValue: (data: TData | null) => DefaultValues<TFormValues>
}
