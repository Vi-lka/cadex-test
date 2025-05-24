import { generatePrimitiveGroup } from '@/lib/utils'
import type { PrimitiveGroup, PrimitiveFormData } from '@/types'
import React from 'react'
import { Button } from '../ui/button'
import { Plus, Trash2 } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { AddPrimitiveForm } from './add-primitive-form'

interface ControlButtonsProps {
  primitivesLength: number
  onAddPrimitiveGroup: (group: PrimitiveGroup) => void
  onClearScene: () => void
}

export default function ControlButtons({ 
  primitivesLength,
  onAddPrimitiveGroup, 
  onClearScene 
}: ControlButtonsProps) {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)

  const handleAddPrimitives = (formData: PrimitiveFormData) => {
    const newGroup = generatePrimitiveGroup(formData)
    onAddPrimitiveGroup(newGroup)
    setIsDialogOpen(false)
  }

  return (
    <div className="flex flex-wrap gap-2 items-center justify-between">
      {/* Add Primitive Button */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="flex items-center gap-2 w-full cursor-pointer">
            <Plus className="w-4 h-4" />
            Add Group
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Primitives Group</DialogTitle>
          </DialogHeader>
          <AddPrimitiveForm onSubmit={handleAddPrimitives} onCancel={() => setIsDialogOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Clear Scene Button */}
      <Button variant="destructive" onClick={onClearScene} disabled={primitivesLength === 0} className="flex items-center gap-2 w-full cursor-pointer">
        <Trash2 className="w-4 h-4" />
        Clear Scene
      </Button>
    </div>
  )
}
