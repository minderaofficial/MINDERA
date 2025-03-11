"use client"

import { usePresale } from "@/context/presale-context"

export function PresaleStages() {
  const { presaleData } = usePresale()

  return (
    <div>
      <h4 className="font-medium mb-4">Presale Stages</h4>
      <div className="space-y-4">
        {presaleData.stages.map((stage, index) => (
          <div key={index} className="flex items-center gap-4">
            <div
              className={`h-8 w-8 rounded-full ${stage.active ? "bg-purple-700" : "bg-purple-900/40"} flex items-center justify-center text-xs font-bold`}
            >
              {index + 1}
            </div>
            <div className="flex-1">
              <div className="flex justify-between">
                <span className="font-medium">{stage.name}</span>
                <span className={`text-sm ${stage.active ? "text-purple-400" : "text-gray-400"}`}>${stage.price}</span>
              </div>
              <div className="h-1.5 w-full bg-purple-900/20 rounded-full overflow-hidden mt-1">
                {stage.active && presaleData.percentageRaised > 0 && (
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-purple-700 rounded-full"
                    style={{ width: `${presaleData.percentageRaised}%` }}
                  ></div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

