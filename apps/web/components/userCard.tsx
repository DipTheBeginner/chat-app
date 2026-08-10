

type Props = {

    id: string,
    name: string,
    onClick: () => void,
    isSelected: boolean,

}



export default function UserCard({ id, name, onClick, isSelected }: Props) {



    return (
        <button
            onClick={onClick}
            className={`w-full text-left px-4 py-3 text-slate-100 font-medium rounded-lg transition-colors duration-200 ${isSelected ? "bg-[#242526]" : "hover:bg-[#242526]/50"}`}
        >
            {name}
        </button>
    )



}