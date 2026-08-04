


"use client";

import {  useState } from "react";
import GroupCard from "./groupCard";
import { getSocket } from "../app/lib/socket";


type Group = {
    id: string;
    name: string;
};


type props = {
    onCreateGroup: () => void;
    groups: Group[]
}





export default function Sidebar({ onCreateGroup,groups }: props) {

    const [selectedGroups, setSelectedGroups] = useState<string | null>(null)

    function handleGroupClick(groupId: string) {
        setSelectedGroups(groupId);

        const socket = getSocket();

        socket.send(
            JSON.stringify({
                type: "join-group",
                groupId
            })
        )
    }





    return (
        <div className="w-80 border-r h-full flex flex-col">
            <div className="p-4 border-b">
                <button onClick={onCreateGroup} className="bg-blue-600 text-white w-full py-2 rounded">
                    + Create Group
                </button>
            </div>

            <div className="flex-1 overflow-y-auto">
                {groups.map((group) => (
                    <GroupCard
                        key={group.id}
                        id={group.id}
                        name={group.name}
                        onClick={() => handleGroupClick(group.id)}
                    />
                ))}
            </div>

        </div>
    );
}