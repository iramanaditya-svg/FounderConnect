import Hero from "../components/hero/Hero";
import RegisterCard from "../components/auth/RegisterCard";


function Register() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050816] text-white">


      <div className="absolute -top-52 -left-40 h-[450px] w-[450px] rounded-full bg-purple-700/25 blur-[140px]" />

      <div className="absolute top-20 right-0 h-[400px] w-[400px] rounded-full bg-blue-600/20 blur-[140px]" />

      <div className="absolute bottom-0 left-1/2 h-[350px] w-[350px] -translate-x-1/2 rounded-full bg-fuchsia-600/20 blur-[140px]" />






<div className="relative z-10 mx-auto flex h-screen max-w-7xl px-8 lg:px-20">

    <div className="hidden lg:flex w-[75%] h-screen sticky top-0 items-center">
        <Hero />
    </div>

    <div className="w-full lg:w-[50%] h-screen overflow-y-auto">
        <div className="flex justify-center py-10">
            <RegisterCard />
        </div>
    </div>

</div>

      </div>


  );
}

export default Register;