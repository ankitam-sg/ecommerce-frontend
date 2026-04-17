import type { ReactNode } from "react"
import Navbar from "./Navbar"

type Props = {
    children: ReactNode;
}

const Layout = ({ children}: Props) => {
    return (
        <div>
            <Navbar />

            {/* Page content will render here */}
            <main className="p-4">
                {children}
            </main>
        </div>
    )
}

export default Layout