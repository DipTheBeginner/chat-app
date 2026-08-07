



type props = {
    email: string,
    setEmail: React.Dispatch<React.SetStateAction<string>>;
    onClose: () => void;
    onAdd: () => void;
}


export default function AddMemberModal({ email, setEmail, onClose, onAdd }: props) {


    return (

        <div className="fixed inset-0 flex items-center justify-center bg-black/40">
            <div className="w-100 rounded-lg bg-white p-6 shadow-xl">
                <span className="text-[#4683E3] text-lg font-semibold">
                    Add the member
                </span>

                <input
                    className="w-full mt-4 outline-none"
                    type="text"
                    placeholder="Name the User"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <div className="mt-6 flex justify-end gap-3">
                    <button onClick={onClose}>Close</button>
                    <button onClick={onAdd}>Add</button>
                </div>
            </div>
        </div>


    )

}