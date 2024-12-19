import { useEffect, useState } from 'react'
import './App.css'
import { TextareaWithLabel } from './components/textlabel'
import { ScrollArea } from './components/ui/scroll-area'


function App() {
  const [url, setUrl] = useState("")
  const [list, setList] = useState<String[]>([])
  const [socket, setSocket] = useState<WebSocket | null>(null);
  
  useEffect(() =>{
    if(socket != null){
    socket.onmessage = (event) =>{
      const message = event.data;
      setList((prevMessages) => [...prevMessages, message]);
    }
  }
  }, [socket])
  return (
    <>
<div className="flex justify-center items-center text-center m-10">
  <h1 className="text-5xl font-black">Websocket Connector</h1>
</div>
<div className="mx-10">
      <TextareaWithLabel state={url} setState={setUrl} socket={socket} setSocket={setSocket} connect={connect} sendMessage={sendMessage} />
  </div>
  <div className="flex justify-center items-center  m-10">
      <ScrollArea className="h-[700px] w-10/12 rounded-md border p-5">
      <ul>
        {list.map((item, index) => (
          <li key={index} className='mt-0.5'>
            {item}{" "}
          </li>
        ))}
      </ul>
      </ScrollArea>
    </div>
    </>
  )
}

function connect(url: string, setSocket: React.Dispatch<React.SetStateAction<WebSocket | null>>, uname: string){
  if (uname == null || uname == "" || url == null || url == ""){
    return;
  }
  const ws = new WebSocket(`${url}`);
    setSocket(ws)
}
const sendMessage = (message: string, socket:WebSocket, uname: string, sent: boolean, sset: React.Dispatch<React.SetStateAction<boolean>>)=>{
  if (socket && socket.readyState === WebSocket.OPEN) {
    if(!sent){
      socket.send(uname);
      sset(true)
    }
    socket.send(message);
  } else {
    console.error("WebSocket is not open");
  }
};

export default App
