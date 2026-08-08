


"use client";

import GroupCard from "./groupCard";
import { getSocket } from "../app/lib/socket";


type Group = {
    id: string;
    name: string;
};


type props = {
    onCreateGroup: () => void;
    groups: Group[]
    selectedGroup: string | null;
    setSelectedGroup: React.Dispatch<React.SetStateAction<string | null>>;
}





export default function Sidebar({ onCreateGroup,
    groups,
    selectedGroup,
    setSelectedGroup, }: props) {



    async function handleGroupClick(groupId: string) {
        setSelectedGroup(groupId)
        const socket = await getSocket();


            socket.send(
                JSON.stringify({
                    type: "join-group",
                    groupId
                })
            )


    }





    return (
        <div className="w-80 border-r h-full flex flex-col bg-[#171717] border-neutral-800">
            <div className="p-4 border-b border-neutral-800">
                <button onClick={onCreateGroup} className="bg-blue-600 hover:bg-blue-700 transition-colors font-semibold text-white w-full py-2 rounded">
                    + Create Group
                </button>
            </div>

            <div className="flex-1 overflow-y-auto flex flex-col p-2 gap-1">
                {groups.map((group) => (
                    <GroupCard
                        key={group.id}
                        id={group.id}
                        name={group.name}
                        onClick={() => handleGroupClick(group.id)}
                        isSelected={selectedGroup === group.id}
                    />
                ))}
            </div>

        </div>
    );
}