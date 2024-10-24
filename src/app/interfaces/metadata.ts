interface Metadata<T> {
  url: string
  createUpdateModal: (data: T) => void
  handleResponseData: (data: T) => void
}
