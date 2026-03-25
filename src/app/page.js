import { signIn } from "@/auth";

export default function SignInPage() {
  return (
    <div className="relative min-h-screen flex flex-col bg-black/50">
      <div className="absolute inset-0 -z-5 rounded-[1280px] bg-[#669C7D] blur-[375px] opacity-35"></div>
      <div className="flex flex-col items-center pt-18">
        <h1 className="text-[70px] font-brand bg-linear-to-b from-white to-[rgba(213,213,213,0.68)] bg-clip-text text-transparent"> B³</h1>
        <h2 className="text-[36px] font-brand bg-linear-to-b from-white to-[rgba(213,213,213,0.68)] bg-clip-text text-transparent">Build. Block. Break. </h2>
      </div>
      <div className="flex flex-col items-center justify-center pt-20">
        <div className="w-max flex flex-col items-center rounded-[25px] bg-[rgba(255,255,255,0.10)] backdrop-blur-md border border-white/30 inset-shadow-sm/30 shadow-xl px-18 py-4 gap-12">
        <div className="flex flex-col items-center justify-center mt-8">
          <h1 className="text-[24px]">ADMIN PANEL</h1>
          <h2 className="text-[20px] text-[#9A9A9A]">Authorized access only</h2>
          </div>
          <form
            action={async () => {
              "use server";
              await signIn("google", {
                redirectTo: "/main",
              });
            }}
          >
            <button
              type="submit"
              className="flex items-center justify-center gap-2 bg-[#09813B] hover:bg-[#0B8C41] text-white font-medium py-2 px-6 w-129 h-14  rounded-full shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] transition cursor-pointer"
            >
              <div className="p-0.5 rounded-full bg-[#D9D9D9]">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 48 48"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill="#FFC107"
                    d="M43.6 20.4H42V20H24v8h11.3C33.8 32.6 29.4 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.2l5.7-5.7C34.1 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.6z"
                  />
                  <path
                    fill="#FF3D00"
                    d="M6.3 14.7l6.6 4.8C14.7 16.1 19 12 24 12c3.1 0 5.9 1.2 8 3.2l5.7-5.7C34.1 6.1 29.3 4 24 4c-7.7 0-14.4 4.3-17.7 10.7z"
                  />
                  <path
                    fill="#4CAF50"
                    d="M24 44c5.2 0 10-2 13.6-5.3l-6.3-5.2C29.4 35.6 26.8 36 24 36c-5.4 0-9.8-3.4-11.3-8H6.3C9.6 39.7 16.3 44 24 44z"
                  />
                  <path
                    fill="#1976D2"
                    d="M43.6 20.4H42V20H24v8h11.3c-1.1 2.8-3.3 5-6 6.5l6.3 5.2C38.9 36.7 44 31.2 44 24c0-1.3-.1-2.7-.4-3.6z"
                  />
                </svg>
              </div>
              Continue with Google
            </button>
          </form>
          <h3 className="text-[17px] opacity-80 text-[#9A9A9A] mb-8">Only whitelisted email IDs can access the admin panel</h3>
        </div>
      </div>
    </div>
  )
}