

import Generator from "@/components/Generator";
import JackpotTable from "@/components/JackpotTable";
import SubHeader from "@/components/SubHeader";

export default function JackpotPage({params}: {params: {jackpotId: string}}) {
  return (
    <div className="min-h-screen bg-slate-100">
        <SubHeader />
        <JackpotTable
          jackpotId={params.jackpotId}
        />
        <Generator jackpotId={params.jackpotId} />
      </div>
  )
}
export async function generateStaticParams() {
  return []
}

export const dynamic = 'force-dynamic'