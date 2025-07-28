import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"

import { deletePocketItem } from "./delete-pocket-item.action"

export function DeletePocketItemDialog({
  open,
  onOpenChange,
  onSuccess,
  id,
  name
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: (id: string) => void
  id: string
  name: string
}) {
  const handleDelete = () => {
    deletePocketItem(id)
    onSuccess(id)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Delete Pocket Tag
          </DialogTitle>
        </DialogHeader>
        <p>
          Are you sure you would like to delete pocket item{" "}
          <span className="text-destructive">{name}</span>?{" "}
          This action cannot be undone.
        </p>
        <div className="flex gap-x-2 ml-auto">
          <Button 
            variant="ghost"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button 
            variant="destructive"
            onClick={handleDelete}
          >
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}