// components/topbar.tsx
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export const Topbar = () => {
    return (
        <div className="mt-3 mb-1 flex items-center justify-between rounded-md bg-[#cbe8e7] px-2 py-2">

            {/* Enable Switch */}
            <div className="flex items-center space-x-2">
                <Switch id="enable" defaultChecked />
                <Label htmlFor="enable" className="text-sm">
                    Enable
                </Label>
            </div>

            {/* Action Button */}
            <Button variant="outline" size="sm">
                Serialize JSON to console
            </Button>

        </div>
    )
}

export default Topbar