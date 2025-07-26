import { Button } from "@/components/alignui/button";
import { Loader2 } from "lucide-react";

export function ButtonLoading() {
    return (
        <Button disabled>
            <Loader2 className="animate-spin" />
            Please wait
        </Button>
    )
}

export default ButtonLoading;