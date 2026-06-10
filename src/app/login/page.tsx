import SignInForm from '@/components/auth/SignInForm'

export default function LoginPage() {
  return (
    <div className="bg-background text-on-surface min-h-screen flex antialiased overflow-hidden">
      {/* Left Split: Visual Canvas */}
      <div className="hidden lg:flex lg:w-[55%] relative flex-col justify-between p-margin-desktop bg-surface-container-lowest">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"></div>
        
        <header className="relative z-10 flex items-center gap-3">
          <img src="/weblogo.svg" alt="KaiketsuTech Logo" className="h-12 w-auto" />
        </header>

        <div className="relative z-10 max-w-xl pb-12">
          <div className="font-section-label text-section-label text-primary mb-stack-md uppercase tracking-widest">Enterprise Access</div>
          <h1 className="font-display-lg text-display-lg text-on-surface mb-stack-md leading-tight">
            Solve.<br/>
            Design.<br/>
            <span className="text-primary-container">Elevate.</span>
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-md">
            Precision engineering for modern enterprises. Sign in to access your high-performance workspace and bespoke solutions.
          </p>
        </div>
      </div>

      {/* Right Split: Login Form */}
      <div className="w-full lg:w-[45%] h-full min-h-screen overflow-y-auto flex items-center justify-center p-margin-mobile md:p-margin-desktop bg-surface-container-lowest relative z-20">
        <SignInForm />
      </div>
    </div>
  )
}
