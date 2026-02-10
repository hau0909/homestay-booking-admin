/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useEffect, useMemo, useState } from "react";
import { Profile } from "@/src/types/profile";
import UserTable from "@/src/components/user/UserTable";
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { getAllCustomer } from "@/src/services/user/getAllCustomers";
import { getAllHosts } from "@/src/services/user/getAllHosts";
import { getAllAdmins } from "@/src/services/user/getAllAdmins";

export default function Page() {
  const [customers, setCustomers] = useState<Profile[] | null>(null);
  const [hosts, setHosts] = useState<Profile[] | null>(null);
  const [admins, setAdmins] = useState<Profile[] | null>(null);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<"customer" | "host" | "admin">(
    "customer",
  );

  const dataByTab = {
    customer: customers,
    host: hosts,
    admin: admins,
  };

  const currentList = dataByTab[activeTab] ?? [];

  const filteredList = useMemo(() => {
    if (!query) return currentList;

    const keyword = query.toLowerCase();

    return currentList.filter(
      (u) =>
        u.full_name?.toLowerCase().includes(keyword) ||
        u.email?.toLowerCase().includes(keyword),
    );
  }, [currentList, query]);

  const fetchCustomers = async () => {
    try {
      const customers = await getAllCustomer();
      if (customers && customers.length > 0) {
        setCustomers(customers);
      }
    } catch (error) {
      console.error("Fetch customers error: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchHosts = async () => {
    try {
      const hosts = await getAllHosts();
      if (hosts && hosts.length > 0) {
        setHosts(hosts);
      }
    } catch (error) {
      console.error("Fetch hosts error: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAdmins = async () => {
    try {
      const admins = await getAllAdmins();
      if (admins && admins.length > 0) {
        setAdmins(admins);
      }
    } catch (error) {
      console.error("Fetch admins error: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    setQuery("");

    switch (activeTab) {
      case "customer":
        fetchCustomers();
        break;

      case "host":
        fetchHosts();
        break;

      case "admin":
        fetchAdmins();
        break;
    }
  }, [activeTab]);

  return (
    <div className="w-full px-6 py-">
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as any)}
        className="w-full"
      >
        {/* Tabs header */}
        <TabsList className="grid w-full grid-cols-3 rounded-xl bg-white p-1">
          <TabsTrigger
            value="customer"
            className="rounded-lg text-sm font-semibold data-[state=active]:bg-[#11009E] data-[state=active]:text-white"
          >
            Customer
          </TabsTrigger>
          <TabsTrigger
            value="host"
            className="rounded-lg text-sm font-semibold data-[state=active]:bg-[#11009E] data-[state=active]:text-white"
          >
            Host
          </TabsTrigger>
          <TabsTrigger
            value="admin"
            className="rounded-lg text-sm font-semibold data-[state=active]:bg-[#11009E] data-[state=active]:text-white"
          >
            Admin
          </TabsTrigger>
        </TabsList>

        <div className="flex justify-end my-3">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="search"
            className="w-100 bg-white rounded-xl text-[#11009E]"
            placeholder="Search by email or name..."
          />
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center mt-40">
            <Loader2 className="animate-spin text-[#11009E]" size={40} />
          </div>
        ) : !filteredList || filteredList.length <= 0 ? (
          <Card className="shadow-md">
            <CardContent className="text-sm text-muted-foreground text-center">
              No user found.
            </CardContent>
          </Card>
        ) : activeTab === "customer" ? (
          <TabsContent value="customer" className="">
            <UserTable users={filteredList} />
          </TabsContent>
        ) : activeTab === "host" ? (
          <TabsContent value="host" className="">
            <UserTable users={filteredList} />
          </TabsContent>
        ) : (
          <TabsContent value="admin" className="">
            <UserTable users={filteredList} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
