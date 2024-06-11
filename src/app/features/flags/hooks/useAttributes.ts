import { useWatch } from "react-hook-form"

import { Attributes, ContextBuilderForm } from "../types"

export const useAttributes = (contextIndex: number): Attributes => {
  return useWatch<ContextBuilderForm>({
    name: `contexts.${contextIndex}.attributes`,
  }) as Attributes
}
