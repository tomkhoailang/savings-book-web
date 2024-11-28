import { CheckCircle } from "lucide-react"
import { redirect } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

async function getPaymentStatus(sessionId: string) {
  // This is where you would typically verify the payment with your payment provider
  // For example, with Stripe:
  // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
  // const session = await stripe.checkout.sessions.retrieve(sessionId)
  // return session.payment_status === 'paid'

  // For demo purposes, we'll just return true
  return true
}

export default async function PaymentPage({
  searchParams,
}: {
  searchParams: { session_id?: string }
}) {
  const sessionId = searchParams.session_id ?? "s"

  if (!sessionId) {
    redirect("/")
  }

  const isPaymentSuccessful = await getPaymentStatus(sessionId)

  if (!isPaymentSuccessful) {
    redirect("/payment/failed")
  }

  return (
    <div className="h-full flex justify-center  p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="absolute inset-0 animate-ping rounded-full bg-green-400/20" />
              <CheckCircle className="h-12 w-12 text-green-500 relative" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-green-500">
            Payment Successful!
          </CardTitle>
          <CardDescription>
            Thank you for your payment. Your transaction has been completed.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-gray-50 p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Transaction ID</span>
              <span className="font-medium">{sessionId.slice(0, 16)}...</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Date</span>
              <span className="font-medium">
                {new Date().toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Status</span>
              <span className="font-medium text-green-500">Completed</span>
            </div>
          </div>

        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button
            className="w-full"
            // onClick={() => window.location.href = "/"}
          >
            Return to Dashboard
          </Button>
          <Button
            variant="outline"
            className="w-full"
            // onClick={() => window.print()}
          >
            Download Receipt
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
