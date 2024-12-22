"use client"
import MonthPicker from "@/components/common/MonthPicker"
import DailyReport from "@/components/pages/dashboard/DailyReport"
import MonthlyReport from "@/components/pages/dashboard/MonthlyReport"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useEffect, useState } from "react"
import proxyService from "../../../../utils/proxyService"
import { SavingRegulation } from "../regulations/page"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DatePickerCustom } from "@/components/common/DatePicker"
import moment from "moment"

const Dashboard = () => {
  const [date, setDate] = useState<Date>(new Date())
  const [dayStats, setDayStats] = useState<any>([])
  const [latestRegulation, setLatestRegulation] = useState<SavingRegulation | null>(null)
  const [selectedType, setSelectedType] = useState<any>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    fetchLatestSavingType()
  }, [])

  const fetchLatestSavingType = async () => {
    try {
      setIsLoading(true)
      const response = await proxyService.get("/regulation/latest")
      const content = response.data
      if (content) {
        setLatestRegulation(content)
        if (content.savingTypes.length > 0) {
          setSelectedType(content.savingTypes[0].term.toString() + "-" + content.savingTypes[0].interestRate.toString())
        }
      }
    } catch (err) {
      console.error("Error fetching latest saving type:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const renderTypeOptions = () => {
    if (!latestRegulation) {
      return null
    }

    return (
      <Select value={selectedType} onValueChange={setSelectedType}>
        <SelectTrigger className="w-[250px]">
          <SelectValue placeholder="Select a saving type" />
        </SelectTrigger>
        <SelectContent>
          {latestRegulation.savingTypes.map((item, index) => (
            <SelectItem key={`dropdown-${index}`} value={item.term.toString() + "-" + item.interestRate.toString()}>
              {item.term === 0
                ? `Demand deposit - ${item.interestRate}%`
                : `Term: ${item.term} months - ${item.interestRate}%`}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    )
  }

  const fetchDailyReport = async () => {
    try {
      const arr = selectedType.split("-")
      const newDate = new Date(date)
      newDate.setHours(newDate.getHours() + 7)
      const response = await proxyService.get(`/saving-book/dashboard-month-stats`, {
        time: new Date(newDate).toISOString(),
        regulationId: latestRegulation?.id || "",
        term: arr[0],
        interestRate: arr[1],
      })

      setDayStats(response.data)
    } catch (err) {
      console.error("Error fetching daily report:", err)
    }
  }

  useEffect(() => {
    if (selectedType) {
      fetchDailyReport()
    }
  }, [selectedType, date])

  return (
    <Tabs defaultValue="account">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="account">Daily Report</TabsTrigger>
        <TabsTrigger value="password">Monthly Report</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <DailyReport />
      </TabsContent>
      <TabsContent value="password">
        <Card className="max-w-4xl mx-auto">
          <CardHeader className="bg-primary text-primary-foreground py-2">
            <CardTitle className="text-center text-lg font-semibold">Monthly Report</CardTitle>
          </CardHeader>
          <CardContent className="my-4">
            <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
              <div className="flex items-center">
                <span className="mr-2 whitespace-nowrap">Saving type:</span>
                {isLoading ? <div className="w-[250px] h-10 bg-muted animate-pulse rounded" /> : renderTypeOptions()}
              </div>
              <div className="flex items-center">
                <span className="mr-2">Date:</span>
                <DatePickerCustom date={date} setDate={setDate} type="month" />
              </div>
            </div>
            <Table className="mt-4">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16 text-center font-medium">Number</TableHead>
                  <TableHead className="font-medium">Date</TableHead>
                  <TableHead className="text-right font-medium">Open</TableHead>
                  <TableHead className="text-right font-medium">Closed</TableHead>
                  <TableHead className="text-right font-medium">Difference</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dayStats?.map((item: any, i: number) => (
                  <TableRow key={i}>
                    <TableCell className="text-center text-base">{i + 1}</TableCell>
                    <TableCell className="text-base">{moment(item.currentDate).format("DD/MM/YYYY")}</TableCell>
                    <TableCell className="text-right text-base">{item.OpenCount}</TableCell>
                    <TableCell className="text-right text-base">{item.ClosedCount}</TableCell>
                    <TableCell className="text-right text-base">{item.Difference}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

export default Dashboard
