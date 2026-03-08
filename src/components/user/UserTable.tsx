"use client";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Profile } from "@/src/types/profile";
import { formatDateFromISO } from "@/src/utils/formatDateFromISO";
import React from "react";
/* ===== THÊM IMPORT CHO STATUS ===== */
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { ProfileStatus } from "@/src/types/enums";
import { updateUserStatus } from "@/src/services/user/updateUserStatus";
import toast from "react-hot-toast";

export default function UserTable({ users }: { users: Profile[] }) {
  //THÊM STATE ĐỂ UPDATE UI
  const [userList, setUserList] = React.useState(users);

  //THÊM STATE CHO CONFIRM
  const [selectedUser, setSelectedUser] = React.useState<Profile | null>(null);
  const [newStatus, setNewStatus] = React.useState<ProfileStatus | null>(null);
  const isAdminTable = users[0]?.role === "ADMIN"; //user đầu tiên có role là ADMIN không

  //SYNC DATA KHI TAB HOẶC SEARCH THAY ĐỔI
  React.useEffect(() => {
    setUserList(users);
  }, [users]);

  /* ===== FUNCTION UPDATE STATUS ===== */
  async function handleConfirm() {
    if (!selectedUser || !newStatus) return;

    try {
      await updateUserStatus(selectedUser.id, newStatus);

      /* UPDATE UI KHÔNG CẦN RELOAD */
      setUserList((prev) =>
        prev.map((u) =>
          u.id === selectedUser.id ? { ...u, status: newStatus } : u,
        ),
      );

      toast.success("User status updated");

      setSelectedUser(null);
      setNewStatus(null);
    } catch {
      toast.error("Update failed");
    }
  }
  return (
    <>
      <Card className="shadow-md">
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="italic text-muted-foreground max-w-80">
                  id
                </TableHead>
                <TableHead className="italic text-muted-foreground max-w-80">
                  Fullname
                </TableHead>
                <TableHead className="italic text-muted-foreground max-w-60">
                  Email
                </TableHead>
                <TableHead className="italic text-muted-foreground max-w-40">
                  Phone
                </TableHead>
                <TableHead className="italic text-muted-foreground max-w-40">
  Created at
</TableHead>
                {!isAdminTable && (
                  <TableHead className="text-right italic text-muted-foreground max-w-30">
                    Status
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {userList.map(
                (
                  user, // DÙNG userList THAY VÌ users ĐỂ UPDATE UI SAU KHI THAY ĐỔI STATUS
                ) => (
                  <TableRow key={user.id} className="hover:bg-muted/50 ">
                    <TableCell className="font-medium  max-w-90 line-clamp-1">
                      {user.id}
                    </TableCell>
                    <TableCell className="max-w-80">
                      <span
                        className={
                          !user.full_name ? "text-muted-foreground italic" : ""
                        }
                      >
                        {user.full_name || "No name provided"}
                      </span>
                    </TableCell>

                    <TableCell className="max-w-60">
                      <span
                        className={
                          !user.email ? "text-muted-foreground italic" : ""
                        }
                      >
                        {user.email || "No email available"}
                      </span>
                    </TableCell>

                    <TableCell className="max-w-40">
                      <span
                        className={
                          !user.phone ? "text-muted-foreground italic" : ""
                        }
                      >
                        {user.phone || "No phone number"}
                      </span>
                    </TableCell>

                    <TableCell className="max-w-40">
                      {formatDateFromISO(user.created_at)}
                    </TableCell>
                    {/* ===== THÊM DROPDOWN STATUS ===== */}
                    {!isAdminTable && (
                      <TableCell className="flex justify-end">
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
  <Button
  size="sm"
  variant="outline"
  className={`h-7 w-24 text-xs capitalize rounded-full flex justify-center items-center gap-1 transition-transform hover:scale-95
  ${
    user.status === "active"
      ? "bg-green-100 text-green-700 border-green-200"
      : "bg-red-100 text-red-700 border-red-200"
  }`}
>
  {user.status}
  <ChevronDown className="h-3 w-3 opacity-70" />
</Button>
    </DropdownMenuTrigger>

    <DropdownMenuContent>
      {user.status !== "active" && (
        <DropdownMenuItem
          onClick={() => {
            setSelectedUser(user);
            setNewStatus("active");
          }}
        >
          Active
        </DropdownMenuItem>
      )}

      {user.status !== "banned" && (
        <DropdownMenuItem
          onClick={() => {
            setSelectedUser(user);
            setNewStatus("banned");
          }}
        >
          Ban
        </DropdownMenuItem>
      )}
    </DropdownMenuContent>
  </DropdownMenu>
</TableCell>
                    )}
                  </TableRow>
                ),
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {/* ===== CONFIRM DIALOG ===== */}

      <Dialog
        open={!!selectedUser && !!newStatus}
        onOpenChange={() => {
          setSelectedUser(null);
          setNewStatus(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm status change</DialogTitle>
            <DialogDescription>
              Are you sure you want to change this user's status to{" "}
              <b>{newStatus}</b>?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedUser(null);
                setNewStatus(null);
              }}
            >
              Cancel
            </Button>

            <Button variant="destructive" onClick={handleConfirm}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
