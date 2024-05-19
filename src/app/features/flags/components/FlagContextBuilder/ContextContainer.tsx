import { memo } from "react"

import { AttributesInput } from "./AttributesInput"
import { AttributesTable } from "./AttributesTable"
import { ContextInput } from "./ContextInput"

const ContextContainer = ({
  context,
  index,
}: {
  context: {
    attributes: {
      key: string
    } & Record<string, string>
    kind: string
  }
  index: number
}) => {
  const { attributes, kind: contextKind } = context
  console.log(`Rendering Context: ${index}`)
  return (
    <div className="flex flex-col gap-y-2 p-4 bg-gray-50 rounded-md border w-full max-w-md">
      <div className="flex flex-row gap-x-2">
        <ContextInput index={index} contextKind={contextKind} />
        <AttributesInput index={index} attributes={attributes} />
      </div>
      <AttributesTable index={index} />
    </div>
  )
}

export default memo(ContextContainer)
