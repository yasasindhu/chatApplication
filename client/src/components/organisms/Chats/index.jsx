import { useEffect, useState, useContext } from "react";
import { UserContext } from '../hooks/UserContext/hook';
import Avatar from '../Avatar/index';
import { omit, uniqBy } from 'lodash';
import axios from "axios";
export default function Chats() {
    const [ws, setWs] = useState(null);
    const [onlinePeople, setOnlinePeople] = useState({});
    const [selectedUserId, setSelectedUserId] = useState(null);
    const { username, id } = useContext(UserContext);
    const [messages, setMessages] = useState([]);
    const [newMessageText, setNewMessageText] = useState('');
    useEffect(() => {
        const ws = new WebSocket(import.meta.env.VITE_WEBSOCKET_URL);
        setWs(ws);
        ws.addEventListener('message', handleMessage);
    }, []);

    function showOnlinePeople(peopleArray) {
        const people = {};
        peopleArray.forEach(({ userId, username }) => {
            people[userId] = username;
        })
        setOnlinePeople(people);
    }
    function handleMessage(event) {
        const messageData = JSON.parse(event.data);

        if ('online' in messageData) {
            showOnlinePeople(messageData.online);
        }
        else if ('text' in messageData) {
            console.log('hey chitti', messageData);
            setMessages(prev => ([...prev, { ...messageData }]))
        }

    }
    const onlinePeopleExcludingLoggedInUser = Object.fromEntries(
        Object.entries(onlinePeople).filter(([userId]) => userId !== id)
    );


    function sendMessage(e) {
        e.preventDefault();
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(
                JSON.stringify({
                    message: {
                        recipient: selectedUserId,
                        text: newMessageText,
                    },
                })
            );
        } else {
            console.log('WebSocket connection is not open');
        }
        setNewMessageText('');
        setMessages(prev => ([...prev, { text: newMessageText,
             sender:id,
            recipient:selectedUserId,
        _id:Date.now() }]))
    }
    useEffect(()=>{
    if(selectedUserId){
        axios.get('/messages/'+selectedUserId).then(res =>{
           setMessages(res.data);

        })
    }
    },[selectedUserId]);
    const messagesWithoutDupes=uniqBy(messages, '_id');
    return (
        <div className="flex h-screen">
            <div className="bg-white w-1/3 pl-4 pt-4 mb-4 p-4">
                <div className="text-blue-600 font-bold flex gap-2">MernChat
                    <div className="blue">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="blue" className="w-6 h-6">
                            <path d="M4.913 2.658c2.075-.27 4.19-.408 6.337-.408 2.147 0 4.262.139 6.337.408 1.922.25 3.291 1.861 3.405 3.727a4.403 4.403 0 00-1.032-.211 50.89 50.89 0 00-8.42 0c-2.358.196-4.04 2.19-4.04 4.434v4.286a4.47 4.47 0 002.433 3.984L7.28 21.53A.75.75 0 016 21v-4.03a48.527 48.527 0 01-1.087-.128C2.905 16.58 1.5 14.833 1.5 12.862V6.638c0-1.97 1.405-3.718 3.413-3.979z" />
                            <path d="M15.75 7.5c-1.376 0-2.739.057-4.086.169C10.124 7.797 9 9.103 9 10.609v4.285c0 1.507 1.128 2.814 2.67 2.94 1.243.102 2.5.157 3.768.165l2.782 2.781a.75.75 0 001.28-.53v-2.39l.33-.026c1.542-.125 2.67-1.433 2.67-2.94v-4.286c0-1.505-1.125-2.811-2.664-2.94A49.392 49.392 0 0015.75 7.5z" />

                        </svg>
                    </div>
                </div>
                {
                    Object.keys(onlinePeopleExcludingLoggedInUser).map(userId => (
                        <>
                            {userId != id && <div onClick={() => setSelectedUserId(userId)}
                                className={"border-b border-gray-100 py-2 pl-4 flex items-center gap-2 " + (userId === selectedUserId ? 'bg-blue-100' : '')}
                                key={userId} >
                                <Avatar username={onlinePeopleExcludingLoggedInUser[userId]} userId={userId} />
                                {onlinePeopleExcludingLoggedInUser[userId]}
                            </div>
                            }
                        </>
                    ))
                }
            </div>
            <div className="flex flex-col bg-blue-50 w-2/3 p-2">
                <div className="flex-grow">
                    {!selectedUserId && (
                        <div className="flex h-full flex-grow items-center justify-center">
                            <div className="text-gray-400">&larr;
                                select a person from the sidebar
                            </div>

                        </div>
                    )}
                    {!!selectedUserId && (
            <div className="relative h-full">
              <div className="overflow-y-scroll absolute top-0 left-0 right-0 bottom-2">
                {messagesWithoutDupes.map(message => (
                  <div key={message._id} className={(message.sender === id ? 'text-right': 'text-left')}>
                    <div className={"text-left inline-block p-2 my-2 rounded-md text-sm " +(message.sender === id ? 'bg-blue-500 text-white':'bg-white text-gray-500')}>
                      {message.text}
                    </div>
                  </div>
                ))}
                {/* <div ref={divUnderMessages}></div> */}
              </div>
            </div>
          )}
                </div>
                {selectedUserId &&
                    <form className="flex gap-2" onSubmit={sendMessage}>
                        <input type="text"
                            placeholder="Type your message here"
                            value={newMessageText}
                            onChange={e => { setNewMessageText(e.target.value) }}
                            className="bg-white border p-2 rounded" />
                        <button className="bg-blue-500" type="submit">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-6 h-6">
                                <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                            </svg>

                        </button>
                    </form>
                }
            </div>
        </div>
    )
}