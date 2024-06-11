import { memo } from "react"

import { AttributesTable } from "../AttributesTable"

import AttributesSelection from "./AttributesSelection"
import ContextInput from "./ContextInput"

const ContextContainer = ({
  contextKind,
  index,
}: {
  contextKind: string
  index: number
}) => {
  return (
    <div className="flex w-full flex-col gap-y-4 rounded-md border bg-card p-4">
      <div className="flex flex-col gap-4 sm:flex-row">
        <ContextInput contextIndex={index} contextKind={contextKind} />
        <AttributesSelection contextIndex={index} />
      </div>
      <AttributesTable contextIndex={index} />
    </div>
  )
}

export default memo(ContextContainer)
