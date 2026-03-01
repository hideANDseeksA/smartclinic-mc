import LoginForm from "@/components/auth/loginform"

export default function LoginPage() {
  return (
    <>
      {/* Navbar */}

      {/* Page Content */}
      <div className="bg-btn-primary flex min-h-[calc(100svh-8vh)] flex-col items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm md:max-w-4xl">
          <LoginForm />
        </div>
      </div>

      {/* Footer */}
    </>
  )
}