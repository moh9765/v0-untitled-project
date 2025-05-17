import { Message } from "@/components/chat/chat-dialog"

// Mock storage for chat messages
const mockChatMessages: Record<string, Message[]> = {}

// Generate a unique ID for messages
const generateMessageId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

// Get all messages for a specific order
export const getMessagesForOrder = (orderId: string): Message[] => {
  if (!mockChatMessages[orderId]) {
    // Initialize with some mock messages for demo purposes
    mockChatMessages[orderId] = [
      {
        id: generateMessageId(),
        text: "Hello! I'm on my way with your order.",
        sender: "driver",
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        status: "delivered"
      },
      {
        id: generateMessageId(),
        text: "Great! Please call me when you're close.",
        sender: "customer",
        timestamp: new Date(Date.now() - 1000 * 60 * 25), // 25 minutes ago
        status: "read"
      }
    ]
  }
  
  return mockChatMessages[orderId]
}

// Send a new message
export const sendMessage = async (
  orderId: string,
  text: string,
  sender: 'driver' | 'customer'
): Promise<Message> => {
  // Create a new message
  const newMessage: Message = {
    id: generateMessageId(),
    text,
    sender,
    timestamp: new Date(),
    status: 'sending'
  }
  
  // Add to the messages array
  if (!mockChatMessages[orderId]) {
    mockChatMessages[orderId] = []
  }
  
  mockChatMessages[orderId].push(newMessage)
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Update message status to sent
  const messageIndex = mockChatMessages[orderId].findIndex(m => m.id === newMessage.id)
  if (messageIndex !== -1) {
    mockChatMessages[orderId][messageIndex].status = 'sent'
  }
  
  // Simulate customer response after a delay (only for driver messages)
  if (sender === 'driver') {
    setTimeout(() => {
      const responses = [
        "Thanks for the update!",
        "Ok, I'll be waiting.",
        "Great, see you soon!",
        "Please be careful with the food.",
        "Do you need any help finding the address?"
      ]
      
      const customerResponse: Message = {
        id: generateMessageId(),
        text: responses[Math.floor(Math.random() * responses.length)],
        sender: 'customer',
        timestamp: new Date(),
        status: 'delivered'
      }
      
      mockChatMessages[orderId].push(customerResponse)
    }, 5000 + Math.random() * 10000) // Random delay between 5-15 seconds
  }
  
  return newMessage
}

// Mark all messages as read
export const markMessagesAsRead = (orderId: string): void => {
  if (mockChatMessages[orderId]) {
    mockChatMessages[orderId] = mockChatMessages[orderId].map(message => ({
      ...message,
      status: message.sender === 'driver' ? 'read' : message.status
    }))
  }
}
