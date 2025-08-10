'use client'

export default function PlaybookLogo({ className = "" }) {
  return (
    <div className={`flex items-center group font-bold rounded-lg gap-2.5 shrink-0 ${className}`.trim()}>
      <img src="/logo-tpfull-big.png" alt="Playbook Icon" className="h-7 w-7" />
      <a href="/landing" className="">
        <div className="text-title-h5 font-bold text-black group-hover:text-white">
          Playbook
        </div>
      </a>
    </div>
  );
}