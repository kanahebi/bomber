module Bomber
  class Block < Bomber::Character
    attr_accessor :col
    def initialize(data)
      if data.class == Hash
        @col = data['col']
        super("../image/block_#{data['col']}.png", data["x"].to_i, data["y"].to_i, 0)
      elsif data.class == Array
        super(costume_lists, data[0], data[1], 0)
      end
      self.z = 0
    end

    def destroy
      return if self.wall?
      $hit_obj -= [self]
      $all_obj -= [self]
      fire = Bomber::Fire.new(*self.current_block)
      self.vanish
      sleep 0.1
      fire.vanish
    end

    def wall?
      self.current_y_block == 0 or self.current_y_block == HEIGHT or self.current_x_block == 0 or self.current_x_block == WIDTH
    end

    def costume_lists
      ["../image/block_stone.png",
       "../image/block_brick.png",
       "../image/block_wood.png"]
    end

    def collar_lists
      ["stone", "brick", "wood"]
    end

    def add_event
      if Input.mouse_push?(M_LBUTTON)
        $blocks -= [self]
        self.vanish
      elsif Input.mouse_push?(M_RBUTTON)
        next_costume
        puts self.image.inspect
      else
      end
    end
  end
end