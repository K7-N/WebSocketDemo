import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { useState } from "react"

export function TextareaWithLabel({state , setState, socket, setSocket, connect, sendMessage} : {state: String, setState: React.Dispatch<React.SetStateAction<string>>, socket: any, setSocket: any, connect: any, sendMessage: any}) {
    const [uname, setUname] = useState("")
    const [set, sset] = useState(false)
  return (
    <div className="grid w-full gap-1.5">
    <Label>User name</Label>
        {
            socket == null ?
            <Input onChange={e => setUname(e.target.value)} placeholder="John Smith" /> :
            <Input disabled value={uname}></Input>
        }
        {
            socket == null?
            <Label htmlFor="message">Websocket URL</Label>
            :
            <Label htmlFor="message">Enter message to send</Label>
        }
      <Textarea placeholder="Type Here" id="message" onChange={(e) => setState(e.target.value)}/>
    {socket == null ? 
      <Button onClick={() => {connect(state, setSocket, uname)}}>Connect to Websocket</Button>
    : 
      <Button onClick={() => {sendMessage(state, socket, uname, set, sset)}}>Send Message</Button>
    }
    </div>
  )
}
