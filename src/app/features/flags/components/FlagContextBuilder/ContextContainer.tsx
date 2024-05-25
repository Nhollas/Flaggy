import { memo } from "react"

import AttributesSelection from "./AttributesSelection"
import AttributesTable from "./AttributesTable"
import ContextInput from "./ContextInput"

const ContextContainer = ({
  contextKind,
  index,
}: {
  contextKind: string
  index: number
}) => {
  return (
    <div className="flex w-full max-w-md flex-col gap-y-2 rounded-md border bg-gray-50 p-4">
      <div className="flex flex-row gap-x-2">
        <ContextInput contextIndex={index} contextKind={contextKind} />
        <AttributesSelection contextIndex={index} />
      </div>
      <AttributesTable contextIndex={index} />
    </div>
  )
}

export default memo(ContextContainer)
