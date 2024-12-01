"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Bell, BellDot, BellIcon, Check } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/app/contexts/authContext"
import proxyService from "../../../utils/proxyService"
import { ToastAction } from "../ui/toast"
import { ScrollArea } from "../ui/scroll-area"
import { Button } from "@nextui-org/react"
import moment from "moment"
import { Skeleton } from "../ui/skeleton"
import { useSelector } from "react-redux"
import { RootState } from "@/app/reducers/store"
import { WITH_DRAW_STATUS } from "../../../utils/socket.enum"
export interface Notification extends AuditedEntity {
  userId: string
  message: string
  isRead: boolean
  status: string
  transactionTicketId: string
}

const Notification = () => {
  const [data, setData] = useState<Notification[]>([])
  const [paginate, setPaginate] = useState({ current: 1, size: 10 })
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const scrollAreaRef = useRef(null)
  const observerRef = useRef(null)
  const socketReducer = useSelector((root: RootState) => root.socketReducer)
  const {toast} = useToast()

  const fetchData = async () => {
    setLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 1000))

    const res = await proxyService.get(
      `/notification?Skip=${(paginate.current - 1) * paginate.size}&Max=${
        paginate.size
      }`
    )

    const content = res.data

    if (res.status === 200) {
      if (content.totalCount !== totalCount) {
        setTotalCount(content.totalCount)
      }
      setLoading(false)

      if (paginate.current !== 1) {
        const respNotifications = (content.items as Notification[]) ?? []
        setData([...data, ...respNotifications])
      } else {
        setData((content.items as Notification[]) ?? [])
      }
    }
  }

  const onMarkAsRead = async (notificationId: string | undefined) => {
    if (notificationId) {
      await proxyService.put(`/notification/${notificationId}`, {})

      const nData = data.map((item) => {
        if (item.id === notificationId) {
          item.isRead = true
        }
        return item
      })
      setData(nData)
    }
  }
  const onMarkAllAsRead = async () => {

    if (data.filter((item) => item.isRead === false).length > 0) {
      await proxyService.put(`/notification`, {})

      const nData = data.map((item) => {
        item.isRead = true
        return item
      })
      setData(nData)
    }
  }

  const onLoadMore = () => {
    setPaginate((prev) => ({ ...prev, current: prev.current + 1 }))
  }

  useEffect(() => {
    fetchData()
  }, [paginate])

  useEffect(() => {
    if (loading) return

    if (paginate.current !== 1 && observerRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (
            entries[0].isIntersecting &&
            totalCount - paginate.current * paginate.size > 0
          ) {
            onLoadMore()
          }
        },
        { root: scrollAreaRef.current, threshold: 1.0 }
      )

      observer.observe(observerRef.current)

      return () => observer.disconnect()
    }
  }, [loading, paginate, totalCount])

  useEffect(() => {

    if (socketReducer.type === WITH_DRAW_STATUS) {

      console.log("new data", socketReducer.data);
      
      const newData = socketReducer.data as Notification

      setData((prev) => [newData, ...prev])
        setTotalCount((prev) => prev + 1)
        toast({
          title: "Important Update!",
          description: newData.message,
          action: (
            <ToastAction
              altText="Mark as read"
              onClick={() => {
                onMarkAsRead(newData.id)
              }}
            >
              Mark as read
            </ToastAction>
          ),
        })
    }

   

   
  }, [socketReducer])

  return (
    <div>
      <Sheet>
        <SheetTrigger>
          {data.filter((n) => !n.isRead).length > 0 ? (
            <BellDot className="text-sm text-yellow-500" />
          ) : (
            <Bell className="text-sm" />
          )}
        </SheetTrigger>
        <SheetContent>
          <SheetTitle>Notification</SheetTitle>
          <SheetDescription className="text-sm mb-2">
            You have {data.filter((n) => !n.isRead).length} unread messages
          </SheetDescription>
          <div
            className="text-sm flex flex-row items-center cursor-pointer hover:text-blue-300"
            onClick={() => {
              onMarkAllAsRead()
            }}
          >
            <Check />
            <div>Mark all as read</div>
          </div>
          <div className="h-5/6 w-full">
            <ScrollArea className="h-full" ref={scrollAreaRef}>
              <div className="py-4">
                {data.map((notification, index) => (
                  <div
                    key={index}
                    className="mb-4 grid grid-cols-[25px_1fr] items-start last:mb-0"
                  >
                    <span
                      className={`flex h-2 w-2 translate-y-1.5 rounded-full ${
                        notification.isRead ? "bg-gray-300" : "bg-sky-500"
                      }`}
                    />
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {notification.message}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Reference: {notification.transactionTicketId}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {moment(notification.creationTime).fromNow()}
                      </p>
                    </div>
                  </div>
                ))}

                {loading ? (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-4">
                      <span
                        className={`flex h-2 w-2 translate-y-1.5 rounded-full bg-gray-300`}
                      />
                      <div className="space-y-2 w-full">
                        <Skeleton className="h-4 w-2/4" />
                        <Skeleton className="h-4 w-5/6" />
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span
                        className={`flex h-2 w-2 translate-y-1.5 rounded-full bg-gray-300`}
                      />
                      <div className="space-y-2 w-full">
                        <Skeleton className="h-4 w-2/4" />
                        <Skeleton className="h-4 w-5/6" />
                      </div>
                    </div>
                  </div>
                ) : (
                  ""
                )}
                <div ref={observerRef} />
              </div>
            </ScrollArea>
            {paginate.current === 1 && totalCount !== 0 ? (
              <Button
                className="w-full bg-gray-600 text-white"
                onClick={() => onLoadMore()}
              >
                Load more here
              </Button>
            ) : (
              ""
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
export default Notification
