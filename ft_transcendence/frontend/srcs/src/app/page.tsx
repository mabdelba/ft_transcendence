export default function home() {
  return (
    <main className="h-screen">
      <div className="ft_background">
        <div className="ft_board">
          <div className="ft_left">
            <div className="ft_edge"></div>
            <div className="ft_edge ft_edge-down"></div>
          </div>
          <div className="ft_right">
            <div className="ft_edge"></div>
            <div className="ft_edge ft_edge-down"></div>
          </div>
          <div className="ft_ball">
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center min-h-fit h-full min-w-fit">
          <h1 className="ft_title">Atari pong</h1>
          <button className="ft_button">log-in</button>
          <button className="ft_button">Register</button>
      </div>
    </main>
  )
}
