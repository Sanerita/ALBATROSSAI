'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'

interface AddLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: { name: string, email: string, budget: number, notes: string }) => void;
}
export default function AddLeadModal({ isOpen, onClose, onSubmit }: AddLeadModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    budget: 0,
    notes: ''
  })

  if (!isOpen) return null

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
    >
      <motion.div 
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        className="bg-white rounded-lg shadow-xl w-full max-w-md"
      >
        <div className="p-6">
          <h2 className="text-xl font-bold text-navy mb-4">Add New Lead</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gold focus:ring-gold"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            
            {/* Other form fields */}
            
            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-navy"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onSubmit(formData);
                  onClose()
                }}
                className="px-4 py-2 bg-gold text-white font-medium rounded-md hover:bg-opacity-90"
              >
                Add Lead
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}