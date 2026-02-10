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

export default function UserTable({ users }: { users: Profile[] }) {
  return (
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
              <TableHead className="text-right italic text-muted-foreground max-w-30">
                Created at
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
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

                <TableCell className="text-right  max-w-30">
                  {formatDateFromISO(user.created_at)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
