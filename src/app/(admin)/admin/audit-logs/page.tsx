import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { ShieldCheck, History, User } from "lucide-react"

export default async function AuditLogsPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/admin")
  }

  const logs = await prisma.blogAuditLog.findMany({
    orderBy: { timestamp: "desc" },
    include: {
      post: { select: { title: true, slug: true } },
    },
  })

  return (
    <div className="p-6 sm:p-10 bg-slate-950 min-h-screen text-slate-100 space-y-8">
      <div className="flex items-center justify-between border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center space-x-3 mb-1">
            <h1 className="text-3xl font-extrabold text-white">Super Admin Audit Logs</h1>
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Immutable Security Trail</span>
            </span>
          </div>
          <p className="text-sm text-slate-400">Complete historical records of all redirect configuration changes and administrative actions.</p>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
            <tr>
              <th className="py-3.5 px-4">Action</th>
              <th className="py-3.5 px-4">Super Admin User</th>
              <th className="py-3.5 px-4">Target Blog</th>
              <th className="py-3.5 px-4">Old Value</th>
              <th className="py-3.5 px-4">New Value</th>
              <th className="py-3.5 px-4">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {logs.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-500">
                  No audit log entries recorded yet.
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-4 px-4 font-bold text-emerald-400">{log.action}</td>
                  <td className="py-4 px-4">
                    <div className="font-semibold text-white">{log.userEmail}</div>
                    <div className="text-[10px] text-slate-500 font-mono">ID: {log.userId}</div>
                  </td>
                  <td className="py-4 px-4 font-medium text-slate-200">{log.post?.title || "Global System"}</td>
                  <td className="py-4 px-4 font-mono text-slate-400 truncate max-w-[200px]">{log.oldValue || "N/A"}</td>
                  <td className="py-4 px-4 font-mono text-emerald-400 truncate max-w-[200px]">{log.newValue || "N/A"}</td>
                  <td className="py-4 px-4 text-slate-400">{new Date(log.timestamp).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
