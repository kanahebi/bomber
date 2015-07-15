require "./bomber"

character =Bomber::Character.new("../image/hito.png", 1, 1, 0)

character.on(:start) do
  on(:key_down, K_RIGHT) do
    self.x += Bomber::BLOCK/2
  end

  on(:key_down, K_LEFT) do
    self.x += -Bomber::BLOCK/2
  end

  on(:key_down, K_UP) do
    self.y += -Bomber::BLOCK/2
  end

  on(:key_down, K_DOWN) do
    self.y += Bomber::BLOCK/2
  end
end