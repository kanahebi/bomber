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

$enemy = Array.new
$enemy << Bomber::EnemyNormal.new( 1, 13, 0, 0.3)
$enemy << Bomber::EnemyNormal.new( 5, 12, 0, 0.4)
$enemy << Bomber::EnemyNormal.new( 8,  7, 0,   0)
$enemy << Bomber::EnemyNormal.new(10,  8, 0, 0.2)
$enemy << Bomber::EnemyNormal.new(12,  1, 0, 0.1)
$enemy << Bomber::EnemyNormal.new(13, 13, 0, 0.1)
$enemy << Bomber::EnemyNormal.new(15, 11, 0, 0.2)
$enemy << Bomber::EnemyNormal.new(18,  1, 0,   0)
$enemy << Bomber::EnemyTrace.new(  5, 11, 0, player)
$enemy << Bomber::EnemyTrace.new(  7,  3, 0, player)
$enemy << Bomber::EnemyTrace.new(  7,  6, 0, player)
$enemy << Bomber::EnemyTrace.new(  8,  9, 0, player)
$enemy << Bomber::EnemyTrace.new( 13,  1, 0, player)
$enemy << Bomber::EnemyTrace.new( 14,  3, 0, player)
$enemy << Bomber::EnemyShooter.new(6, 10, 0, 0.3)
$enemy << Bomber::EnemyShooter.new(10, 4, 0, 0.3)
$enemy << Bomber::EnemyWizard.new(13,  9, 0)
$enemy << Bomber::EnemyWizard.new(15, 13, 0)
$enemy << Bomber::EnemyHammer.new(10,  3, 0)
$enemy << Bomber::EnemyHammer.new(10, 13, 0)

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


statusbar1 = Bomber::Statusbar.new("../image/ene.png", 0, 15, 0)
statusbar1.on(:start) do
  loop do
    self.enemy_status(normal_enemy_count)
  end
end

statusbar2 = Bomber::Statusbar.new("../image/ene2.png", 2, 15, 0)
statusbar2.on(:start) do
  loop do
    self.enemy_status(trace_enemy_count)
  end
end

statusbar3 = Bomber::Statusbar.new("../image/wiz.png", 4, 15, 0)
statusbar3.on(:start) do
  loop do
    self.enemy_status(wizard_enemy_count)
  end
end

statusbar4 = Bomber::Statusbar.new("../image/hun.png", 6, 15, 0)
statusbar4.on(:start) do
  loop do
    self.enemy_status(hammer_enemy_count)
  end
end

statusbar5 = Bomber::Statusbar.new("../image/bow.png", 8, 15, 0)
statusbar5.on(:start) do
  loop do
    self.enemy_status(shooter_enemy_count)
  end
end

timer = Bomber::Timer.new("../image/clear.png", 10, 15, 0, 30)
timer.on(:start) do
  loop do
    self.time_status
  end
end

score = Bomber::Score.new("../image/clear.png", 16, 15, 0)
score.on(:start) do
  loop do
    self.score_status
  end
end
