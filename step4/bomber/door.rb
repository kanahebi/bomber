module Bomber
  class Door < Bomber::Character
    attr_accessor :close
    def initialize(*data)
      @close = true
      super(costume_lists(data[2]), data[0].to_i, data[1].to_i, 0)
      self.z = 0
    end

    def costume_lists(data=:up)
      ["../image/door_#{data.to_s}_close.png",
       "../image/door_#{data.to_s}_open.png"]
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

    def destroy
      return if self.current_y_block == 0 or self.current_y_block == HEIGHT or self.current_x_block == 0 or self.current_x_block == WIDTH
      $hit_obj -= [self]
      $all_obj -= [self]
      fire = Bomber::Fire.new(*self.current_block)
      self.vanish
      sleep 0.1
      fire.vanish
    end
  end
end