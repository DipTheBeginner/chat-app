"use client"

import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar"
import CreateGroupModal from "../../components/CreateGroupModal";
import { addMember, createGroup, getMyGroups, leaveGroup } from "../api/groups";
import AddMemmberModal from "../../components/AddMemberModal";
import { useRouter } from "next/navigation";
import { getUsers } from "../api/chats";
import GroupMessageBox from "../../components/GroupMessageBox";
import PersonalMessageBox from "../../components/PersonalMessageBox";
import { getSocket } from "../lib/socket";
import { getCurrentUserId } from "../api/auth";
import GroupSettingsModal from "../../components/GroupSettingsModal";







export default function ChatPage() {

  type Group = {
    id: string;
    name: string;
    createdBy: string;
  };

  type User = {
    id: string;
    username: string;
    email: string;
  }

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null)
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [memberEmail, setMemberEmail] = useState("");


  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);


  const [myUserId, setMyUserId] =useState <string | null > (null);


  const currentGroup = groups.find(
    group => group.id === selectedGroup
  )
  const currentUser = users?.find(
    user => user.id === selectedUser
  )


  useEffect(()=>{
    setMyUserId(getCurrentUserId());
  },[])

  const isGroupAdmin = currentGroup?.createdBy === myUserId;

  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/signup")
    }
  }, [router]);


  useEffect(() => {
    getSocket().catch((error) => {
      console.error("Failed to connect websocket", error)
    })
  }, [])

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


  useEffect(() => {
    async function loadUsers() {

      try {
        const data = await getUsers();

        console.log("Received", data);


        if (data.success) {
          setUsers(data.users);
        }
      } catch (error) {
        console.error("Load users failed", error);
      }

    }

    loadUsers()
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


  async function handleLeaveGroup() {

    if (!selectedGroup) {
      return;
    }


    try {

      const data = await leaveGroup(selectedGroup);


      console.log("Leave group response", data);


      if (data.success) {

        setGroups((prev) => prev.filter(group => group.id !== selectedGroup));
        setSelectedGroup(null);
      }

      
    } catch (error) {
      console.error("Failed to leave group", error)
    }

  }



  function handleGroupSelect(groupId: string) {
    setSelectedGroup(groupId);
    setSelectedUser(null);
  }

  function handleUserSelect(userId: string) {
    setSelectedUser(userId);
    setSelectedGroup(null);
  }




  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        onCreateGroup={() => setShowCreateModal(true)}
        groups={groups}
        selectedGroup={selectedGroup}
        ongroupselected={handleGroupSelect}


        users={users}
        selectedUser={selectedUser}
        onUserSelected={handleUserSelect}



      />



      <div className="flex-1">
        {selectedGroup ? (

          <div className="flex flex-col h-full">

            <div className="bg-slate-950 p-4 flex justify-between px-6 items-center" >

              <span className="text-slate-50 font-semibold text-2xl">
                {currentGroup?.name}
              </span>

              <div className="flex flex-ro">




                <GroupSettingsModal
                  isAdmin={isGroupAdmin}
                  onAddMember={() => setShowAddMemberModal(true)}
                  onLeaveGroup={handleLeaveGroup}
                />


              </div>



            </div>

            <div className="flex-1 overflow-hidden">
              <GroupMessageBox selectedGroup={selectedGroup} />
            </div>

          </div>

        ) : selectedUser ? (
          <div className="flex flex-col h-full">

            <div className="bg-slate-950 p-4 flex justify-between px-6 items-center">

              <span className="text-slate-50 font-semibol text-2xl">
                {currentUser?.username}
              </span>

            </div>

            <div className="flex-1 overflow-hidden">
              <PersonalMessageBox selectedUser={selectedUser} />

            </div>

          </div>
        )

          : (
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