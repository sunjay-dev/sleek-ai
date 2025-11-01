import React from 'react'

type Props = {
  text: string
}

const UserMessage: React.FC<Props> = ({ text }) => {
  return (
    <div className="flex justify-end">
      <div className="bg-white text-neutral-800 px-3 py-2 rounded-2xl max-w-md selection:bg-gray-900/90 userMessage selection:text-white text-sm">
        <p>{text}</p>
      </div>
    </div>
  )
}

export default UserMessage