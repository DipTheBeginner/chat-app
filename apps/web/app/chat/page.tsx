"use client"

import { useEffect, useState } from "react";
import MessageBox from "../../components/GroupMessageBox";
import Sidebar from "../../components/Sidebar"
import CreateGroupModal from "../../components/CreateGroupModal";
import { addMember, createGroup, getMyGroups } from "../api/groups";
import { getSocket } from "../lib/socket";
import AddMemmberModal from "../../components/AddMemberModal";
import { useRouter } from "next/navigation";







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


  const[selectedUser,setSelectedUser]

  const currentGroup = groups.find(
    (group) => group.id === selectedGroup
  )

  const router=useRouter()

  useEffect(()=>{
    const token=localStorage.getItem("token");

    if(!token){
      router.replace("/signup")
    }
  },[router]);

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
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        onCreateGroup={() => setShowCreateModal(true)}
        groups={groups}
        selectedGroup={selectedGroup}
        setSelectedGroup={setSelectedGroup}

      />



      <div className="flex-1">
        {selectedGroup ? (

          <div className="flex flex-col h-full">

            <div className="bg-slate-950 p-4 flex justify-between px-6 items-center" >

              <span className="text-slate-50 font-semibold text-2xl">
                {currentGroup?.name}
              </span>
              <div className="text-slate-50 font-medium text-lg">
                <button onClick={() => setShowAddMemberModal(true)}>Add Member</button>
              </div>
            </div>

            <div className="flex-1 overflow-hidden">
              <MessageBox selectedGroup={selectedGroup} />
            </div>

          </div>

        ) : selectedUser ? (
          
        )
        
        
        
        
        
        
        :(
          <div className="bg-[#1D1F1F] h-full items-center justify-center flex">
            <p className="text-slate-200">
              Let's connect
            </p>
          </div>

        )

        }
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