"use client"
import { DatePickerCustom } from "@/components/common/DatePicker"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DatePicker } from "@nextui-org/react"
import { useEffect, useState } from "react"
import proxyService from "../../../../utils/proxyService"

export default function DailyReport() {
  const [date, setDate] = useState<Date>(new Date())
  const [dayStats, setDayStats] = useState<any>([])

  const fetchDailyReport = async (date: any) => {
    const response = await proxyService.get("/saving-book/dashboard-day-stats", { time: new Date(date).toISOString() })
    setDayStats(response.data)
  }

  useEffect(() => {
    if (date) {
      fetchDailyReport(date)
    }
  }, [date])

  return (
    <Card className="max-w-4xl mx-auto mb-4 ">
      <CardHeader className="bg-primary text-primary-foreground py-2">
        <CardTitle className="text-center text-lg font-semibold">Daily Report Revenue</CardTitle>
      </CardHeader>
      <CardContent className="my-4">
        <div className="flex justify-center items-center flex-row">
          <span className="mr-2">Date: </span>
          <DatePickerCustom date={date} setDate={setDate} type="normal" />
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
            {dayStats?.map((item: any, i: any) => {
              return (
                <TableRow key={i}>
                  <TableCell className="text-center text-base">{i + 1}</TableCell>
                  <TableCell className="text-base">{item.RegulationType}</TableCell>
                  <TableCell className="text-right text-base">{item.Income}</TableCell>
                  <TableCell className="text-right text-base">{item.Outcome}</TableCell>
                  <TableCell className="text-right text-base">{Math.round(item.DifferentCount * 100) / 100}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
