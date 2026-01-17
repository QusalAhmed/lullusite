// components/settings-panel.tsx
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

const SettingsPanel = () => {
    return (
        <div className="mt-2 rounded-md bg-black/5 px-4 py-4 space-y-4">

            {/* Header */}
            <div className="flex items-center justify-between pb-2">
                <span className="text-sm font-medium">Selected</span>
                <Badge variant="default" className="text-xs">
                    Selected
                </Badge>
            </div>

            {/* Slider */}
            <div className="space-y-2">
                <Label>Prop</Label>
                <Slider
                    defaultValue={[7]}
                    min={7}
                    max={50}
                    step={1}
                />
            </div>

            {/* Delete Button */}
            <Button variant="secondary" className="w-full">
                Delete
            </Button>

        </div>
    )
}

export default SettingsPanel