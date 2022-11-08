import Axios from "axios";
import Cookies from "universal-cookie";

export const logout = async () => {
  const cookies = new Cookies();
  cookies.get("session");
  if (cookies["cookies"]["session"] != null) {
    await Axios.post(
      "http://localhost:5000/account/logout",
      {},
      {
        headers: {
          session: cookies["cookies"]["session"],
        },
      }
    );
  }
};

export default logout;
