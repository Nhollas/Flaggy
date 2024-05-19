import { memo } from "react"

import { Attributes, Context } from "../../types"

import { AttributesSelection } from "./AttributesSelection"
import AttributesTable from "./AttributesTable"
import { ContextInput } from "./ContextInput"

const ContextContainer = ({
  contextKind,
  attributes,
  updateContext,
  index,
}: {
  contextKind: string
  attributes: Attributes
  updateContext: (index: number, context: Context) => void
  index: number
}) => {
  const setAttributes = (
    attributes: {
      key: string
    } & Record<string, string>,
  ) => {
    updateContext(index, { kind: contextKind, attributes })
  }

  console.log("Rendering ContextContainer", { index, contextKind })
  return (
    <div className="flex flex-col gap-y-2 p-4 bg-gray-50 rounded-md border w-full max-w-md">
      <div className="flex flex-row gap-x-2">
        <ContextInput index={index} contextKind={contextKind} />
        <AttributesSelection
          attributes={attributes}
          setAttributes={setAttributes}
        />
      </div>
      <AttributesTable attributes={attributes} index={index} />
    </div>
  )
}

export default memo(ContextContainer)
