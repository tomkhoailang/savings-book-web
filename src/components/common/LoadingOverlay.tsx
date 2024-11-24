import { RootState } from "@/app/reducers/store";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const LoadingOverlay = () => {
  const loadingReducer = useSelector((state: RootState) => state.loadingReducer)
  

  if (!loadingReducer.isLoading) 
    return null;
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-600 opacity-40 ">
      <Loader2 className="animate-spin" size={64}/>
    </div>
  );
}

export default LoadingOverlay;