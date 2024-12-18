"use client"

import { ReactNode } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { ScrollArea } from "@/src/components/ui/scroll-area"
import { cn } from "@/src/shared/lib/utils"
import { Home, Package, Users, LogOut, Percent } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { Provider, useDispatch, useSelector } from "react-redux"
import { getUser, logout, UserState } from "@/src/shared/store/slices/userSlice"
import { persistor, store } from "@/src/shared/store/store"
import { PersistGate } from "redux-persist/integration/react"
import { ToastContainer } from "@/src/components/ToastContainer"

const navItems = [
  { href: "/dashboard", label: "Inicio", icon: Home },
  { href: "/dashboard/products", label: "Productos", icon: Package },
  { href: "/dashboard/users", label: "Usuarios", icon: Users },
  { href: "/dashboard/coupons", label: "Cupones", icon: Percent },
  // { href: "/dashboard/sales", label: "Ventas", icon: ShoppingCart },

]

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const router = useRouter();
  const user: UserState = useSelector(getUser);
  if (!user?.id ) {
    dispatch(logout());
    router.push("/login");
  }

  const onLogOut = () => {
    dispatch(logout());
    router.push("/login");
  }

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ToastContainer />
        <div className="flex h-screen bg-gray-100">
          <aside className="w-64 bg-white border-r flex flex-col">
            <div className="p-4 font-bold text-lg tracking-tight border-b">
              Dashboard
            </div>
            <ScrollArea className="flex-1">
              <nav className="p-4 space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center space-x-2 text-sm font-medium p-2 rounded-md transition-colors hover:bg-gray-100",
                        isActive ? "bg-gray-100 text-gray-900" : "text-gray-700"
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </Link>
                  )
                })}
              </nav>
            </ScrollArea>
            <div className="p-4 border-t flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{user?.name || ''}</span>
                  <span className="text-xs text-gray-500 truncate block w-100">{user?.email || ''}</span>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={onLogOut}>
                <LogOut className="w-4 h-4 text-red-600" />
              </Button>
            </div>
          </aside>

          <div className="flex-1 flex flex-col">
            <header className="bg-white border-b p-4 pb-9 flex items-center justify-between">
              <div className="flex items-center space-x-2 w-full max-w-sm">

              </div>
            </header>

            <div className="flex-1 p-6 overflow-auto">
              {children}
            </div>
          </div>
        </div>
      </PersistGate>
    </Provider>
  )
}
