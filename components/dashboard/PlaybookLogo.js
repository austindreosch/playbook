'use client'

export default function PlaybookLogo() {
  return (
    <div className="flex items-center group font-bold bg-orange rounded-lg h-9 px-5 gap-2.5 shrink-0 border border-orange-600 rounded-lg">
      <img src="/logo-tpfull-big.png" alt="Playbook Icon" className="hw-icon-lg" />
      <a href="/landing" className="">
        <div className="text-title-h5 font-bold text-black group-hover:text-white">
          Playbook
        </div>
      </a>
    </div>
  );
}