import React, { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import { router, usePage } from "@inertiajs/react"
import { toast } from "sonner"

// SHADCN DIALOG
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

export default function ActionDropdown({ ticket }) {
  const { auth } = usePage().props;
  const userRole = auth?.user?.role;

  const isClosed = ticket.status?.toLowerCase() === "closed";

  const [openDialog, setOpenDialog] = useState(false);

  const handleDelete = () => {
    router.delete(route("ticket.delete", ticket.ticket_number), {
      onSuccess: () => {
        toast.success("Ticket deleted successfully");
        setOpenDialog(false);
      },
      onError: () => {
        toast.error("Failed to delete ticket");
      }
    })
  };

  return (
    <>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() =>
                window.location.href = route("ticket.view", ticket.ticket_number)
              }
            >
              View Ticket
            </DropdownMenuItem>

            {!isClosed && (
              <DropdownMenuItem
                onClick={() =>
                  router.visit(
                    route("ticket.update", {
                      ticket_number: ticket.ticket_number,
                    })
                  )
                }
              >
                Update Ticket
              </DropdownMenuItem>
            )}

            {/* DELETE (ADMIN ONLY) */}
            {userRole === "admin" && (
              <DropdownMenuItem
                className="text-red-600 focus:text-red-600"
                onClick={() => setOpenDialog(true)}
              >
                Delete Ticket
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* DIALOG KONFIRMASI DELETE */}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Ticket?</DialogTitle>
            <DialogDescription>
              Ticket <b>{ticket.ticket_number}</b> akan dihapus secara permanen.
              Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpenDialog(false)}>
              Cancel
            </Button>

            <Button
              variant="destructive"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
