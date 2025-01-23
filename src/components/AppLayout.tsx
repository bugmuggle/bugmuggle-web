import { Outlet, useNavigate } from "react-router"
import { Bars3Icon, InboxIcon, PowerIcon } from '@heroicons/react/24/solid'
import HeroIcon from "./HeroLogo"
import pb from "../lib/pocketbase/client";
import { useActivity } from "../hooks/activity";

export const AppLayout = function () {
  const { channels, actChannel } = useActivity()
  const navigate = useNavigate()

  const handleLogout = function () {
    pb.authStore.clear()
    navigate('/')
  }

  return <div className="overflow-hidden h-screen w-full">
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col items-center justify-center">
        <label htmlFor="my-drawer-2" className="fixed top-0 left-0 btn btn-square drawer-button lg:hidden">
          <Bars3Icon className="size-6" />
        </label>
        <Outlet />
      </div>
      <div className="drawer-side">
        <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>

        <div className="bg-base-200 text-base-content h-full w-64">
          <div className="flex flex-col h-full items-start gap-3 px-0">
            <div className="p-3">
              <HeroIcon />
            </div>

            <ul className="menu menu-md bg-base-200 px-3 rounded-box w-full">
              <li>
                <a>
                  <InboxIcon className="size-5" />
                  My Tasks
                </a>
              </li>

              <div className="h-4" />

              <li className="menu-title text-xs">Channels</li>
              {
                channels.map(ch => (
                  <li key={'channel-sidenav-' + ch.id}>
                    <a className={actChannel && ch.id === actChannel ? 'active' : ''}>
                      {ch.name}
                    </a>
                  </li>
                ))
              }
            </ul>

            <div className="grow" />
            
            <ul className="menu menu-md bg-base-200 px-3 rounded-box w-full">
              <li>
                <a onClick={handleLogout}>
                  <PowerIcon className="size-5" />
                  Logout
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
}
