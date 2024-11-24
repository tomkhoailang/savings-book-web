"use client"
import { useToast } from "@/hooks/use-toast";
import { Button } from "../ui/button";
import { useSelector } from "react-redux";
import { RootState } from "@/app/reducers/store";
import { useEffect } from "react";

const ToastBar = () => {
  const { toast } = useToast()
  const toastReducer = useSelector((state: RootState) => state.toastReducer)


  useEffect(() => {
    if (toastReducer.isShow) {
      toast({
        title: toastReducer.title,
        variant: toastReducer.variant,
        description: toastReducer.message,
        duration: 1500,
      })
    }

  },[toastReducer])
 
  return null
}

export default ToastBar;