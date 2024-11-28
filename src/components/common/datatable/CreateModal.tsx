import { Metadata } from "@/app/interfaces/metadata"
import proxyService from "../../../../utils/proxyService"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { useEffect, useState } from "react"
import { FieldValues, FormProvider, useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/app/reducers/store"
import LoadingButton from "../LoadingButton"

export default function CreateModal<
  TData extends AuditedEntity,
  TFormValues extends FieldValues
>({
  metadata,
  dataSource,
  isOpen,
  setIsOpen,
  whenClose,
}: {
  metadata: Metadata<TData, TFormValues>
  dataSource: TData | null
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  whenClose: (newData: TData) => void
}) {
  const [isLoading, setIsLoading] = useState(false)

  const methods = useForm<TFormValues>({
    resolver: metadata.formSchema,
    defaultValues: metadata.getDefaultValue(dataSource),
  })

  useEffect(() => {
    if (isOpen) {
      methods.reset(metadata.getDefaultValue(dataSource))
    }
  }, [dataSource, isOpen, metadata, methods])

  const onSubmit = async (data: TFormValues) => {
    setIsLoading(true)
    const res = await proxyService.post(`${metadata.create?.url}`, data)
    const content = res.data
    if (res.status === 200 || res.status === 201) {
      setIsOpen(!isOpen)
      whenClose(content)
    }
    setIsLoading(false)
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => {
        setIsOpen(!isOpen)
      }}
    >
      <DialogContent className="sm:max-w-[550px] fixed ">
        <DialogHeader>
          <DialogTitle>Create</DialogTitle>
        </DialogHeader>

        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
            {typeof metadata.create?.component === "function"
              ? metadata.create?.component(dataSource)
              : ""}

            <DialogFooter>
              <LoadingButton
                isLoading={isLoading}
                loadingText="Loading"
                label="Add"
                onclick={() => {
                  console.log("check this method again", methods.getValues())
                }}
              />
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}
