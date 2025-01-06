"use client"

import { Fragment, useEffect, useState } from "react"
import { DatePickerCustom } from "@/components/common/DatePicker"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SavingRegulation } from "@/app/pages/regulations/page"
import proxyService from "../../../../utils/proxyService"

export default function MonthlyReport() {
  const [date, setDate] = useState<Date>(new Date())
  const [dayStats, setDayStats] = useState<any>([])
  const [latestRegulation, setLatestRegulation] = useState<SavingRegulation | null>(null)
  const [selectedType, setSelectedType] = useState<string>("")
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
          setSelectedType(content.savingTypes[0].term.toString())
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
            <SelectItem key={`dropdown-${index}`} value={item.term.toString()}>
              {item.term === 0
                ? `Demand deposit - ${item.interestRate}%`
                : `Term: ${item.term} months - ${item.interestRate}%`}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    )
  }

  // Uncomment and implement fetchDailyReport when ready
  // const fetchDailyReport = async (date: Date) => {
  //   try {
  //     const response = await proxyService.get("/saving-book/dashboard-month-stats", {
  //       params: { time: date.toISOString() }
  //     })
  //     setDayStats(response.data)
  //   } catch (err) {
  //     console.error("Error fetching daily report:", err)
  //   }
  // }

  // useEffect(() => {
  //   if (date) {
  //     fetchDailyReport(date)
  //   }
  // }, [date])

  return (
    <Fragment>
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
                <TableHead className="font-medium">Saving Type</TableHead>
                <TableHead className="text-right font-medium">Income</TableHead>
                <TableHead className="text-right font-medium">Outcome</TableHead>
                <TableHead className="text-right font-medium">Difference</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dayStats?.map((item: any, i: number) => (
                <TableRow key={i}>
                  <TableCell className="text-center text-base">{i + 1}</TableCell>
                  <TableCell className="text-base">{item.RegulationType}</TableCell>
                  <TableCell className="text-right text-base">{item.Income}</TableCell>
                  <TableCell className="text-right text-base">{item.Outcome}</TableCell>
                  <TableCell className="text-right text-base">{Math.round(item.DifferentCount * 100) / 100}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Fragment>
  )
}
