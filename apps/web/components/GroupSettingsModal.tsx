import { useState } from "react";

import { EllipsisVertical } from "lucide-react";



type Props = {
    isAdmin: boolean;
    onAddMember: () => void
    onLeaveGroup: () => void

}







export default function GroupSettingsModal({ isAdmin, onAddMember, onLeaveGroup }: Props) {

    const [isOpen, setIsOpen] = useState(false);

    return (
        <div>

            <button onClick={() => setIsOpen(!isOpen)} className="bg-amber-50">
                <EllipsisVertical />
            </button>

            {
                isOpen && (

                    <div className="flex flex-col">
                        {isAdmin && (
                            <button onClick={onAddMember} className="cursor-pointer text-slate-50">
                                Add Member
                            </button>
                        )}

                        <button onClick={onLeaveGroup} className="text-slate-50">
                            Leave Group
                        </button>
                    </div>


                )
            }



        </div>
    )


}