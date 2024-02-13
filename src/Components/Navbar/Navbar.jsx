import Profile from "../../Container/Cards/Profile";
import Search from "../../Container/UI/Serach/Search";
import { useEffect, useState } from "react";
import apiInstance from "../../axios/axiosInstance";
import SpinnerUser from "../../Container/UI/SpinnerUser/SpinnerUser";
import { addUserToChat } from "../../store/Slices/chatSlice.js";
import { useDispatch, useSelector } from "react-redux";
import { socket } from "../Socket/Socket.js";
import PropTypes from "prop-types";
import { useNavigate } from "react-router";

export default function Navbar({ showResponsive, setResponsive }) {
  const navigate = useNavigate();
  const { name, _id } = useSelector((state) => state.user.userData);
  const dispatch = useDispatch();
  const { chats } = useSelector((state) => state.chat);
  const [users, setUsers] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    socket.on("chatExist", (data) => {
      const name = data.users.filter((item) => item._id !== _id)[0].name;
      navigateHandler(data._id, name);
    });
    return () => {
      socket.off("chatExist");
    };
  }, []);

  useEffect(() => {
    if (searchValue.trim() === "") return;
    setLoading(true);

    const delayDebounceFn = setTimeout(() => {
      findUsers();
    }, 3000);

    return () => clearTimeout(delayDebounceFn);
  }, [searchValue]);

  const accessChat = (id) => {
    socket.emit("accessChat", id, (res) => {
      socket.emit("getChat", res.chatId, (response) => {
        dispatch(addUserToChat(response[0]));
        const name = response[0].users.filter((item) => item._id !== _id)[0]
          .name;
        navigateHandler(response[0]._id, name);
      });
    });
  };

  const navigateHandler = (id, name) => {
    setSearchValue("");
    setUsers(null);
    navigate("/Chat/" + id, { state: name });
    setResponsive(false);
  };

  const changeHandler = (e) => {
    setSearchValue(e.target.value);
  };

  const findUsers = function () {
    apiInstance(`/api/user/searchUser?search=${searchValue}`)
      .then((res) => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  };

  return (
    <nav
      className={`fixed w-1/12 top-0 bottom-0 transition-all ${
        showResponsive ? "w-5/12" : ""
      } sm:w-1/5 overflow-hidden flex flex-col`}
    >
      <div className="flex whitespace-break-spaces w-full sm:w-10/12 items-center m-auto mt-5">
        <img
          className="rounded-full border border-blue-500"
          src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
          width={60}
          alt=""
        />
        <div className="ml-1 sm:ml-4">
          <h1 className="text-blue-600 text-base sm:text-xl font-bold">
            {name.toUpperCase()}
          </h1>
        </div>
      </div>
      <Search value={searchValue} changeHandler={changeHandler} />
      <div className="overflow-y-auto flex-1">
        {!searchValue ? (
          chats?.length == 0 || !chats ? (
            <p className="text-center">Search a User and have fun!</p>
          ) : (
            chats.map((chat) => {
              return (
                <Profile
                  id={chat._id}
                  key={chat._id}
                  name={chat.users[0].name}
                  hasNewMessage={chat.hasNewMessage}
                />
              );
            })
          )
        ) : loading ? (
          <SpinnerUser />
        ) : !users || users.length == 0 ? (
          <p className="text-center">No user to show!</p>
        ) : (
          users.map((user) => {
            return (
              <Profile
                handler={() => accessChat(user._id)}
                key={user._id}
                id={user._id}
                name={user.name}
              />
            );
          })
        )}
      </div>
    </nav>
  );
}

Navbar.propTypes = {
  showResponsive: PropTypes.bool,
  setResponsive: PropTypes.func,
};
