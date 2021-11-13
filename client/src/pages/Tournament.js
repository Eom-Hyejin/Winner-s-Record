import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useHistory } from "react-router";
import { modalOn } from "../modules/isModalOpen";
import { setModalText } from "../modules/modalText";
import TournamentEditModal from "../components/Tournament/TournamentEditModal";
import TournamentMatch from "../components/Tournament/TournamentMatch";
import TournamentModal from "../components/Tournament/TournamentModal";
import Header from "../components/Header";
import Footer from "../components/Footer";
import BackButton from "../components/BackButton";
import TopButton from "../components/TopButton";

const Tournament = () => {
  const { isLogin, userInfo, isModalOpen } = useSelector((state) => ({
    isLogin: state.isLogin,
    userInfo: state.userInfo,
    isModalOpen: state.isModalOpen,
  }));
  const history = useHistory();
  const dispatch = useDispatch();

  const [matches, setMatches] = useState([]);
  const [canEdit, setCanEdit] = useState([true, true, true]);
  const [host, setHost] = useState("");
  const [matchStatus, setMatchStatus] = useState("진행");

  // [ 매치id, postId, player1, player2 ]
  const [matchToEdit, setMatchToEdit] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    console.log("토너먼트 매치 데이터", matches);
    console.log("유저정보 확인", userInfo);

    const r2 = matches.filter((match) => {
      return match.type === "tournamentR2";
    });
    const r3 = matches.filter((match) => {
      return match.type === "tournamentR3";
    });

    const winner = r3.filter((match) => {
      return match.winner;
    });
    if (matchStatus === "완료") {
      setCanEdit([false, false, false]);
    } else if (r3.length && userInfo.userId === host) {
      setCanEdit([false, false, true]);
    } else if (r2.length && userInfo.userId === host) {
      setCanEdit([false, true, true]);
    } else if (userInfo.userId === host) {
      setCanEdit([true, true, true]);
    } else {
      setCanEdit([false, false, false]);
    }
  }, [matches]);

  useEffect(() => {
    console.log(canEdit);
  }, [canEdit]);

  useEffect(() => {
    getData();
    getStatus();
  }, []);

  const { postId } = useParams();
  const getStatus = () => {
    const Authorization = `Bearer ${localStorage.getItem("token")}`;
    axios
      .get(`https://server.winner-s-record.link/doc/${postId}`, {
        headers: { Authorization },
        withCredentials: true,
      })
      .then((res) => {
        setMatchStatus(res.data.data.status);
      })
      .catch((res) => {
        console.error(res);
      });
  };
  const getData = () => {
    const Authorization = `Bearer ${localStorage.getItem("token")}`;

    axios
      .get(`https://server.winner-s-record.link/tournament/${postId}`, {
        headers: { Authorization },
      })
      .then((res) => {
        console.log(res.data);
        setMatches(res.data.data);
        setHost(res.data.hostId);
      });
  };

  const endRound = (round) => {
    const Authorization = `Bearer ${localStorage.getItem("token")}`;

    let matchId = [];

    if (round === 1) {
      matchId = matches
        .filter((match) => {
          return match.type === "tournamentR1" && match.winner;
        })
        .map((match) => {
          return match.id;
        });
    } else if (round === 2) {
      matchId = matches
        .filter((match) => {
          return match.type === "tournamentR2" && match.winner;
        })
        .map((match) => {
          return match.id;
        });
    } else {
      matchId = matches
        .filter((match) => {
          return match.type === "tournamentR3" && match.winner;
        })
        .map((match) => {
          return match.id;
        });
    }

    const round2 = matches.filter((match) => {
      return match.type === "tournamentR2";
    });
    const round3 = matches.filter((match) => {
      return match.type === "tournamentR3";
    });

    const event = matches[0].event;
    console.log(matches);
    console.log("매치 아이디", matchId);
    console.log(userInfo.userId, host);

    if (userInfo.userId !== host) {
      dispatch(setModalText("해당 조작은 주최자만 할 수 있어요."));
      dispatch(modalOn());
    } else if (round === 1 && matchId.length !== 4) {
      dispatch(setModalText("진행중인 경기가 있습니다."));
      dispatch(modalOn());
    } else if (round === 1 && round2.length) {
      dispatch(setModalText("이미 종료된 라운드입니다."));
      dispatch(modalOn());
    } else if (round === 2 && matchId.length !== 2) {
      dispatch(setModalText("진행중인 경기가 있습니다."));
      dispatch(modalOn());
    } else if (round === 2 && round3.length) {
      dispatch(setModalText("이미 종료된 라운드입니다."));
      dispatch(modalOn());
    } else if (round === 3 && matchId.length !== 1) {
      dispatch(setModalText("진행중인 경기가 있습니다."));
      dispatch(modalOn());
    } else if (round === 3) {
      axios
        .post(
          `https://server.winner-s-record.link/record/${postId}`,
          { event, matchId },
          {
            headers: {
              Authorization,
            },
          }
        )
        .then((res) => {
          setMatches(res.data.data);
          history.push(`/post/${postId}/result`);
          dispatch(modalOn());
          dispatch(setModalText("대회가 종료되었습니다 !"));
        });
    } else {
      axios
        .post(
          `https://server.winner-s-record.link/record/${postId}`,
          { event, matchId },
          {
            headers: {
              Authorization,
            },
          }
        )
        .then((res) => {
          setMatches(res.data.data);
        });
    }
  };

  return (
    <div className="tournament--container">
      <Header />
      <div className="tournament--inner">
        <div className="title">TOURNAMENT</div>
        <div className="round">
          <div className="text">예선</div>
          {userInfo.userId === host ? (
            <div
              className="btn colored"
              onClick={() => {
                endRound(1);
              }}
            >
              <span>라운드 종료</span>
            </div>
          ) : null}
        </div>
        <ul className="player--container">
          {matches
            .filter((matchData) => {
              if (matchData.type !== "tournamentR1") {
                return false;
              } else {
                return true;
              }
            })
            .map((matchData) => {
              return (
                <TournamentMatch
                  host={host}
                  matchData={matchData}
                  setMatchToEdit={setMatchToEdit}
                  canEdit={canEdit[0]}
                  setIsEditModalOpen={setIsEditModalOpen}
                />
              );
            })}
        </ul>
        <div className="round">
          <div className="text">준결승</div>
          {userInfo.userId === host ? (
            <div
              className="btn colored"
              onClick={() => {
                endRound(2);
              }}
            >
              라운드 종료
            </div>
          ) : null}
        </div>
        <ul className="player--container">
          {matches
            .filter((matchData) => {
              if (matchData.type !== "tournamentR2") {
                return false;
              } else {
                return true;
              }
            })
            .map((matchData) => {
              return (
                <TournamentMatch
                  host={host}
                  matchData={matchData}
                  setMatchToEdit={setMatchToEdit}
                  canEdit={canEdit[1]}
                  setIsEditModalOpen={setIsEditModalOpen}
                />
              );
            })}
        </ul>
        <div className="round">
          <div className="text">결승</div>
        </div>
        <ul className="player--container">
          {matches
            .filter((matchData) => {
              if (matchData.type !== "tournamentR3") {
                return false;
              } else {
                return true;
              }
            })
            .map((matchData) => {
              return (
                <TournamentMatch
                  host={host}
                  matchData={matchData}
                  setMatchToEdit={setMatchToEdit}
                  canEdit={canEdit[2]}
                  setIsEditModalOpen={setIsEditModalOpen}
                />
              );
            })}
        </ul>
        {userInfo.userId === host ? (
          <div className="tournament--btn--container colored">
            <div
              onClick={() => {
                endRound(3);
              }}
            >
              대회 종료
            </div>
          </div>
        ) : null}
      </div>

      {isEditModalOpen ? (
        <TournamentEditModal
          matchToEdit={matchToEdit}
          setMatches={setMatches}
          setIsEditModalOpen={setIsEditModalOpen}
        />
      ) : null}
      <Footer />
      <BackButton />
      <TopButton />

      {isModalOpen ? <TournamentModal /> : null}
    </div>
  );
};

export default Tournament;
