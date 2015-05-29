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