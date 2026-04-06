import LogoutButton from "@/components/logoutbutton";

export default function failure() {
    return (
        <div className="justify-center items-center relative min-h-screen flex flex-col bg-black/50">
            <div className="absolute top-4 right-4 z-10">
                <LogoutButton />
            </div>
            <div className="absolute inset-0 -z-5 rounded-[1280px] bg-[#669C7D] blur-[375px] opacity-35"></div>
            <h1 className="text-[70px] font-brand bg-linear-to-b from-white to-[rgba(213,213,213,0.68)] bg-clip-text text-transparent text-center px-4">Authentication Failed. <br/> You do not have the required permissions.</h1>
        </div>
    )
}