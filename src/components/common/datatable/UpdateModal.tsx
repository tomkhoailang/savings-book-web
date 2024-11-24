"use client"
import { Metadata } from "@/app/interfaces/metadata"
import proxyService from "../../../../utils/proxyService"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { useEffect } from "react"
import { FieldValues, FormProvider, useForm } from "react-hook-form"

export default function UpdateModal<
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
  const { toast } = useToast()

  const methods = useForm<TFormValues>({
    resolver: metadata.formSchema,
    defaultValues: metadata.getDefaultValue(dataSource),
  })

  useEffect(() => {
    if (isOpen) {
      methods.reset(metadata.getDefaultValue(dataSource))
    }
  }, [dataSource, isOpen])

  const onSubmit = async (data: TFormValues) => {
    if (dataSource) {
      const res = await proxyService.put(`${metadata.update?.url}/${dataSource.id}`, data)
      if (res.status === 200 || res.status === 201) {
        const content = res.data
        setIsOpen(!isOpen)
        whenClose(content)
      }
     
    }
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
          <DialogTitle>Edit</DialogTitle>
        </DialogHeader>

        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
            {typeof metadata.update?.component === "function"
              ? metadata.update?.component(dataSource)
              : ""}

            <DialogFooter>
              <Button
                type="submit"
                onClick={(e) => {
                  console.log("check this method again", methods.getValues())
                }}
              >
                Save changes
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}
