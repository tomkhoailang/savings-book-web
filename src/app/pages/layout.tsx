import LeftSideBar from "@/components/custom/Sidebar"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <LeftSideBar />
      {children}
    </>
  )
}
