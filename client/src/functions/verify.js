import Axios from "axios";
import Cookies from "universal-cookie";

export const verify = async () => {
  const cookies = new Cookies();
  let result;
  cookies.get("session");
  if (cookies["cookies"]["session"] != null) {
    await Axios.post(
      "http://localhost:5000/account/verify",
      {},
      {
        headers: {
          session: cookies["cookies"]["session"],
        },
      }
    )
      .then(function (res) {
        result = res.data.result;
      })
      .catch(function (error) {
        result = false;
      });
  } else {
    result = false;
  }
  return result;
};

export default verify;