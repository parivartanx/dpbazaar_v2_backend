# Order Management Module Documentation

## Overview
Complete Order Management system for the ecommerce backend with CRUD operations, analytics, and dashboard statistics.

## Files Created

### 1. Interface
**Location**: `/src/repositories/interfaces/IOrderRepository.ts`
- Defines all repository methods
- Type-safe interfaces for filters, pagination, and data structures
- Dashboard statistics interface

### 2. Repository
**Location**: `/src/repositories/prisma/OrderRepository.ts`
- Implements IOrderRepository interface
- Handles all database operations using Prisma
- Business logic for order creation, updates, and analytics

### 3. Controller
**Location**: `/src/controllers/order.controller.ts`
- HTTP request handlers
- Validation and error handling
- Response formatting using ApiResponse

### 4. Routes
**Location**: `/src/routes/order.routes.ts`
- API endpoint definitions
- RESTful route structure

### 5. Validators
**Location**: `/src/validators/order.validation.ts`
- Joi validation schemas
- Input validation for all operations

## API Endpoints

### CRUD Operations

#### Create Order
```
POST /orders
Body: {
  customerId: string
  vendorId?: string
  items: [{
    productId: string
    variantId?: string
    quantity: number
  }]
  shippingAddress: {...}
  billingAddress: {...}
  customerName: string
  customerEmail: string
  customerPhone: string
  customerNotes?: string
  discountCode?: string
  source?: "WEBSITE" | "APP" | "POS" | "PHONE"
  deviceInfo?: {...}
}
```

#### Get All Orders (with filters & pagination)
```
GET /orders?status=PENDING&page=1&limit=10&search=&startDate=&endDate=&customerId=&vendorId=&paymentStatus=
```

#### Get Order by ID
```
GET /orders/:id
```

#### Update Order
```
PUT /orders/:id
Body: {
  shippingAddress?: {...}
  billingAddress?: {...}
  customerNotes?: string
  adminNotes?: string
  trackingNumber?: string
  courierPartner?: string
}
```

#### Delete Order (Cancel)
```
DELETE /orders/:id
```

#### Restore Order
```
PATCH /orders/:id/restore
```

### Order Status Management

#### Update Order Status
```
PATCH /orders/:id/status
Body: {
  status: "PENDING" | "CONFIRMED" | "PROCESSING" | "PACKED" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "RETURNED"
}
```

#### Cancel Order
```
PATCH /orders/:id/cancel
Body: {
  reason?: string
}
```

#### Confirm Order
```
PATCH /orders/:id/confirm
```

### Analytics & Dashboard

#### Dashboard Statistics
```
GET /orders/dashboard-stats

Response: {
  totalOrders: number
  pendingOrders: number
  deliveredOrders: number
  cancelledOrders: number
  returnedOrders: number
  totalRevenue: number
  lastMonthRevenue: number
  thisMonthRevenue: number
  revenueGrowthPercentage: number
  lastMonthOrders: number
  thisMonthOrders: number
  orderGrowthPercentage: number
}
```

#### Monthly Statistics
```
GET /orders/monthly-stats?months=6

Response: {
  stats: [{
    month: string
    orderCount: number
    revenue: number
  }]
}
```

#### Order Count by Status
```
GET /orders/status-count

Response: {
  stats: [{
    status: string
    count: number
  }]
}
```

#### Revenue Statistics
```
GET /orders/revenue-stats?startDate=&endDate=

Response: {
  stats: {
    totalRevenue: number
    avgOrderValue: number
    totalOrders: number
  }
}
```

### Customer & Vendor Specific

#### Get Customer Orders
```
GET /orders/customer/:customerId
```

#### Get Vendor Orders
```
GET /orders/vendor/:vendorId
```

## Key Features

### 1. Order Creation Logic
- Validates product availability and stock status
- Handles product variants correctly
- Calculates pricing: MRP, selling price, discount, tax
- Supports discount codes (percentage & fixed amount)
- Generates unique order numbers
- Creates order items with product snapshots
- Updates customer statistics (totalOrders, totalSpent, lastOrderAt)
- Updates product sales count

### 2. Inventory Management
- Checks stock status before order creation
- Prevents orders for out-of-stock products
- Validates variant availability and active status

### 3. Pricing Calculation
- Item total
- Tax calculation per item
- Discount application (product discount + coupon)
- Shipping charges
- COD charges
- Final total amount

### 4. Dashboard Analytics
- Real-time order statistics
- Revenue tracking with growth percentages
- Order count tracking with growth percentages
- Monthly trends analysis
- Status-based order counts

### 5. Growth Percentage Formula
```javascript
percentage = ((current - previous) / previous) * 100

// Handle edge case: if previous = 0
percentage = current > 0 ? 100 : 0
```

### 6. Soft Delete Pattern
- Orders are "cancelled" instead of deleted
- Status changed to CANCELLED
- Customer stats are adjusted
- Can be restored using restore endpoint

### 7. Order Status History
- Tracks all status changes
- Stores fromStatus and toStatus
- Includes reason and notes
- Maintains audit trail

## Integration Steps

### 1. Register Routes
Add to `/src/routes/index.ts`:
```typescript
import { orderRoutes } from './order.routes';

// Add to router
router.use('/orders', orderRoutes);
```

### 2. Add Validation Middleware (Optional)
Update routes with validation:
```typescript
import { validateRequest } from '../middlewares/validateRequest';
import { createOrderSchema } from '../validators/order.validation';

router.post('/', validateRequest(createOrderSchema), orderController.createOrder);
```

### 3. Add Authentication Middleware
Protect routes with auth:
```typescript
import { authenticateToken } from '../middlewares/auth';

router.use(authenticateToken);
```

### 4. Add Authorization Middleware
Role-based access control:
```typescript
import { isAccessAllowed } from '../middlewares/isAccessAllowed';

router.delete('/:id', isAccessAllowed(['ADMIN']), orderController.deleteOrder);
```

## Database Relations Used

The repository leverages these Prisma relations:
- Order ↔ OrderItem (one-to-many)
- Order ↔ Customer (many-to-one)
- Order ↔ Vendor (many-to-one)
- Order ↔ Payment (one-to-many)
- Order ↔ OrderDiscount (one-to-many)
- Order ↔ OrderStatusHistory (one-to-many)
- Order ↔ Delivery (one-to-one)
- Order ↔ Return (one-to-many)
- Order ↔ Invoice (one-to-many)
- OrderItem ↔ Product (many-to-one)
- OrderItem ↔ ProductVariant (many-to-one)

## Error Handling

All methods include comprehensive error handling:
- Product not found
- Variant not found
- Out of stock products
- Invalid order status transitions
- Database errors
- Validation errors

## Response Format

All responses follow the ApiResponse pattern:
```typescript
{
  success: boolean
  data?: any
  message: string
  timestamp: string
  error?: string
}
```

## Testing Recommendations

1. **Unit Tests**: Test repository methods with mocked Prisma client
2. **Integration Tests**: Test controller methods with test database
3. **E2E Tests**: Test complete order flow from creation to delivery
4. **Performance Tests**: Test with large datasets for analytics queries

## Future Enhancements

1. Payment gateway integration
2. Real-time order tracking
3. Automated status transitions
4. Email notifications for status changes
5. SMS notifications
6. Advanced analytics (cohort analysis, customer lifetime value)
7. Export functionality (PDF invoices, Excel reports)
8. Bulk order operations
9. Order scheduling
10. Return and refund management

## Notes

- All timestamps are in ISO format
- All monetary values use Decimal type from Prisma
- Order numbers are unique and auto-generated
- Customer stats are automatically updated
- Product sales counts are tracked
- Soft delete is implemented via status change to CANCELLED
