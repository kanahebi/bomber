module Bomber
  class GameOver < Bomber::Character
    def initialize
      super("../image/gameover.png", 0, 0, 0)
      self.z = 20
    end
  end
end