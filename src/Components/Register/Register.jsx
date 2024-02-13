import { useState, useRef, useEffect } from "react";
import CoverImage from "/coverimage.svg";
import Navigator from "../../Container/Navigtors/Navigator";
import { gsap } from "gsap";
import Password from "../../Container/UI/Input/password";
import { useDispatch } from "react-redux";
import { loginUser, signUpUser } from "../../store/Slices/userSlice";
import { useSelector } from "react-redux";
import Spinner from "../../Container/UI/Spinner/Spinner";
import { ToastContainer, toast } from "react-toastify";

export default function Register() {
  const { loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const elementRef = useRef(null);
  const formRef = useRef(null);
  const [selected, setSelected] = useState(true);
  const [hide, setHide] = useState(true);

  useEffect(() => {
    if (selected) {
      gsap.to(elementRef.current, {
        opacity: 1,
        x: 0,
        duration: 0.2,
        ease: "power1.in",
      });
      gsap.to(formRef.current, {
        opacity: 1,
        marginLeft: "6px",
        duration: 0.2,
        ease: "power1.in",
      });
    } else {
      gsap.to(elementRef.current, {
        opacity: 1,
        x: "95%",
        duration: 0.3,
        ease: "power1.out",
      });
      gsap.to(formRef.current, {
        opacity: 1,
        marginLeft: "-100%",
        duration: 0.3,
        ease: "power1.out",
      });
    }
  }, [selected]);

  const loginHandler = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    if (data.email.trim() === "" || data.password.trim() === "") {
      toast.error("All fields are required");
    }
    dispatch(loginUser(data));
  };

  const SignUpHandler = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    if (
      data.email.trim() === "" ||
      data.password.trim() === "" ||
      data.name.trim() === ""
    ) {
      toast.error("All fields are required");
    }
    dispatch(signUpUser(data));
  };

  const showError = () => {
    const message = error.response.data.error || error.message;
    toast.error(message);
  };

  return (
    <div className="flex flex-row">
      <ToastContainer />
      {error ? showError() : null}
      <div className="w-3/5 z-0 h-[100dvh] bg-[#41529e]">
        <img
          className="w-3/4 z-0 h-full object-contain m-auto"
          src={CoverImage}
          alt="coverImage here abstract"
        />
      </div>

      <div className="Register z-10 h-full flex flex-col items-center justify-center">
        <div className="border-b pb-2 relative border-blacks flex lg:w-2/5 sm:w-4/5 justify-around">
          <span
            ref={elementRef}
            className={[
              "absolute w-1/2 -z-10 rounded-full bg-blue-600 top-0 left-0 h-[90%] transition duration-75",
            ].join(" ")}
          ></span>
          <Navigator
            text={"Log In"}
            active={selected}
            func={() => setSelected(true)}
          />
          <Navigator
            text={"Sign Up"}
            active={!selected}
            func={() => setSelected(false)}
          />
        </div>

        {/* form for login and sign up */}

        <div className="w-full flex justify-center">
          <div className="lg:w-1/2 sm:w-5/6 p-1 flex overflow-hidden">
            {loading ? (
              <Spinner />
            ) : (
              <>
                <form
                  onSubmit={loginHandler}
                  ref={formRef}
                  className="form ml-1"
                >
                  <label htmlFor="email">Email:</label>
                  <input
                    required={true}
                    type="email"
                    placeholder="johnwick@email.com"
                    name="email"
                    id="email"
                  />

                  <label htmlFor="password">Password:</label>
                  <Password
                    required={true}
                    hide={hide}
                    func={() => setHide(!hide)}
                  />

                  <button> Log In! </button>
                </form>

                <form onSubmit={SignUpHandler} className="form ml-2">
                  <label htmlFor="name">Name:</label>
                  <input
                    required={true}
                    type="text"
                    name="name"
                    id="name"
                    placeholder="John wick"
                  />

                  <label htmlFor="email">Email:</label>
                  <input
                    type="text"
                    placeholder="johnwick@email.com"
                    name="email"
                    id="email"
                  />

                  <label htmlFor="password">Password:</label>
                  <Password hide={hide} func={() => setHide(!hide)} />

                  <button> Sign UP! </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
