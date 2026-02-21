const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  originalPrice: {
    type: Number,
    min: [0, 'Original price cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
    trim: true
  },
  subcategory: {
    type: String,
    trim: true
  },
  brand: {
    type: String,
    trim: true
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: {
      type: String,
      default: ''
    },
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  inventory: {
    quantity: {
      type: Number,
      required: [true, 'Stock quantity is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0
    },
    sku: {
      type: String,
      unique: true,
      sparse: true
    },
    trackInventory: {
      type: Boolean,
      default: true
    }
  },
  shipping: {
    weight: {
      type: Number,
      min: [0, 'Weight cannot be negative']
    },
    dimensions: {
      length: Number,
      width: Number,
      height: Number
    },
    freeShipping: {
      type: Boolean,
      default: false
    }
  },
  seo: {
    metaTitle: String,
    metaDescription: String,
    slug: {
      type: String,
      unique: true,
      sparse: true
    }
  },
  tags: [{
    type: String,
    trim: true
  }],
  attributes: [{
    name: {
      type: String,
      required: true
    },
    value: {
      type: String,
      required: true
    }
  }],
  variants: [{
    name: String,
    price: Number,
    inventory: Number,
    sku: String,
    attributes: Map
  }],
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    title: String,
    comment: {
      type: String,
      maxlength: [500, 'Review comment cannot exceed 500 characters']
    },
    verified: {
      type: Boolean,
      default: false
    },
    helpful: {
      type: Number,
      default: 0
    }
  }],
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'draft', 'archived'],
    default: 'active'
  },
  featured: {
    type: Boolean,
    default: false
  },
  onSale: {
    type: Boolean,
    default: false
  },
  saleStart: Date,
  saleEnd: Date,
  discountPercentage: {
    type: Number,
    min: 0,
    max: 100
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  salesCount: {
    type: Number,
    default: 0
  },
  viewCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1, subcategory: 1 });
productSchema.index({ price: 1 });
productSchema.index({ status: 1 });
productSchema.index({ featured: 1 });
productSchema.index({ createdAt: -1 });

// Virtual for discount price
productSchema.virtual('discountPrice').get(function() {
  if (this.onSale && this.discountPercentage) {
    return this.price * (1 - this.discountPercentage / 100);
  }
  return this.price;
});

// Virtual for primary image
productSchema.virtual('primaryImage').get(function() {
  return this.images.find(img => img.isPrimary) || this.images[0];
});

// Pre-save middleware to generate slug
productSchema.pre('save', function(next) {
  if (this.isModified('name') && !this.seo.slug) {
    this.seo.slug = this.name.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-').replace(/-+/g, '-').trim('-');
  }
  next();
});

// Instance method to check if product is available
productSchema.methods.isAvailable = function(quantity = 1) {
  return this.status === 'active' && (!this.inventory.trackInventory || this.inventory.quantity >= quantity);
};

// Instance method to update inventory
productSchema.methods.updateInventory = function(quantity) {
  if (this.inventory.trackInventory) {
    this.inventory.quantity = Math.max(0, this.inventory.quantity + quantity);
  }
  return this.save();
};

// Instance method to add review
productSchema.methods.addReview = function(reviewData) {
  this.reviews.push(reviewData);
  this.reviewCount = this.reviews.length;
  this.averageRating = this.reviews.reduce((sum, review) => sum + review.rating, 0) / this.reviewCount;
  return this.save();
};

// Static method to get featured products
productSchema.statics.getFeatured = function(limit = 10) {
  return this.find({ featured: true, status: 'active' })
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Static method to get products by category
productSchema.statics.getByCategory = function(category, limit = 20) {
  return this.find({ category, status: 'active' })
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Static method to search products
productSchema.statics.search = function(query, limit = 20) {
  return this.find(
    { $text: { $search: query }, status: 'active' },
    { score: { $meta: 'textScore' } }
  )
  .sort({ score: { $meta: 'textScore' } })
  .limit(limit);
};

module.exports = mongoose.model('Product', productSchema);
