require_relative  "./bomber"

Window.height += 64

$score = 0

$all_obj = Array.new
$hit_obj = Array.new

$blocks = Array.new
datas = YAML.load_file(File.expand_path("../config.yml", __FILE__))
datas.each do |data|
  $blocks << block =  Bomber::Block.new(data)
end

doors = Array.new
doors << door1 = Bomber::Door.new( 8,  4, :up)
doors << door2 = Bomber::Door.new( 6,  6, :left)
doors << door3 = Bomber::Door.new(10,  6, :right)
doors << door4 = Bomber::Door.new( 8,  8, :down)

player = Bomber::Player.new(1, 1, 0)
$all_obj << player
$all_obj << $blocks
$all_obj << doors
$all_obj.flatten!

$hit_obj << $blocks
$hit_obj << doors
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
