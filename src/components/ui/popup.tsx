import React from "react"

interface PopupProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}

export const Popup: React.FC<PopupProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-4 rounded-lg shadow-lg w-3/4 h-3/4 overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 bg-red-500 text-white px-2 py-1 rounded"
          onClick={onClose}
        >
          Close
        </button>
        {children}
      </div>
    </div>
  )
}
