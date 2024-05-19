import { AttributesInput } from "./AttributesInput"
import { AttributesTable } from "./AttributesTable"
import { ContextInput } from "./ContextInput"

export const ContextContainer = ({
  contextKind,
  index,
}: {
  contextKind: string
  index: number
}) => {
  console.log(`Rendering Context: ${index}`)

  return (
    <div className="flex flex-col gap-y-2 p-4 bg-gray-50 rounded-md border w-full max-w-md">
      <div className="flex flex-row gap-x-2">
        <ContextInput index={index} contextKind={contextKind} />
        <AttributesInput index={index} />
      </div>
      <AttributesTable index={index} />
    </div>
  )
}
