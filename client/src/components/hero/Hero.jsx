function Hero() {
  return (
    <div className="flex h-full items-center">

      <div className="max-w-xl">

        <h1 className="text-6xl font-bold leading-tight tracking-tight">
          Ideas Meet
          <br />
          Execution.
          <br />
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            Companies Begin.
          </span>
        </h1>

        <p className="mt-8 max-w-lg text-lg leading-8 text-white/60">
          Connect with founders, investors and professionals on one
          platform. Build meaningful collaborations, discover
          opportunities, and turn ideas into successful startups.
        </p>

        <div className="mt-12 flex items-center gap-12">

          <div>
            <h2 className="text-3xl font-bold">10K+</h2>
            <p className="mt-2 text-sm text-white/50">
              Active Members
            </p>
          </div>

          <div>
            <h2 className="text-3xl font-bold">500+</h2>
            <p className="mt-2 text-sm text-white/50">
              Startups Built
            </p>
          </div>

          <div>
            <h2 className="text-3xl font-bold">40+</h2>
            <p className="mt-2 text-sm text-white/50">
              Countries
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Hero;