require_relative  "./bomber"

Window.height += 64

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

$enemy = Array.new
$enemy << Bomber::EnemyNormal.new( 1, 13, 0, 0.3)
$enemy << Bomber::EnemyNormal.new( 5, 12, 0, 0.4)
$enemy << Bomber::EnemyNormal.new( 8,  7, 0,   0)
$enemy << Bomber::EnemyNormal.new(10,  8, 0, 0.2)
$enemy << Bomber::EnemyNormal.new(12,  1, 0, 0.1)
$enemy << Bomber::EnemyNormal.new(13, 13, 0, 0.1)
$enemy << Bomber::EnemyNormal.new(15, 11, 0, 0.2)
$enemy << Bomber::EnemyNormal.new(18,  1, 0,   0)

$enemy.each do |ene|
  ene.on(:start) do
    while self.active do
      if self.active
        self.auto
      end
    end
  end
end

$all_obj << $blocks
$all_obj << $enemy
$all_obj << doors
$all_obj.flatten!

$hit_obj << $blocks
$hit_obj << $enemy
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

  on(:key_push, K_SPACE) do
    atack
  end
end

