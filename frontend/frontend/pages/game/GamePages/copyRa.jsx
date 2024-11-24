import React from 'react';
import './../GameCss/App.css';
import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import api from "../../../api";

const SoloPage = () => {
    const location = useLocation();
    const { color, round } = location.state || {};
    const [score_max, setScoreMax] = useState(round || 5);
    const table_color = color || "#000";
    let white = "#fff";
    if (table_color == "white")
        white = "#000";
    const canvasRef = useRef(null);
    const [socket, setSocket] = useState(null);
    const [gameState, setGameState] = useState({
        canvas: { width: 800, height: 500 },
        ball: { x: 400, y: 250, radius: 10 },
        paddles: {
            user1: { y: 200, height: 100 },
            user2: { y: 200, height: 100 }
        },
        scores: { user1: 0, user2: 0 },
        status: 'waiting', // waiting, running, paused
        winner: 'none'
    });
    const [readyToPlay, setReadyToPlay] = useState(false);

    useEffect(() => {
        const newSocket = new WebSocket(`ws://${window.location.hostname}:8000/ws/pong/`);
        setSocket(newSocket);

        newSocket.onopen = () => {
            console.log('WebSocket connection opened');
            const msg = JSON.stringify({
                type: 'score_max',
                score_max: score_max,
            });
            setReadyToPlay(true);
            newSocket.send(msg);
        };
        
        newSocket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setGameState(prevState => ({
                ...prevState,
                ...data,
            }));

            // If the server has determined the final score_max, update the score_max state
            if (data.score_max) {
                setScoreMax(data.score_max);
            }
        };
        
        newSocket.onclose = () => {
            console.log('WebSocket connection closed');
        };

        return () => {
            newSocket.close();
        };
    }, []);

    useEffect(() => {
        renderGame();
    }, [gameState]);


    const infos = {
        net_x: 0,
        net_y: 0,
        net_width: 2,
        net_height: 10,
        net_color: white,
        paddles_color: "#bc79dc",
        ball_color: "#bc79dc",
        ball_shasow_color: "#beaeb1",
    };
    const drawRoundedRect = (ctx, x, y, width, height, color, radius) => {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.arcTo(x + width, y, x + width, y + height, radius);
        ctx.arcTo(x + width, y + height, x, y + height, radius);
        ctx.arcTo(x, y + height, x, y, radius);
        ctx.arcTo(x, y, x + width, y, radius);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
    };
    const drawNet = (ctx) => {
        for (let i = 15; i <= gameState.canvas.height - 15; i += 15) {
            drawRoundedRect(ctx, gameState.canvas.width / 2, infos.net_y + i, infos.net_width, infos.net_height, infos.net_color, 2.01);
        }
    };
    const drawText = (ctx, text, x, y, color, size) => {
        ctx.fillStyle = color;
        ctx.font = `bold ${size}px Arial, sans-serif`;
        ctx.fillText(text, x, y);
    };
    const drawArc = (ctx, x, y, r, color) => {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
    };
    const drawRect = (ctx, x, y, w, h, color) => {
        ctx.fillStyle = color;
        ctx.fillRect(x, y, w, h);
    };
    const renderGame = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!canvas || !ctx) return;
        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawRect(ctx, 0, 0, canvas.width, canvas.height, table_color);

        // Draw net
        drawNet(ctx);
        // Draw scores
        drawText(ctx, gameState.scores.user1, canvas.width / 4, canvas.height / 8, '#bc79dc', 48);
        drawText(ctx, gameState.scores.user2, canvas.width * (3 / 4), canvas.height / 8, '#bc79dc', 48);
        drawArc(ctx, gameState.ball.x, gameState.ball.y,gameState.ball.radius,infos.ball_color);
        // Draw paddles
        drawRoundedRect(ctx, 5, gameState.paddles.user1.y, 10, gameState.paddles.user1.height, infos.paddles_color, 5);
        drawRoundedRect(ctx, canvas.width - 15, gameState.paddles.user2.y, 10, gameState.paddles.user2.height, infos.paddles_color, 5);
        if (gameState.scores.user1 == score_max)
            drawText(ctx, "Winner Is User 1", canvas.width / 4, canvas.height / 2, white, 48);
        if (gameState.scores.user2 == score_max)
            drawText(ctx, "Winner Is User 2", canvas.width / 4, canvas.height / 2, white, 48);
    };
    
    const handleKeyDown = (e) => {
        if (!socket) return;
    
        let direction;
        if (e.key === 'ArrowUp') {
            direction = 'up';
        } else if (e.key === 'ArrowDown') {
            direction = 'down';
        } else {
            return;
        }
    
        const message = JSON.stringify({
            type: 'paddle_move',
            direction: direction
        });
        socket.send(message);
    };

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [socket]);

    
    const [username, setUsername] = useState("");
    const [level, setLevel] = useState(1);
    const [percent, setPercent] = useState(1);
    const [isOnline, setIsOnline] = useState(false);
    const [image, setImage] = useState("");

     useEffect(() => {
        getUserProfile();
    }, []);

    const getUserProfile = () => {
        api
            .get(`http://${window.location.hostname}:8000/api/user/profile/`)
            .then((res) => {
                setUsername(res.data.username);
                setLevel(res.data.level);
                setPercent(res.data.percent);
                setIsOnline(res.data.is_online);
                setImage(res.data.profile_image);
            })
            .catch((err) => toast.error(err));
    };
    return (
        <>
            <div className="pong-game-container">
                <div className="game-container">
                    <div className="users-info">
                        <div className="user-info">
                            {image && <img src={`http://${window.location.hostname}:8000${image}`} className="user-avatar" alt="user 1"  style={{ width: "100px", height: "100px" }} />}
                            <div className="user-details">
                                <p className="user-name">{username}</p>
                                <p className="user-score">Score: {gameState.scores.user1}</p>
                            </div>
                        </div>
                        <p id="vs">VS</p>
                        <div className="user-info">
                            <div className="user-details">
                                <p className="user-name">{username}</p>
                                <p className="user-score">Score: {gameState.scores.user2}</p>
                            </div>
                            {image && <img src={`http://${window.location.hostname}:8000${image}`} className="user-avatar" alt="user 1"  style={{ width: "100px", height: "100px" }} />}
                            {/* <img src={user1Image} alt="user 2" className="user-avatar" /> */}
                        </div>
                    </div>
                    <canvas ref={canvasRef} width="800" height="500" id="pong"></canvas>
                </div>
            </div>
        </>
    );
};

export default SoloPage;