"use client"



type props = {
    groupName: string;
    setGroupName: React.Dispatch<React.SetStateAction<string>>;

    onClose: () => void;
    onCreate: () => void;
}


export default function CreateGroupModal({ groupName,
    setGroupName,
    onClose,
    onCreate, }: props) {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40">
            <div className="w-100 rounded-lg bg-white p-6 shadow-xl">
                <span className="text-[#4683E3] text-lg font-semibold">
                    Create a group
                </span>

                <input
                    className="w-full mt-4 outline-none"
                    type="text"
                    placeholder="Name your group"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                />

                <div className="mt-6 flex justify-end gap-3">
                    <button onClick={onClose}>Cancel</button>
                    <button onClick={onCreate}>Create</button>
                </div>
            </div>
        </div>
    );
}