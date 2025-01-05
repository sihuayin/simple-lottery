import ResultTable from "@/components/ResultTable"
import SubHeader from "@/components/SubHeader"
import Winners from "@/components/Winner"

function Result({ params }: { params: { jackpotId: string }}) {


  return (
    <div>
      <div className="min-h-screen bg-slate-100">
        <SubHeader />
        <ResultTable jackpotId={params.jackpotId} />
        <Winners resultId={params.jackpotId} />
      </div>
    </div>
  )
}

export default Result

export async function generateStaticParams() {
  return []
}

export const dynamic = 'force-dynamic'