module Bomber
  class Character < Smalruby::Character
    attr_accessor :active
    include Bomber
    def initialize(costume, x, y, angle)
      @active = true
      super(costume: costume, x: block(x), y: block(y), angle: angle)
      self.z = 10
    end

    def move_up
      self.y += -BLOCK/2
      self.y -= -BLOCK/2 if self.any_hit?
      angle_shift(:up)
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

    def hit_target
      hit_char.flatten.each do |char|
        return char if self.hit?(char)
      end
      return nil
    end

    def any_hit?
      !!hit_target
    end

    def reject_half
      reject_y_half
      reject_x_half
    end

    def reject_y_half
      while current_y_half?
        if self.agl == :up
          self.move_up
        elsif self.agl == :down
          self.move_down
        end
        self.move_up   if current_y_half?
        self.move_down if current_y_half?
      end
    end

    def reject_x_half
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

    def next_block
      case self.agl
      when :up
        return [self.current_x_block, (self.current_y_block - 1)]
      when :down
        return [self.current_x_block, (self.current_y_block + 1)]
      when :right
        return [(self.current_x_block + 1), self.current_y_block]
      when :left
        return [(self.current_x_block - 1), self.current_y_block]
      end
    end

    def atack
      say(message: "エイ！")
      target = next_char(next_block)
      target.lose if target
      sleep 0.5
      say(message: "")
    end

    def lose
      fire = Bomber::Fire.new(*self.current_block)
      @active = false
      self.vanish
      self.guide.vanish
      $hit_obj -= [self]
      $all_obj -= [self]
      $enemy -= [self]
      sleep 0.1
      fire.vanish
    end

    def say(options = {})
      defaults = {
        message: '',
        second: 0,
      }
      opts = process_optional_arguments(options, defaults)

      message = opts[:message].to_s
      return if message == @current_message

      @current_message = message

      if @balloon
        @balloon.vanish
        @balloon = nil
      end

      return if message.empty?

      lines = message.to_s.lines.map { |l| l.scan(/.{1,10}/) }.flatten
      font = new_font(16)
      width = lines.map { |l| font.get_width(l) }.max
      height = lines.length * (font.size + 1)
      image = Image.new(width, height)

      lines.each.with_index do |line, row|
        image.draw_font(0, (font.size + 1) * row, line, font, [0, 0, 0])
      end
      @balloon = Sprite.new(x, y, image)
      @balloon.z = 10
    end

    def auto
      return if self.vanished?
    end
  end
end