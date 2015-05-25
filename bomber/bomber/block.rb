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
      ["../image/block_blk.png",
       "../image/block_red.png",
       "../image/block_yel.png",
       "../image/block_pnk.png",
       "../image/block_ppl.png",
       "../image/block_grn.png"]
    end

    def collar_lists
      ["blk", "red", "yel", "pnk", "ppl", "grn"]
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