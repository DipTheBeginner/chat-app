


"use client";

console.log("Sidebar rendered");
import { useEffect, useState } from "react";
import { getMyGroups } from "../app/api/groups";
import GroupCard from "./groupCard";

type Group = {
    id: string;
    name: string;
};

export default function Sidebar() {
    const [groups, setGroups] = useState<Group[]>([]);

    useEffect(() => {
        async function loadGroups() {
            try {
                console.log("Calling getMyGroups");

                const data = await getMyGroups();

                console.log("Received:", data);

                if (data.success) {
                    setGroups(data.groups);
                }
            } catch (error) {
                console.error("Load groups failed:", error);
            }
        }

        loadGroups();
    }, []);

    return (
        <div className="w-80 border-r h-full flex flex-col">
            <div className="p-4 border-b">
                <button className="bg-blue-600 text-white w-full py-2 rounded">
                    + Create Group
                </button>
            </div>

            <div className="flex-1 overflow-y-auto">
                {groups.map((group) => (
                    <GroupCard
                        key={group.id}
                        id={group.id}
                        name={group.name}
                        onClick={() => { }}
                    />
                ))}
            </div>
        </div>
    );
}