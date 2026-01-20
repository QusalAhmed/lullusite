/**
 * v0 by Vercel.
 * @see https://v0.app/t/nZQFipFyQM8
 * Documentation: https://v0.app/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export default function Component() {
    return (
        <Dialog defaultOpen>
            <DialogTrigger asChild>
                <Button variant="outline">Open Dialog</Button>
            </DialogTrigger>
            <DialogContent className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vh] rounded-lg">
                <div className="flex h-full flex-col">
                    <DialogHeader className="border-b p-4">
                        <DialogTitle>Custom Dialog</DialogTitle>
                        <DialogDescription>This is a customized dialog component from the Shadcn UI library.</DialogDescription>
                    </DialogHeader>
                    <div className="flex-1 overflow-auto p-4">
                        <p>You can add any content you want inside the dialog, such as forms, charts, or other components.</p>
                    </div>
                    <DialogFooter className="border-t p-4">
                        <Button variant="outline">Cancel</Button>
                        <Button>Save</Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    )
}