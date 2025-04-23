import type { Order } from "./types"

export const mockOrders: Order[] = [
  {
    id: "ORD-1234",
    date: "2023-05-15T14:30:00",
    status: "Delivered",
    pickupAddress: "123 Main St, New York",
    deliveryAddress: "456 Park Ave, New York",
    packageDetails: "Food delivery from Pizza Palace",
    notes: "Leave at the door",
    estimatedDelivery: "Delivered on May 15, 2:45 PM",
    driverName: "John Driver",
    driverPhone: "+1 (555) 123-4567",
    customerName: "Jane Customer",
    customerPhone: "+1 (555) 987-6543",
    price: 25.99,
    distance: 2.3,
    categoryId: "food",
  },
  {
    id: "ORD-5678",
    date: "2023-05-10T12:15:00",
    status: "Delivered",
    pickupAddress: "789 Broadway, New York",
    deliveryAddress: "101 Fifth Ave, New York",
    packageDetails: "Grocery delivery from Fresh Market",
    estimatedDelivery: "Delivered on May 10, 12:45 PM",
    driverName: "Sarah Driver",
    driverPhone: "+1 (555) 234-5678",
    customerName: "Jane Customer",
    customerPhone: "+1 (555) 987-6543",
    price: 45.5,
    distance: 1.8,
    categoryId: "groceries",
  },
  {
    id: "ORD-9012",
    date: "2023-05-05T09:00:00",
    status: "Delivered",
    pickupAddress: "202 Cedar St, New York",
    deliveryAddress: "303 Maple St, New York",
    packageDetails: "Medication from Health Plus Pharmacy",
    notes: "ID required for pickup",
    estimatedDelivery: "Delivered on May 5, 9:30 AM",
    driverName: "Mike Driver",
    driverPhone: "+1 (555) 345-6789",
    customerName: "Jane Customer",
    customerPhone: "+1 (555) 987-6543",
    price: 32.75,
    distance: 3.1,
    categoryId: "pharmacy",
  },
  {
    id: "ORD-3456",
    date: "2023-05-01T16:45:00",
    status: "Delivered",
    pickupAddress: "404 Birch St, New York",
    deliveryAddress: "505 Oak St, New York",
    packageDetails: "Small package, documents",
    estimatedDelivery: "Delivered on May 1, 5:15 PM",
    driverName: "Alex Driver",
    driverPhone: "+1 (555) 456-7890",
    customerName: "Jane Customer",
    customerPhone: "+1 (555) 987-6543",
    price: 15.0,
    distance: 4.2,
    categoryId: "parcel",
  },
  {
    id: "ORD-7890",
    date: "2023-06-01T10:30:00",
    status: "In Transit",
    pickupAddress: "606 Pine St, New York",
    deliveryAddress: "707 Elm St, New York",
    packageDetails: "Food delivery from Burger Joint",
    estimatedDelivery: "Today, 11:15 AM",
    driverName: "Chris Driver",
    driverPhone: "+1 (555) 567-8901",
    customerName: "Jane Customer",
    customerPhone: "+1 (555) 987-6543",
    price: 18.5,
    distance: 2.5,
    categoryId: "food",
  },
  {
    id: "ORD-2345",
    date: "2023-06-01T09:00:00",
    status: "Pending",
    pickupAddress: "808 Maple St, New York",
    deliveryAddress: "909 Cedar St, New York",
    packageDetails: "Grocery delivery from Quick Mart",
    estimatedDelivery: "Today, 10:30 AM",
    customerName: "Jane Customer",
    customerPhone: "+1 (555) 987-6543",
    price: 32.25,
    distance: 1.9,
    categoryId: "groceries",
  },
]

// Orders for drivers to see (pending orders within 5km)
export const getAvailableOrdersForDriver = (driverLat: number, driverLng: number, radius = 5) => {
  // In a real app, we would calculate the distance between the driver and the pickup location
  // For now, we'll just filter by the distance property
  return mockOrders.filter((order) => order.status === "Pending" && order.distance && order.distance <= radius)
}

// Add a new order to the mock database
export const addOrder = (order: Order) => {
  mockOrders.unshift(order)
  return order
}

// Update an order in the mock database
export const updateOrder = (orderId: string, updates: Partial<Order>) => {
  const orderIndex = mockOrders.findIndex((o) => o.id === orderId)
  if (orderIndex >= 0) {
    mockOrders[orderIndex] = { ...mockOrders[orderIndex], ...updates }
    return mockOrders[orderIndex]
  }
  return null
}

// Get an order by ID
export const getOrderById = (orderId: string) => {
  return mockOrders.find((o) => o.id === orderId) || null
}

// Get orders by customer
export const getOrdersByCustomer = (customerName: string) => {
  return mockOrders.filter((o) => o.customerName === customerName)
}

// Get orders by driver
export const getOrdersByDriver = (driverName: string) => {
  return mockOrders.filter((o) => o.driverName === driverName)
}
