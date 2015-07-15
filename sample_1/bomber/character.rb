module Bomber
  class Character < Smalruby::Character
    include Bomber
    def initialize(costume, x, y, angle)
      super(costume: costume, x: block(x), y: block(y), angle: angle)
    end

    def move_up
      self.y += -BLOCK/2
    end

    def move_down
      self.y += BLOCK/2
    end

    def move_right
      self.x += BLOCK/2
    end

    def move_left
      self.x += -BLOCK/2
    end
  end
end