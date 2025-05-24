import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { type PrimitiveFormData } from "@/types"

interface AddPrimitiveFormProps {
  onSubmit: (formData: PrimitiveFormData) => void
  onCancel: () => void
}

export function AddPrimitiveForm({ onSubmit, onCancel }: AddPrimitiveFormProps) {
  // In real big project I could use React Hook Form + Zod for validation, now I just use simple variant with useState
  const [formData, setFormData] = useState<PrimitiveFormData>({
    type: "box",
    count: 1,
    width: 1,
    height: 1,
    depth: 1,
  })

  const handleSubmit = () => {
    onSubmit(formData)
    // Reset form
    setFormData({
      type: "box",
      count: 1,
      width: 1,
      height: 1,
      depth: 1,
    })
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="type">Primitive Type</Label>
        <Select
          value={formData.type}
          onValueChange={(value: "box" | "pyramid") => setFormData((prev) => ({ ...prev, type: value }))}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="box">Box</SelectItem>
            <SelectItem value="pyramid">Pyramid</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="count">Number of Primitives</Label>
        <Input
          id="count"
          type="number"
          min="1"
          value={formData.count}
          onChange={(e) => setFormData((prev) => ({ ...prev, count: Number.parseInt(e.target.value) || 1 }))}
        />
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div>
          <Label htmlFor="width">Width</Label>
          <Input
            id="width"
            type="number"
            min="0.1"
            step="0.1"
            value={formData.width}
            onChange={(e) => setFormData((prev) => ({ ...prev, width: Number.parseFloat(e.target.value) || 1 }))}
          />
        </div>
        <div>
          <Label htmlFor="height">Height</Label>
          <Input
            id="height"
            type="number"
            min="0.1"
            step="0.1"
            value={formData.height}
            onChange={(e) => setFormData((prev) => ({ ...prev, height: Number.parseFloat(e.target.value) || 1 }))}
          />
        </div>
        <div>
          <Label htmlFor="depth">Depth</Label>
          <Input
            id="depth"
            type="number"
            min="0.1"
            step="0.1"
            value={formData.depth}
            onChange={(e) => setFormData((prev) => ({ ...prev, depth: Number.parseFloat(e.target.value) || 1 }))}
          />
        </div>
      </div>

      <div className="flex gap-2">
        <Button onClick={handleSubmit} className="flex-1">
          Add
        </Button>
        <Button variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
      </div>
    </div>
  )
}
