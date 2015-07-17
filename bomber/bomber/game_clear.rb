module Bomber
  class GameClear < Bomber::Character
    def initialize
      super("../image/gameclear.png", 0, 0, 0)
      self.z = 20
    end
  end
end