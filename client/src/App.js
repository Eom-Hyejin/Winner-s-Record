import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import Login from "./pages/Login";
import Redirect from "./pages/Redirect";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Landing from "./pages/Landing";
import EditDoc from "./pages/EditDoc";
import Error from "./pages/Error";
import Main from "./pages/Main";
import Post from "./pages/Post";
import CreateDoc from "./pages/CreateDoc";
import Ranking from "./pages/Ranking";
import TournamentMain from "./pages/TournamentMain";
import Entry from "./pages/Entry";
import Chat from "./pages/Chat";

// styles
import "./styles/main.scss";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUserInfo } from "./modules/userInfo";
import { setLogin } from "./modules/isLogin";
import axios from "axios";
import Result from "./pages/TournamentResult";
import Tournament from "./pages/Tournament";
import Chatroom from "./pages/Chatroom";

function App() {
  const dispatch = useDispatch();
  const getUserInfo = () => {
    const Authorization = `Bearer ${localStorage.getItem("token")}`;
    axios
      .get("http://3.36.30.63/auth/me", { headers: { Authorization } })
      .then((res) => {
        console.log(res.data);
        dispatch(setLogin());
        dispatch(setUserInfo(res.data));
      });
  };

  useEffect(() => {
    getUserInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="app--container">
      <Router>
        <Switch>
          <Route exact path="/chat" component={Chat} />
          <Route path="/chat/:roomId" component={Chatroom} />
          <Route exact path="/">
            <Landing />
          </Route>
          <Route exact path="/post/:postId" component={Post} />
          <Route path="/post/:postId/entry">
            <Entry />
          </Route>
          <Route path="/post/:postId/tournament">
            <Tournament />
          </Route>
          <Route path="/post/:postId/result">
            <Result />
          </Route>
          <Route path="/main">
            <Main />
          </Route>
          <Route exact path="/tournament">
            <TournamentMain />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/redirect">
            <Redirect />
          </Route>
          <Route path="/signup">
            <Signup />
          </Route>
          <Route path={"/profile/:userId"} component={Profile} />
          <Route path="/doc">
            <CreateDoc />
          </Route>
          <Route path="/edit/:docId">
            <EditDoc />
          </Route>
          <Route path="/ranking">
            <Ranking />
          </Route>
          <Route path="/">
            <Error />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
