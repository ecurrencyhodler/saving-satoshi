'use client'

export default function Tips({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-auto mb-5 font-nunito">
      <h2 className="text-xl font-bold text-white">Tips</h2>
      <ul className="ml-3 mt-3 list-inside list-none text-white">{children}</ul>
    </div>
  )
}
