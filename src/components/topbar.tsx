import Image from 'next/image'

export function Topbar() {
  return (
    <header className="w-full h-16 bg-[#AB9B8C] px-6 flex items-center">
      <div className="flex items-center">
        <Image
          src="https://cama.it/wp-content/uploads/2021/10/logocama_bianco_small.png"
          alt="Cama Logo"
          width={120}
          height={40}
          className="h-8 w-auto"
          priority
        />
      </div>
    </header>
  )
}
