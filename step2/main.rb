require_relative  "./bomber"

Window.height += 64

player = Bomber::Player.new(1, 1, 0)

player.on(:start) do
end
