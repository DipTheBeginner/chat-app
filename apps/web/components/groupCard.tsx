type Props = {
  id: string;
  name: string;
  onClick: () => void;
};

export default function GroupCard({
  name,
  onClick,
}: Props) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left p-4 border-b bg-red-600"
    >
      {name}
    </button>
  );
}