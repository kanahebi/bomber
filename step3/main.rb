require_relative  "./bomber"

Window.height += 64

$score = 0

$all_obj = Array.new
$hit_obj = Array.new

player = Bomber::Player.new(1, 1, 0)
$all_obj << player
$all_obj.flatten!

$hit_obj << player
$hit_obj.flatten!

player.on(:start) do
  on(:key_down, K_RIGHT) do
    self.move(:right)
  end

  on(:key_down, K_LEFT) do
    self.move(:left)
  end

  on(:key_down, K_UP) do
    self.move(:up)
  end

  on(:key_down, K_DOWN) do
    self.move(:down)
  end

end
