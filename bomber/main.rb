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
doors << door1 = Bomber::Door.new(11, 14, :up)
doors << door2 = Bomber::Door.new( 8,  4, :up)
doors << door3 = Bomber::Door.new( 6,  6, :left)
doors << door4 = Bomber::Door.new(10,  6, :right)
doors << door5 = Bomber::Door.new( 8,  8, :down)
doors << ono = Bomber::Ono.new("../image/kao.png", 1, 1, 0)
$enemy = Array.new
$enemy << hayashi1  = Bomber::Hayashi.new("../image/hayashi.png", 18,  1, 0,   0)
$enemy << hayashi2  = Bomber::Hayashi.new("../image/hayashi.png", 12,  1, 0, 0.1)
$enemy << hayashi3  = Bomber::Hayashi.new("../image/hayashi.png", 10,  8, 0, 0.2)
$enemy << hayashi4  = Bomber::Hayashi.new("../image/hayashi.png",  1, 13, 0, 0.3)
$enemy << hayashi5  = Bomber::Hayashi.new("../image/hayashi.png",  5, 12, 0, 0.4)
$enemy << hayashi6  = Bomber::Hayashi.new("../image/hayashi.png",  8,  7, 0,   0)
$enemy << hayashi7  = Bomber::Hayashi.new("../image/hayashi.png", 13, 13, 0, 0.1)
$enemy << hayashi8  = Bomber::Hayashi.new("../image/hayashi.png", 15, 11, 0, 0.2)
$enemy << hayashi9  = Bomber::Hayashi.new("../image/hayashi.png",  6, 10, 0, 0.3)
$enemy << hayashi10 = Bomber::Hayashi.new("../image/hayashi.png",  3,  9, 0, 0.4)
$enemy << mori1     = Bomber::Mori.new(   "../image/mori.png",    15, 12, 0, ono)
$enemy << mori2     = Bomber::Mori.new(   "../image/mori.png",     7,  3, 0, ono)
$enemy << mori3     = Bomber::Mori.new(   "../image/mori.png",    13,  1, 0, ono)
$enemy << mori4     = Bomber::Mori.new(   "../image/mori.png",     8,  9, 0, ono)
$enemy << mori5     = Bomber::Mori.new(   "../image/mori.png",    14,  1, 0, ono)
$enemy << mori6     = Bomber::Mori.new(   "../image/mori.png",     5,  3, 0, ono)
$enemy << mori7     = Bomber::Mori.new(   "../image/mori.png",     7,  6, 0, ono)
$enemy << mori8     = Bomber::Mori.new(   "../image/mori.png",     10,  9, 0, ono)

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
