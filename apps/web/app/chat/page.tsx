"use client"

import { useEffect, useState } from "react";
import MessageBox from "../../components/MessageBox";
import Sidebar from "../../components/Sidebar"
import CreateGroupModal from "../../components/CreateGroupModal";
import { addMember, createGroup, getMyGroups } from "../api/groups";
import { getSocket } from "../lib/socket";
import AddMemmberModal from "../../components/AddMemberModal";







export default function ChatPage() {

  type Group = {
    id: string;
    name: string;
  };

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null)
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [memberEmail, setMemberEmail] = useState("");

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



  async function handleCreateGroup() {
    console.log("Add Member clicked");
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

  async function handleAddMember() {

    if (!selectedGroup) return;

    if (!memberEmail.trim()) return;

    try {


      const data = await addMember(
        selectedGroup,
        memberEmail

      )

      console.log(data);

      if (data.success) {
        setShowAddMemberModal(false);
        setMemberEmail("")
      }
    } catch (error) {
      console.log(error)

    }
  }



  return (
    <div className="min-h-screen flex">
      <Sidebar
        onCreateGroup={() => setShowCreateModal(true)}
        groups={groups}
        selectedGroup={selectedGroup}
        setSelectedGroup={setSelectedGroup}

      />

      <div className="flex-1 flex flex-col">
        <div className="h-16 border-b flex items-center justify-between px-6">
          <h2>Chat</h2>

          <button onClick={() => setShowAddMemberModal(true)}>
            Add Member
          </button>
        </div>

        <div className="flex-1">
          <MessageBox selectedGroup={selectedGroup} />
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

      {showAddMemberModal && (
        <AddMemmberModal
          email={memberEmail}
          setEmail={setMemberEmail}
          onClose={() => {
            setShowAddMemberModal(false);
            setMemberEmail("")
          }}

          onAdd={handleAddMember}

        />
      )}
    </div>
  );
}