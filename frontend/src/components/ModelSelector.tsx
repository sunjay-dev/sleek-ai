import React from 'react'

export type Model = {
  id: string;
  name: string;
}

type Props = {
  models: Model[]
  selectedModel: string
  onModelChange: (modelId: string) => void
  isLoading: boolean
}

const ModelSelector: React.FC<Props> = ({ models, selectedModel, onModelChange, isLoading }) => {
  return (
    <div>
      <select
        value={selectedModel}
        onChange={(e) => onModelChange(e.target.value)}
        disabled={isLoading}
        className="bg-neutral-700 text-white text-xs p-1 rounded-md focus:outline-none focus:ring-1 focus:ring-white/50 disabled:opacity-50"
      >
        {models.map((model) => (
          <option key={model.id} value={model.id}>
            {model.name}
          </option>
        ))}
      </select>
    </div>
  )
}

export default ModelSelector