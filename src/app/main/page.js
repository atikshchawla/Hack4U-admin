"use client"

import { useState } from "react"
import Dashboard from "../dashboard/page"
import Settings from "../settings/page"
import TeamDetails from "../teamdetails/page"
import UsersPage from "../users/page"
import LogoutButton from "@/components/logoutbutton"

export default function MainPage() {
  const navItems = [
    { name: "Dashboard", key: "dashboard" },
    { name: "Team Details", key: "team" },
    { name: "Users", key: "users" },
    { name: "Settings", key: "settings" },
  ]

  const [active, setActive] = useState("dashboard")
  const [selectedTeamId, setSelectedTeamId] = useState(null)

  const openTeam = (teamId) => {
    setSelectedTeamId(teamId)
    setActive("team")
  }


  const renderContent = () => {
    switch (active) {
      case "dashboard":
        return <Dashboard onSelectTeam={openTeam} />
      case "team":
        return <TeamDetails teamId={selectedTeamId} />
      case "users":
        return <UsersPage onNavigate={openTeam} />
      case "settings":
        return <Settings />
      default:
        return <div>Select a tab</div>
    }
  }

  return (
    <div className="flex min-h-screen">
      <div className="w-64 bg-[rgba(12,172,79,0.50)] flex flex-col justify-between px-4 py-6">
        <div className="flex flex-col gap-3 pt-5">
          {navItems.map((item) => {
            const isActive = active === item.key
            return (
              <button
                key={item.key}
                onClick={() => setActive(item.key)}
                className={`
                  w-full px-5 py-5 text-[20px] rounded-tl-full rounded-bl-full transition-all duration-200 ml-4 
                  ${isActive
                    ? "bg-black text-white shadow-lg"
                    : "text-emerald-200 hover:bg-black/30 hover:text-white"}
                `}
              >
                {item.name}
              </button>
            )
          })}
        </div>
        <LogoutButton />
      </div>
      <div className="flex-1 bg-black">
        {renderContent()}
      </div>
    </div>
  )
}
