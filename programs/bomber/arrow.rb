module Bomber
  class Arrow < Bomber::Character
    def initialize(target)
      @target = target
      @agl = @target.agl
      super(*set_params, 0)
    end

    def costume_lists
      ["../image/arrow_up.png",
       "../image/arrow_down.png",
       "../image/arrow_left.png",
       "../image/arrow_right.png"]
    end

    def shoot
      return if self.vanished?
      case @agl
      when :up
        @vani = @init_block - 4 == self.current_y_block
        self.y += -BLOCK/2
      when :down
        @vani = @init_block + 4 == self.current_y_block
        self.y += BLOCK/2
      when :left
        @vani = @init_block - 4 == self.current_x_block
        self.x += -BLOCK/2
      when :right
        @vani = @init_block + 4 == self.current_x_block
        self.x += BLOCK/2
      end
      if self.any_hit?
        tag = hit_target
        if tag.class == Bomber::Block or tag.class == Bomber::Door
          @vani = true
        elsif tag == @target
          @vani = false
        else
          @vani = true
          tag.lose
        end
      end
      if @vani
        self.vanish
        self.active = false
      end
      sleep 0.2
    end

    def set_params
      block_x, block_y = @target.current_block
      case @agl
      when :up
        block_y# -= 1
        @init_block = block_y
      when :down
        block_y# += 1
        @init_block = block_y
      when :left
        block_x# -= 1
        @init_block = block_x
      when :right
        block_x# += 1
        @init_block = block_x
      end
      return ["../image/arrow_#{@agl.to_s}.png", block_x, block_y]
    end
  end
end