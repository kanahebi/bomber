module Bomber
  class Door < Bomber::Character
    def initialize(*data)
      @close = true
      super(costume_lists, data[0].to_i, data[1].to_i, 0)
    end

    def costume_lists
      ["../image/door_close.png",
       "../image/door_open.png"]
    end

    def lose
      next_costume
      @close = !@close
      if @close
        $hit_obj << self
      else
        $hit_obj -= [self]
      end
    end
  end
end