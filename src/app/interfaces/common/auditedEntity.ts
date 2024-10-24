interface AuditedEntity {
  id?: string
  concurrencyStamp: string
  creationTime: Date
  creatorId?: string

  lastModificationTime: Date
  lastModifierId: string

  isDeleted: boolean
  deletionTime: Date
  deleterId: string

  isActive: boolean
  keyword: string
}
