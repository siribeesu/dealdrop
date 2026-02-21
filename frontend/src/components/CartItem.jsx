import React from 'react'
import { Button } from './ui/button'
import { Minus, Plus, Trash2 } from 'lucide-react'

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const handleIncrease = () => {
    onUpdateQuantity(item.id, item.quantity + 1)
  }

  const handleDecrease = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.id, item.quantity - 1)
    }
  }

  const handleRemove = () => {
    onRemove(item.id)
  }

  return (
    <div className="flex items-center space-x-4 p-4 border rounded-lg bg-white shadow-sm">
      <img
        src={item.image || item.product?.image || item.product?.images?.[0]?.url || '/placeholder-product.jpg'}
        alt={item.name}
        className="w-16 h-16 object-cover rounded"
      />
      <div className="flex-1">
        <h3 className="font-semibold text-lg">{item.name}</h3>
        <p className="text-gray-600">₹{item.price.toFixed(2)}</p>
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="icon"
          onClick={handleDecrease}
          disabled={item.quantity <= 1}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="w-8 text-center">{item.quantity}</span>
        <Button
          variant="outline"
          size="icon"
          onClick={handleIncrease}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="text-right">
        <p className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</p>
        <Button
          variant="destructive"
          size="sm"
          onClick={handleRemove}
          className="mt-1"
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Remove
        </Button>
      </div>
    </div>
  )
}

export default CartItem
