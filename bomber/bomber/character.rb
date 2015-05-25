module Bomber
  class Character < Smalruby::Character
    attr_accessor :active
    include Bomber
    def initialize(costume, x, y, angle)
      @active = true
      super(costume: costume, x: block(x), y: block(y), angle: angle)
    end

    def move_up
      self.y += -BLOCK/2
      self.y -= -BLOCK/2 if self.any_hit?
      self.agl = :up
      guide_trace
    end

    def move_down
      self.y += BLOCK/2
      self.y -= BLOCK/2 if self.any_hit?
      self.agl = :down
      guide_trace
    end

    def move_right
      self.x += BLOCK/2
      self.x -= BLOCK/2 if self.any_hit?
      self.agl = :right
      guide_trace
    end

    def move_left
      self.x += -BLOCK/2
      self.x -= -BLOCK/2 if self.any_hit?
      self.agl = :left
      guide_trace
    end

    def any_hit?
      other_char.flatten.each do |other|
        return true if self.hit?(other)
      end
      return false
    end

    def reject_half
      while current_y_half?
        self.move_up
        self.move_down if current_y_half?
      end
      while current_x_half?
        self.move_right
        self.move_left if current_x_half?
      end
    end

    def guide_trace
      self.guide.trace if self.guide
    end

    def atack
      target = nil
      case @agl
      when :up
        target = current_char(self.current_x_block, (self.current_y_block - 1))
      when :down
        target = current_char(self.current_x_block, (self.current_y_block + 1))
      when :right
        target = current_char((self.current_x_block + 1), self.current_y_block)
      when :left
        target = current_char((self.current_x_block - 1), self.current_y_block)
      end
      target.lose if target
    end

    def lose
      fire = Bomber::Fire.new(*self.current_block)
      @active = false
      self.vanish
      self.guide.vanish
      $all_char -= [self]
      sleep 0.1
      fire.vanish
    end
  end
end