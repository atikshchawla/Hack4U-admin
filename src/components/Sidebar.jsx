import { redirect } from 'next/navigation';
import {signOut} from "../auth";

export default function Sidebar () {
  return (
          <aside className="w-64 bg-gradient-to-b from-green-900 to-green-950 flex flex-col justify-between py-6 relative">
        <div>

          <nav className="space-y-2 px-4 mt-8">
            <div className="relative group">
              <button className="flex items-center gap-3 w-full px-6 py-4 bg-[#0a0a0a] rounded-full text-white shadow-lg transition-all relative z-10"
              onClick={() => redirect('/dashboard')}>
                <span className="font-medium">Dashboard</span>
              </button>
            </div>

            <button className="flex items-center gap-3 w-full px-6 py-4 text-green-100/70 hover:text-white hover:bg-white/5 rounded-full transition-colors">
              <span className="font-medium">Team Details</span>
            </button>

            <button className="flex items-center gap-3 w-full px-6 py-4 text-green-100/70 hover:text-white hover:bg-white/5 rounded-full transition-colors"
            onClick={() => redirect('/settings')}>
              <span className="font-medium">Settings</span>
            </button>
          </nav>
        </div>


        <div className="px-6 py-4">
          <button className="flex items-center gap-3 w-full px-6 py-4 text-green-100/70 hover:text-white hover:bg-white/5 rounded-full transition-colors"
          onClick={async () => await signOut({redirectTo: '/'})}>
            <span className="font-medium">Log Out</span>
          </button>
        </div>
      </aside>
  );
};