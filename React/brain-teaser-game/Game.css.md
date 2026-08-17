/* src/Game.css */
.game-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background-color: #f0f0f0;
}

h1 {
    margin-bottom: 20px;
}

button {
    padding: 10px 20px;
    font-size: 16px;
    margin-bottom: 20px;
    cursor: pointer;
}

.grid {
    display: grid;
    grid-template-columns: repeat(4, 100px);
    gap: 10px;
}

.square {
    width: 100px;
    height: 100px;
    background-color: #ccc;
    border-radius: 10px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.square.lit {
    background-color: #ff5722;
}

.score {
    margin-top: 20px;
    font-size: 20px;
}
