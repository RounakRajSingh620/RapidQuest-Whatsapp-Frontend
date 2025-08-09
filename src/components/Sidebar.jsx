function Sidebar({ users, onSelectUser }) {
  const userList = Object.values(users || {});
  console.log("🧾 Users to show:", userList);

  return (
    <div className="w-1/3 border-r overflow-y-auto">
      <div className="p-4 font-bold text-xl border-b">Chats</div>
      {userList.length === 0 && (
        <div className="p-4 text-gray-500">No chats found.</div>
      )}
      {userList.map((user, index) => (
        <div
          key={index}
          className="p-4 border-b hover:bg-gray-100 cursor-pointer"
          onClick={() => onSelectUser(user)}
        >
          <div className="font-semibold">{user.name}</div>
          <div className="text-sm text-gray-600 truncate">
            {user.messages[user.messages.length - 1]?.text}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Sidebar;
