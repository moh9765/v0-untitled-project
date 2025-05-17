"use client"

import { useState, useRef, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

export type Message = {
  id: string
  text: string
  sender: 'driver' | 'customer'
  timestamp: Date
  status: 'sending' | 'sent' | 'delivered' | 'read' | 'error'
}

type ChatDialogProps = {
  isOpen: boolean
  onClose: () => void
  orderId: string
  customerName: string
  messages: Message[]
  onSendMessage: (text: string) => void
  isSending: boolean
}

export function ChatDialog({
  isOpen,
  onClose,
  orderId,
  customerName,
  messages,
  onSendMessage,
  isSending
}: ChatDialogProps) {
  const [newMessage, setNewMessage] = useState("")
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current
      scrollContainer.scrollTop = scrollContainer.scrollHeight
    }
  }, [messages])

  // Focus input when dialog opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [isOpen])

  const handleSendMessage = () => {
    if (newMessage.trim() && !isSending) {
      onSendMessage(newMessage.trim())
      setNewMessage("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Chat with {customerName}
            <span className="text-xs text-muted-foreground font-normal">
              Order #{orderId}
            </span>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea ref={scrollAreaRef} className="flex-1 p-4 h-[50vh] border rounded-md">
          <div className="flex flex-col gap-3">
            {messages.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                No messages yet. Start the conversation!
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex flex-col max-w-[80%] rounded-lg p-3",
                    message.sender === "driver"
                      ? "bg-primary text-primary-foreground self-end"
                      : "bg-muted self-start"
                  )}
                >
                  <div className="text-sm">{message.text}</div>
                  <div className="text-xs opacity-70 self-end mt-1 flex items-center gap-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    {message.sender === "driver" && (
                      <span>
                        {message.status === 'sending' && '•'}
                        {message.status === 'sent' && '✓'}
                        {message.status === 'delivered' && '✓✓'}
                        {message.status === 'read' && '✓✓'}
                        {message.status === 'error' && '!'}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        <DialogFooter className="flex-row items-center gap-2 sm:gap-0">
          <div className="flex-1 relative">
            <Input
              ref={inputRef}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="pr-10"
              disabled={isSending}
            />
          </div>
          <Button 
            onClick={handleSendMessage} 
            size="icon" 
            disabled={!newMessage.trim() || isSending}
          >
            {isSending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            <span className="sr-only">Send message</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
