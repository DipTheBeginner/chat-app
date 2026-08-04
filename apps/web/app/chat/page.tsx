"use client"

import { useEffect, useState } from "react";
import MessageBox from "../../components/MessageBox";
import Sidebar from "../../components/Sidebar"
import CreateGroupModal from "../../components/CreateGroupModal";
import { createGroup, getMyGroups } from "../api/groups";
import { getSocket } from "../lib/socket";







export default function ChatPage() {

  type Group = {
    id: string;
    name: string;
  };

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [groupName, setGroupName] = useState("");
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

    const socket = getSocket();

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      console.log("Websocket", data)
    }
  }, []);



  async function handleCreateGroup() {
    try {
      if (!groupName.trim()) {
        return;
      }

      const data = await createGroup(groupName);

      console.log(data);

      if (data.success) {
        setGroups((prev) => [...prev, data.group]);
        setShowCreateModal(false);
        setGroupName("");
      }
    } catch (error) {
      console.error(error);
    }
  }



  return (
    <div className="h-screen flex">
      <Sidebar
        onCreateGroup={() => setShowCreateModal(true)}
        groups={groups}

      />

      <div className="flex-1 flex flex-col">
        <div className="h-16 border-b flex items-center px-6">
          Chat Header
        </div>

        <div className="flex-1">
          <MessageBox />
        </div>

        <div className="border-t p-4">

        </div>
      </div>

      {showCreateModal && (
        <CreateGroupModal
          groupName={groupName}
          setGroupName={setGroupName}
          onClose={() => {
            setShowCreateModal(false);
            setGroupName("");
          }}
          onCreate={handleCreateGroup}
        />
      )}
    </div>
  );
}