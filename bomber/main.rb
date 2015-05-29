require "./bomber"
require "yaml"

Window.height += 96
$all_obj = Array.new
$hit_obj = Array.new
$blocks = Array.new
doors = Array.new
datas = YAML.load_file("./config.yml")
datas.each do |data|
  $blocks << block =  Bomber::Block.new(data)
end
doors << door1 = Bomber::Door.new( 8,  4, :up)
doors << door2 = Bomber::Door.new( 6,  6, :left)
doors << door3 = Bomber::Door.new(10,  6, :right)
doors << door4 = Bomber::Door.new( 8,  8, :down)
$all_obj << ono = Bomber::Player.new(1, 1, 0)
$enemy = Array.new
$enemy << hayashi1  = Bomber::EnemyNormal.new(18,  1, 0,   0)
$enemy << hayashi2  = Bomber::EnemyNormal.new(12,  1, 0, 0.1)
$enemy << hayashi3  = Bomber::EnemyNormal.new(10,  8, 0, 0.2)
$enemy << hayashi4  = Bomber::EnemyNormal.new( 1, 13, 0, 0.3)
$enemy << hayashi5  = Bomber::EnemyNormal.new( 5, 12, 0, 0.4)
$enemy << hayashi6  = Bomber::EnemyNormal.new( 8,  7, 0,   0)
$enemy << hayashi7  = Bomber::EnemyNormal.new(13, 13, 0, 0.1)
$enemy << hayashi8  = Bomber::EnemyNormal.new(15, 11, 0, 0.2)
$enemy << hayashi9  = Bomber::EnemyNormal.new( 6, 10, 0, 0.3)
$enemy << hayashi10 = Bomber::EnemyNormal.new( 3,  9, 0, 0.4)
$enemy << mori1     = Bomber::EnemyTrace.new( 15, 12, 0, ono)
$enemy << mori2     = Bomber::EnemyTrace.new(  7,  3, 0, ono)
$enemy << mori3     = Bomber::EnemyTrace.new( 13,  1, 0, ono)
$enemy << mori4     = Bomber::EnemyTrace.new(  8,  9, 0, ono)
$enemy << mori5     = Bomber::EnemyTrace.new( 14,  1, 0, ono)
$enemy << mori6     = Bomber::EnemyTrace.new(  5,  3, 0, ono)
$enemy << mori7     = Bomber::EnemyTrace.new(  7,  6, 0, ono)
$enemy << mori8     = Bomber::EnemyTrace.new( 10,  9, 0, ono)

$all_obj << $blocks + $enemy + doors
$all_obj.flatten!
$hit_obj << $blocks + $enemy + doors
$hit_obj << ono
$hit_obj.flatten!


ono.on(:start) do
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
    puts trace_enemy_count
  end
end

$enemy.each do |ene|
  ene.on(:start) do
    loop do
      if self.active
        self.auto
      end
    end
  end
end
