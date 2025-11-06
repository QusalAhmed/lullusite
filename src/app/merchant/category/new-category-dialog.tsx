// ShadCN
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

// Local
import NewCategoryForm from './new-category-form'

export default function NewCategoryDialog() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">Add Category</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] px-0 md:px-6">
                <DialogHeader>
                    <DialogTitle>Add New Category</DialogTitle>
                    <DialogDescription>
                        New category description.
                    </DialogDescription>
                </DialogHeader>

                {/* Scroll only the dialog body so header/footer remain visible */}
                <ScrollArea className="max-h-[60vh] mt-2">
                    <NewCategoryForm />
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}
