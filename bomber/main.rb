require "./bomber"
require "yaml"

$all_obj = Array.new
$hit_obj = Array.new
$blocks = Array.new
datas = YAML.load_file("./config.yml")
datas.each do |data|
  $blocks << block =  Bomber::Block.new(data)
end
$all_obj << door = Bomber::Door.new(11, 14)
$all_obj << ono = Bomber::Ono.new("../image/kao.png", 1, 1, 0)
$enemy = Array.new
$enemy << hayashi1 = Bomber::Hayashi.new("../image/hayashi.png", 18, 1, 0, 0)
$enemy << hayashi2 = Bomber::Hayashi.new("../image/hayashi.png", 12, 1, 0, 0.1)
$enemy << hayashi3 = Bomber::Hayashi.new("../image/hayashi.png", 10, 8, 0, 0.2)
$enemy << hayashi4 = Bomber::Hayashi.new("../image/hayashi.png", 1, 13, 0, 0.3)
$enemy << hayashi5 = Bomber::Hayashi.new("../image/hayashi.png", 5, 12, 0, 0.4)
$enemy << hayashi6 = Bomber::Hayashi.new("../image/hayashi.png", 8, 7, 0, 0)
$enemy << hayashi7 = Bomber::Hayashi.new("../image/hayashi.png", 13, 13, 0, 0.1)
$enemy << hayashi8 = Bomber::Hayashi.new("../image/hayashi.png", 15, 11, 0, 0.2)
$enemy << hayashi9 = Bomber::Hayashi.new("../image/hayashi.png", 6, 10, 0, 0.3)
$enemy << hayashi10 = Bomber::Hayashi.new("../image/hayashi.png", 3, 9, 0, 0.4)
$enemy << mori = Bomber::Mori.new("../image/mori.png", 15, 12, 0, ono)

$all_obj << $blocks + $enemy
$all_obj.flatten!
$hit_obj << $blocks + $enemy
$hit_obj << ono
$hit_obj << door
$hit_obj.flatten!

Window.height += 64

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
    sleep 0.2
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
