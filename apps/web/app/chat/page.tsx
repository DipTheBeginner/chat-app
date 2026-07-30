import Sidebar from "../../components/Sidebar"

export default function ChatPage() {
  return (
    <div className="h-screen flex">
      <Sidebar/>

      <div className="flex-1 flex flex-col">
        <div className="h-16 border-b flex items-center px-6">
          Chat Header
        </div>

        <div className="flex-1 p-5">
          Messages
        </div>

        <div className="border-t p-4">
          Message Input
        </div>
      </div>
    </div>
  );
}