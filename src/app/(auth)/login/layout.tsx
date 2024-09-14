import GradientBackground from "@/components/custom/gradient-background"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <GradientBackground>{children}</GradientBackground>

}
