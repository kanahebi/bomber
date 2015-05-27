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
      angle_shift(:up)
      guide_trace
    end

    def move_down
      self.y += BLOCK/2
      self.y -= BLOCK/2 if self.any_hit?
      angle_shift(:down)
    end

    def move_right
      self.x += BLOCK/2
      self.x -= BLOCK/2 if self.any_hit?
      angle_shift(:right)
    end

    def move_left
      self.x += -BLOCK/2
      self.x -= -BLOCK/2 if self.any_hit?
      angle_shift(:left)
    end

    def any_hit?
      hit_char.flatten.each do |char|
        return true if self.hit?(char)
      end
      return false
    end

    def reject_half
      while current_y_half?
        if self.agl == :up
          self.move_up
        elsif self.agl == :down
          self.move_down
        end
        self.move_up  if current_y_half?
        self.move_down if current_y_half?
      end
      while current_x_half?
        if self.agl == :right
          self.move_right
        elsif self.agl == :left
          self.move_left
        end
        self.move_right if current_x_half?
        self.move_left  if current_x_half?
      end
    end

    def angle_shift(move_angle)
      self.agl = move_angle
      guide_trace
    end

    def guide_trace
      self.guide.trace if self.guide
    end

    def atack
      say(message: "エイ！")
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
      sleep 0.5
      say(message: "")
    end

    def lose
      fire = Bomber::Fire.new(*self.current_block)
      @active = false
      self.vanish
      self.guide.vanish
      $all_obj -= [self]
      $enemy -= [self]
      sleep 0.1
      fire.vanish
    end

    def auto
    end
  end
end