"use client"

import { usePathname } from "next/navigation"
import { ThemeToggle } from "./ThemeToggle"

const BreadCumb = () => {
  const pathname = usePathname()
  const breadCumbValue = pathname.split("/").slice(1)
  console.log(pathname.split("/"))
  return (
    <div className="block border-b-2">
      <div className="flex flex-row m-2 ">
        <div className="flex-grow">
          {breadCumbValue.map((item, index) => {
            return (
              <span>
                {item}
                {index == breadCumbValue.length - 1 ? "" : " / "}
              </span>
            )
          })}
        </div>
        <div className="mr-4">
          <ThemeToggle />
        </div>
      </div>
    </div>
  )
}

export default BreadCumb
