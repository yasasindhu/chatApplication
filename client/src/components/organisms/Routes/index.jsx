import Register from "../Register/index";
import {useContext} from "react";
import {UserContext} from "../../organisms/hooks/UserContext/hook";
import Chat from "../Chats/index";

export default function Routes() {
  const {username} = useContext(UserContext);

  if (username) {
    return <Chat />;
  }

  return (
    <Register />
  );
}