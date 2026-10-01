import React, { useState } from 'react';
import {
  Search,
  CheckCircle,
  XCircle,
  Edit2,
  Trash2,
  Eye,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react';
import {
  useUsersList,
  useUserDetails,
  useToggleUserStatus,
  useUpdateUserPlan,
  useDeleteUser,
} from '../hooks';
import type { UserItem } from '../types/admin';
import { Badge } from '../components/Common/Badge';
import { Modal } from '../components/Common/Modal';
import { Skeleton } from '../components/Common/Skeleton';
import { toast } from 'sonner';

const UsersSkeleton: React.FC = () => (
  <div className="space-y-6 animate-pulse">
    {/* Header Skeleton */}
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="space-y-2">
        <Skeleton className="h-6 w-56" />
        <Skeleton className="h-3.5 w-72" />
      </div>
      <Skeleton className="h-9 w-28 rounded-xl" />
    </div>

    {/* Filter and Search Bar Skeleton */}
    <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800 rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      <Skeleton className="h-9 w-full rounded-xl" />
      <Skeleton className="h-9 w-full rounded-xl" />
      <Skeleton className="h-9 w-full rounded-xl" />
      <Skeleton className="h-9 w-full rounded-xl" />
    </div>

    {/* Table Skeleton */}
    <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
      <div className="px-5 py-3.5 bg-slate-50 dark:bg-zinc-950/60 border-b border-slate-200/60 dark:border-zinc-800 flex items-center justify-between">
        <Skeleton className="h-3.5 w-32" />
        <Skeleton className="h-3.5 w-16" />
      </div>
      <div className="divide-y divide-slate-100 dark:divide-zinc-800/80">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div key={idx} className="px-5 py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Skeleton className="w-9 h-9 rounded-full shrink-0" />
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-40" />
              </div>
            </div>
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-14 rounded-full" />
            <Skeleton className="h-3.5 w-36" />
            <Skeleton className="h-6 w-20 rounded-full" />
            <div className="flex gap-1.5">
              <Skeleton className="w-7 h-7 rounded-lg" />
              <Skeleton className="w-7 h-7 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const Users: React.FC = () => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // Modals
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);
  const [userToModify, setUserToModify] = useState<UserItem | null>(null);
  const [showPlanModal, setShowPlanModal] = useState<boolean>(false);
  const [newPlan, setNewPlan] = useState<string>('FREE');
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

  // TanStack Query Hooks
  const queryParams = {
    page,
    limit: 15,
    search: searchTerm.trim() || undefined,
    role: selectedRole || undefined,
    plan: selectedPlan || undefined,
    status: selectedStatus || undefined,
  };

  const { data, isLoading, isFetching, refetch } = useUsersList(queryParams);
  const { data: userDetails, isLoading: isDetailLoading } = useUserDetails(
    showDetailModal ? selectedUserId : null,
  );

  const toggleStatusMutation = useToggleUserStatus();
  const updatePlanMutation = useUpdateUserPlan();
  const deleteUserMutation = useDeleteUser();

  const users = data?.users || [];
  const pagination = data?.pagination || { page: 1, limit: 15, total: 0, totalPages: 1 };

  const handleToggleStatus = async (user: UserItem) => {
    const newStatus = !user.isActive;
    try {
      await toggleStatusMutation.mutateAsync({ id: user.id, isActive: newStatus });
      toast.success(`User ${user.email} ${newStatus ? 'activated' : 'suspended'}`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to update user status');
    }
  };

  const handleOpenPlanModal = (user: UserItem) => {
    setUserToModify(user);
    setNewPlan(user.plan);
    setShowPlanModal(true);
  };

  const handleSavePlan = async () => {
    if (!userToModify) return;
    try {
      await updatePlanMutation.mutateAsync({ id: userToModify.id, plan: newPlan });
      toast.success(`Plan upgraded to ${newPlan} for ${userToModify.name}`);
      setShowPlanModal(false);
    } catch (err: any) {
      toast.error(err.message || 'Failed to update plan');
    }
  };

  const handleOpenDetails = (userId: string) => {
    setSelectedUserId(userId);
    setShowDetailModal(true);
  };

  const handleDeleteUser = async () => {
    if (!userToModify) return;
    try {
      await deleteUserMutation.mutateAsync(userToModify.id);
      toast.success(`User ${userToModify.email} removed`);
      setShowDeleteModal(false);
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete user');
    }
  };

  if (isLoading && !data) {
    return <UsersSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-zinc-50 tracking-tight">
            Platform User Management
          </h2>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
            Total {pagination.total} registered users across all client workspaces
          </p>
        </div>

        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="self-start sm:self-auto flex items-center gap-2 px-3 py-2 bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700 text-slate-600 hover:text-slate-900 dark:text-zinc-300 dark:hover:text-white rounded-xl text-xs font-medium transition cursor-pointer disabled:opacity-50 shadow-2xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin text-sky-500' : ''}`} />
          <span>Refresh List</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800 rounded-2xl p-4 shadow-sm shadow-slate-200/40 dark:shadow-black/40 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400 dark:text-zinc-500 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            placeholder="Search by name or email..."
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-xs text-slate-900 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 outline-none transition"
          />
        </div>

        {/* Role Filter */}
        <select
          value={selectedRole}
          onChange={(e) => {
            setSelectedRole(e.target.value);
            setPage(1);
          }}
          className="px-3 py-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-xs text-slate-800 dark:text-zinc-200 focus:border-sky-500 outline-none transition"
        >
          <option value="">All Roles (Owners & Members)</option>
          <option value="OWNER">Workspace Owners Only</option>
          <option value="MEMBER">Members / Agents Only</option>
          <option value="ADMIN">Admins Only</option>
        </select>

        {/* Plan Filter */}
        <select
          value={selectedPlan}
          onChange={(e) => {
            setSelectedPlan(e.target.value);
            setPage(1);
          }}
          className="px-3 py-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-xs text-slate-800 dark:text-zinc-200 focus:border-sky-500 outline-none transition"
        >
          <option value="">All Subscription Tiers</option>
          <option value="FREE">Free Tier</option>
          <option value="STARTER">Starter Tier</option>
          <option value="PRO">Pro Tier</option>
          <option value="BUSINESS">Business Tier</option>
        </select>

        {/* Status Filter */}
        <select
          value={selectedStatus}
          onChange={(e) => {
            setSelectedStatus(e.target.value);
            setPage(1);
          }}
          className="px-3 py-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-xs text-slate-800 dark:text-zinc-200 focus:border-sky-500 outline-none transition"
        >
          <option value="">All Account Statuses</option>
          <option value="active">Active Accounts Only</option>
          <option value="suspended">Suspended Accounts Only</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm shadow-slate-200/40 dark:shadow-black/40">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-zinc-950/60 text-slate-500 dark:text-zinc-400 uppercase tracking-wider font-semibold border-b border-slate-200/60 dark:border-zinc-800">
              <tr>
                <th className="px-5 py-3.5">User Profile</th>
                <th className="px-5 py-3.5">Role</th>
                <th className="px-5 py-3.5">Plan Tier</th>
                <th className="px-5 py-3.5">Workspace Activity</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/80">
              {isLoading ? (
                Array.from({ length: 6 }).map((_, idx) => (
                  <tr key={idx} className="animate-in fade-in duration-200">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <Skeleton className="w-9 h-9 rounded-full shrink-0" />
                        <div className="space-y-1.5 min-w-0">
                          <Skeleton className="h-4 w-28 rounded" />
                          <Skeleton className="h-3 w-40 rounded" />
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <Skeleton className="h-5 w-16 rounded-full" />
                    </td>
                    <td className="px-5 py-4">
                      <Skeleton className="h-5 w-14 rounded-full" />
                    </td>
                    <td className="px-5 py-4">
                      <Skeleton className="h-3.5 w-36 rounded" />
                    </td>
                    <td className="px-5 py-4">
                      <Skeleton className="h-6 w-20 rounded-full" />
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Skeleton className="w-7 h-7 rounded-lg" />
                        <Skeleton className="w-7 h-7 rounded-lg" />
                        <Skeleton className="w-7 h-7 rounded-lg" />
                      </div>
                    </td>
                  </tr>
                ))
              ) : users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/60 dark:hover:bg-zinc-800/40 transition-colors">
                    {/* User profile */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 flex items-center justify-center font-bold text-slate-700 dark:text-zinc-200 shrink-0">
                          {user.name?.charAt(0) || 'U'}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 dark:text-zinc-100 truncate">{user.name}</p>
                          <p className="text-[11px] text-slate-400 dark:text-zinc-500 font-mono truncate">{user.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="px-5 py-4">
                      <Badge variant={user.isOwner ? 'primary' : 'neutral'}>
                        {user.isOwner ? 'OWNER' : user.role}
                      </Badge>
                    </td>

                    {/* Plan */}
                    <td className="px-5 py-4">
                      <Badge variant={user.plan === 'FREE' ? 'neutral' : 'purple'}>
                        {user.plan}
                      </Badge>
                    </td>

                    {/* Workspace stats */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-zinc-400 font-mono">
                        <span title="Widgets">{user.stats.widgetsCount} widgets</span>
                        <span>•</span>
                        <span title="Conversations">{user.stats.conversationsCount} convos</span>
                        <span>•</span>
                        <span title="Messages">{user.stats.messagesCount} msgs</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <button
                        onClick={() => handleToggleStatus(user)}
                        disabled={toggleStatusMutation.isPending}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition cursor-pointer disabled:opacity-50 ${
                          user.isActive
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-500/20 hover:bg-emerald-100 dark:hover:bg-emerald-500/25'
                            : 'bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-400 border border-rose-200/60 dark:border-rose-500/20 hover:bg-rose-100 dark:hover:bg-rose-500/25'
                        }`}
                        title="Click to toggle account status"
                      >
                        {user.isActive ? (
                          <>
                            <CheckCircle className="w-3 h-3" />
                            <span>Active</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3" />
                            <span>Suspended</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Action buttons */}
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenDetails(user.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition cursor-pointer"
                          title="View User Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenPlanModal(user)}
                          className="p-1.5 rounded-lg text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 hover:bg-sky-50 dark:hover:bg-sky-500/10 transition cursor-pointer"
                          title="Upgrade/Change Plan"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setUserToModify(user);
                            setShowDeleteModal(true);
                          }}
                          className="p-1.5 rounded-lg text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition cursor-pointer"
                          title="Delete User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-slate-400 dark:text-zinc-500">
                    No users match your criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {pagination.totalPages > 1 && (
          <div className="px-6 py-3.5 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400 bg-slate-50/50 dark:bg-zinc-950/40">
            <div>
              Showing page {pagination.page} of {pagination.totalPages} ({pagination.total} total
              users)
            </div>
            <div className="flex items-center gap-2">
              <button
                disabled={pagination.page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-700 disabled:opacity-40 transition cursor-pointer shadow-2xs"
              >
                Previous
              </button>
              <button
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-700 disabled:opacity-40 transition cursor-pointer shadow-2xs"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Plan Update Modal */}
      <Modal
        isOpen={showPlanModal}
        onClose={() => setShowPlanModal(false)}
        title={`Change Plan for ${userToModify?.name}`}
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-500 dark:text-zinc-400">
            Select the new subscription tier for <strong>{userToModify?.email}</strong>:
          </p>

          <div className="grid grid-cols-2 gap-2.5">
            {['FREE', 'STARTER', 'PRO', 'BUSINESS'].map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setNewPlan(p)}
                className={`p-3 rounded-xl border text-center transition font-semibold text-xs cursor-pointer ${
                  newPlan === p
                    ? 'bg-sky-50 dark:bg-sky-500/15 border-sky-500 text-sky-700 dark:text-sky-400'
                    : 'bg-slate-50 dark:bg-zinc-950 border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3">
            <button
              onClick={() => setShowPlanModal(false)}
              className="px-4 py-2 rounded-xl text-xs text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSavePlan}
              disabled={updatePlanMutation.isPending}
              className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-sky-500 hover:bg-sky-600 dark:bg-sky-500 dark:hover:bg-sky-400 shadow-sm shadow-sky-500/20 cursor-pointer disabled:opacity-50"
            >
              {updatePlanMutation.isPending ? 'Updating...' : 'Update Tier'}
            </button>
          </div>
        </div>
      </Modal>

      {/* User Details Inspection Modal */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedUserId(null);
        }}
        title="User Workspace Inspection"
        maxWidth="max-w-2xl"
      >
        {isDetailLoading ? (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200/80 dark:border-zinc-800 flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-4 w-36 rounded" />
                <Skeleton className="h-3 w-48 rounded" />
                <div className="flex gap-2 pt-1">
                  <Skeleton className="h-5 w-14 rounded-full" />
                  <Skeleton className="h-5 w-14 rounded-full" />
                  <Skeleton className="h-5 w-14 rounded-full" />
                </div>
              </div>
              <div className="space-y-2">
                <Skeleton className="h-3 w-28 rounded" />
                <Skeleton className="h-3 w-20 rounded" />
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-16 rounded-xl" />
              ))}
            </div>

            <div className="space-y-2">
              <Skeleton className="h-4 w-32 rounded" />
              <Skeleton className="h-12 w-full rounded-lg" />
              <Skeleton className="h-12 w-full rounded-lg" />
            </div>
          </div>
        ) : userDetails ? (
          <div className="space-y-5 text-xs">
            {/* User Profile Card */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200/80 dark:border-zinc-800 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-zinc-100">{userDetails.name}</h4>
                <p className="text-slate-500 dark:text-zinc-400 font-mono">{userDetails.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant={userDetails.role === 'OWNER' ? 'primary' : 'neutral'}>
                    {userDetails.role}
                  </Badge>
                  <Badge variant="purple">{userDetails.plan}</Badge>
                  <Badge variant={userDetails.isActive ? 'success' : 'danger'}>
                    {userDetails.isActive ? 'Active' : 'Suspended'}
                  </Badge>
                </div>
              </div>
              <div className="text-right text-[11px] text-slate-400 dark:text-zinc-500 font-mono">
                <p>Joined: {new Date(userDetails.createdAt).toLocaleDateString()}</p>
                <p>Auth: {userDetails.authMethod}</p>
              </div>
            </div>

            {/* Counts Overview */}
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="p-3 bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-xl">
                <p className="text-slate-400 dark:text-zinc-500 text-[10px] uppercase font-bold">Widgets</p>
                <p className="text-lg font-bold text-slate-900 dark:text-zinc-100">{userDetails._count?.widgets || 0}</p>
              </div>
              <div className="p-3 bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-xl">
                <p className="text-slate-400 dark:text-zinc-500 text-[10px] uppercase font-bold">Conversations</p>
                <p className="text-lg font-bold text-slate-900 dark:text-zinc-100">{userDetails._count?.conversations || 0}</p>
              </div>
              <div className="p-3 bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-xl">
                <p className="text-slate-400 dark:text-zinc-500 text-[10px] uppercase font-bold">Messages</p>
                <p className="text-lg font-bold text-slate-900 dark:text-zinc-100">{userDetails._count?.messages || 0}</p>
              </div>
              <div className="p-3 bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-xl">
                <p className="text-slate-400 dark:text-zinc-500 text-[10px] uppercase font-bold">Visitors</p>
                <p className="text-lg font-bold text-slate-900 dark:text-zinc-100">{userDetails._count?.visitors || 0}</p>
              </div>
            </div>

            {/* Connected Widgets List */}
            <div>
              <h5 className="font-bold text-slate-900 dark:text-zinc-100 mb-2">Connected Widgets</h5>
              <div className="space-y-1.5 max-h-36 overflow-y-auto">
                {userDetails.widgets && userDetails.widgets.length > 0 ? (
                  userDetails.widgets.map((w: any) => (
                    <div
                      key={w.id}
                      className="p-2.5 rounded-lg bg-slate-50 dark:bg-zinc-950/60 border border-slate-200 dark:border-zinc-800 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: w.primaryColor }}
                        />
                        <span className="font-semibold text-slate-800 dark:text-zinc-200">{w.name}</span>
                      </div>
                      <Badge variant={w.aiEnabled ? 'purple' : 'neutral'}>
                        {w.aiEnabled ? 'AI Brain Active' : 'Human Only'}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-400 dark:text-zinc-500 italic">No widgets configured yet</p>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </Modal>

      {/* Delete User Warning Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirm User Deletion"
      >
        <div className="space-y-4">
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
            <div className="text-xs text-rose-800 dark:text-rose-300">
              <p className="font-semibold text-rose-900 dark:text-rose-200">Destructive Action Warning</p>
              <p className="mt-0.5">
                Are you sure you want to permanently delete user{' '}
                <strong className="text-rose-950 dark:text-white">{userToModify?.email}</strong>? All their widgets,
                team memberships, and conversations will be deleted.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="px-4 py-2 rounded-xl text-xs text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteUser}
              disabled={deleteUserMutation.isPending}
              className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 shadow-md shadow-rose-600/30 cursor-pointer disabled:opacity-50"
            >
              {deleteUserMutation.isPending ? 'Deleting...' : 'Permanently Delete User'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
