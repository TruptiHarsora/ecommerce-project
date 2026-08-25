import UserAvatar from "@/components/common/UserAvatar";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import adminService from "@/services/adminService";
import React, { useEffect, useState } from "react";

const User = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedRoles, setSelectedRoles] = useState({});

  const fetchUsers = async () => {
    try {
      const data = await adminService.getAllUsersAdmin(page);
      setUsers(data.users);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const handleRoleUpdate = async (id) => {
    const role = selectedRoles[id];
    if (!role) return;

    await adminService.updateUserRoleAdmin(id, role);

    setUsers((prev) =>
      prev.map((user) => (user._id === id ? { ...user, role } : user)),
    );

    setSelectedRoles((prev) => ({ ...prev, [id]: undefined }));
  };

  const handleBlock = async (id, isBlocked) => {
    await adminService.blockUserAdmin(id, !isBlocked);

    setUsers((prev) =>
      prev.map((user) =>
        user._id === id ? { ...user, isBlocked: !isBlocked } : user,
      ),
    );
  };

  const roleBadge = (role) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-700";
      case "seller":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-blue-100 text-blue-700";
    }
  };

  if (loading) return <div className="trxt-center py-10">Loading ...</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Managment</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm">
            <thead>
              <tr className="border-b text-center">
                <th className="py-2">Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const selectedRole = selectedRoles[user._id] ?? user.role;

                return (
                  <tr key={user._id} className="border-b">
                    {/* <td className='py-4'>{user.name}</td> */}
                    <div className=" py-4 flex items-center gap-3">
                      <UserAvatar
                        user={user}
                        size="w-9 h-9"
                        textSize="text-sm"
                      />

                      <span>{user.name}</span>
                    </div>
                    <td>{user.email}</td>
                    <td>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${roleBadge(user.role)}`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`px-2 py-1 rounded-full text-xs  ${
                          user.isBlocked
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {user.isBlocked ? "Blocked" : "Active"}
                      </span>
                    </td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div className="flex gap-2 justify-center">
                        <select
                          value={selectedRole}
                          onChange={(e) =>
                            setSelectedRoles((prev) => ({
                              ...prev,
                              [user._id]: e.target.value,
                            }))
                          }
                        >
                          <option value="user">User</option>
                          <option value="seller">Seller</option>
                          <option value="admin">Admin</option>
                        </select>
                        <Button
                          className="bg-yellow-500 text-black font-semibold"
                          size="sm"
                          disabled={selectedRole === user.role}
                          onClick={() => handleRoleUpdate(user._id)}
                        >
                          Update
                        </Button>

                        <Button
                          size="sm"
                          variant={user.isBlocked ? "default" : "destructive"}
                          onClick={() => handleBlock(user._id, user.isBlocked)}
                        >
                          {user.isBlocked ? "Unblock" : "Block"}
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center items-center gap-4 mt-6">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage((prev) => prev - 1)}
          >
            Previous
          </Button>

          <span>
            Page {page} of {totalPages}
          </span>

          <Button
            variant="outline"
            disabled={page === totalPages}
            onClick={() => setPage((prev) => prev + 1)}
          >
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default User;
