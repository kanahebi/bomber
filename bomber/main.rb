require "./bomber"
require "yaml"

#extend Bomber
$all_char = Array.new
datas = YAML.load_file("./config.yml")
#back = Bomber::Character.new("../image/back.png", 0, 0, 0)
#apple = Bomber::Item.new("../image/apple.png", 10, 10, 0)
$blocks = Array.new
datas.each do |data|
  $blocks << block =  Bomber::Block.new(data)
end
$all_char << ono = Bomber::Ono.new("../image/ono.png", 1, 1, 0)
$all_char << hayashi1 = Bomber::Hayashi.new("../image/hayashi.png", 18, 1, 0)
$all_char << hayashi2 = Bomber::Hayashi.new("../image/hayashi.png", 12, 1, 0)
$all_char << hayashi3 = Bomber::Hayashi.new("../image/hayashi.png", 10, 8, 0)
$all_char << hayashi4 = Bomber::Hayashi.new("../image/hayashi.png", 1, 13, 0)
$all_char << hayashi5 = Bomber::Hayashi.new("../image/hayashi.png", 5, 12, 0)
$all_char << hayashi6 = Bomber::Hayashi.new("../image/hayashi.png", 8, 7, 0)
$all_char << hayashi7 = Bomber::Hayashi.new("../image/hayashi.png", 13, 13, 0)
$all_char << hayashi8 = Bomber::Hayashi.new("../image/hayashi.png", 15, 11, 0)
$all_char << hayashi9 = Bomber::Hayashi.new("../image/hayashi.png", 6, 10, 0)
$all_char << hayashi10 = Bomber::Hayashi.new("../image/hayashi.png", 3, 9, 0)
$all_char << mori = Bomber::Mori.new("../image/mori.png", 15, 12, 0)

$all_char << $blocks
$all_char.flatten!

ono.on(:start) do
  on(:key_down, K_RIGHT) do
    sleep 0.1
    self.move_right
  end

  on(:key_down, K_LEFT) do
    sleep 0.1
    self.move_left
  end

  on(:key_down, K_UP) do
    sleep 0.1
    self.move_up
  end

  on(:key_down, K_DOWN) do
    sleep 0.1
    self.move_down
  end

  on(:key_push, K_SPACE) do
    atack
    sleep 0.2
  end
end

hayashi1.on(:start) do
  loop do
    if self.active
      self.lets_go_hayashi
    end
  end
end
hayashi2.on(:start) do
  loop do
    if self.active
      self.lets_go_hayashi(0.1)
    end
  end
end
hayashi3.on(:start) do
  loop do
    if self.active
      self.lets_go_hayashi(0.3)
    end
  end
end
hayashi4.on(:start) do
  loop do
    if self.active
      self.lets_go_hayashi(0.2)
    end
  end
end
hayashi5.on(:start) do
  loop do
    if self.active
      self.lets_go_hayashi(0.4)
    end
  end
end
hayashi6.on(:start) do
  loop do
    if self.active
      self.lets_go_hayashi
    end
  end
end
hayashi7.on(:start) do
  loop do
    if self.active
      self.lets_go_hayashi(0.1)
    end
  end
end
hayashi8.on(:start) do
  loop do
    if self.active
      self.lets_go_hayashi(0.3)
    end
  end
end
hayashi9.on(:start) do
  loop do
    if self.active
      self.lets_go_hayashi(0.2)
    end
  end
end
hayashi10.on(:start) do
  loop do
    if self.active
      self.lets_go_hayashi(0.4)
    end
  end
end
mori.on(:start) do
  loop do
    if self.active
      self.tracking(ono)
    end
  end
end